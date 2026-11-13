const TheOder = require("../models/TheOder");
const StorageCart = require("../models/StorageCart");
const User = require("../models/User");

const normalizeStatus = value => value === true ? "processing" : value === false || value == null ? "processing" : value;

class TheOderController {
    async postoder(req, res) {
        try {
            const { address, tell, recipient, listStorage } = req.body || {};
            if (!address || !tell || !Array.isArray(listStorage) || !listStorage.length) {
                return res.status(400).json({ success: false, message: "Thiếu địa chỉ, số điện thoại hoặc sản phẩm trong đơn hàng" });
            }
            if (!/^0[0-9]{9,10}$/.test(String(tell))) {
                return res.status(400).json({ success: false, message: "Số điện thoại không hợp lệ" });
            }
            const totalMoney = listStorage.reduce((sum, item) => sum + Number(item.toltalmoney || 0), 0);
            const order = await TheOder.create({
                user: req.userId, address: String(address).trim(), tell: String(tell).trim(),
                recipient: String(recipient || "").trim(), listOder: listStorage,
                totalMoney, status: "processing"
            });
            await StorageCart.deleteMany({ user: req.userId });
            return res.status(201).json({ success: true, message: "Đặt hàng thành công", orderId: order._id });
        } catch (error) {
            console.error("Create order error:", error && error.name);
            return res.status(500).json({ success: false, message: "Không thể tạo đơn hàng" });
        }
    }

    async getoder(req, res) {
        try {
            const response = await TheOder.find({ user: req.userId }).sort({ createAt: -1 });
            return res.json({ success: true, response });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Không thể tải đơn hàng" });
        }
    }

    async getoderadmin(req, res) {
        try {
            const response = await TheOder.find().populate("user", "username").sort({ createAt: -1 });
            return res.json({ success: true, response });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Không thể tải danh sách đơn hàng" });
        }
    }

    async acceptoderadmin(req, res) {
        try {
            const { status } = req.body || {};
            const allowed = ["processing", "shipped", "delivered"];
            const nextStatus = typeof status === "boolean" ? (status ? "processing" : "processing") : status;
            if (!allowed.includes(nextStatus)) {
                return res.status(400).json({ success: false, message: "Trạng thái đơn hàng không hợp lệ" });
            }
            const updated = await TheOder.findByIdAndUpdate(req.params.id, { $set: { status: nextStatus } }, { new: true, runValidators: true });
            if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
            return res.json({ success: true, response: updated });
        } catch (error) {
            console.error("Update order status error:", error && error.name);
            return res.status(500).json({ success: false, message: "Không thể cập nhật trạng thái đơn hàng" });
        }
    }

    async deleteoder(req, res) {
        try {
            const user = await User.findById(req.userId).select("admin");
            if (!user) return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ" });
            const condition = user.admin === true
                ? { _id: req.params.id }
                : { _id: req.params.id, user: req.userId, status: { $in: [false, "processing"] } };
            const deleted = await TheOder.findOneAndDelete(condition);
            if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng hoặc đơn đã được vận chuyển" });
            return res.json({ success: true, message: "Đã xóa đơn hàng" });
        } catch (error) {
            console.error("Delete order error:", error && error.name);
            return res.status(500).json({ success: false, message: "Không thể xóa đơn hàng" });
        }
    }
}
module.exports = new TheOderController();
