const StorrageCart = require("../models/StorageCart");

class StorageCartController {
    async getstorage(req, res) {
        try {
            const listStorage = await StorrageCart.find({ user: req.userId });
            return res.json({ success: true, message: "Get thành công", listStorage });
        } catch (error) {
            console.error("Get storage cart error:", error);
            return res.status(500).json({ success: false, message: "Không thể tải giỏ hàng" });
        }
        constructor() {
        this.getstorage = this.getstorage.bind(this);
        this.poststorage = this.poststorage.bind(this);
        this.putstorage = this.putstorage.bind(this);
        this.deletestorage = this.deletestorage.bind(this);
    }
    }

    async poststorage(req, res) {
        const { img, title, quantily, money, address } = req.body || {};
        const quantity = Number(quantily);
        const price = Number(money);
        if (!title || !Number.isFinite(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
            return res.status(400).json({ success: false, message: "Thông tin sản phẩm không hợp lệ" });
        }
        try {
            const newpostsorage = await StorrageCart.create({
                user: req.userId,
                title,
                quantily: quantity,
                toltalmoney: quantity * price,
                address,
                img,
                money: price
            });
            return res.status(201).json({ success: true, message: "Thêm vào giỏ hàng thành công", newpostsorage });
        } catch (error) {
            console.error("Add storage cart error:", error);
            return res.status(500).json({ success: false, message: "Không thể thêm vào giỏ hàng" });
        }
    }

    async putstorage(req, res) {
        const quantity = Number(req.body && req.body.quantily);
        const totalMoney = Number(req.body && req.body.toltalmoney);
        if (!Number.isFinite(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: "Số lượng không hợp lệ" });
        }
        try {
            const update = { quantily: quantity };
            if (Number.isFinite(totalMoney) && totalMoney >= 0) update.toltalmoney = totalMoney;
            const updatedCart = await StorrageCart.findOneAndUpdate(
                { _id: req.params.id, user: req.userId },
                { $set: update },
                { new: true, runValidators: true }
            );
            if (!updatedCart) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ hàng" });
            }
            return res.json({ success: true, message: "Cập nhật giỏ hàng thành công", quantily: updatedCart });
        } catch (error) {
            console.error("Update storage cart error:", error);
            return res.status(500).json({ success: false, message: "Không thể cập nhật giỏ hàng" });
        }
    }

    async deletestorage(req, res) {
        try {
            const deletesorage = await StorrageCart.findOneAndDelete({
                _id: req.params.id,
                user: req.userId
            });
            if (!deletesorage) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ hàng" });
            }
            return res.json({ success: true, message: "Xóa thành công", deletesorage });
        } catch (error) {
            console.error("Delete storage cart error:", error);
            return res.status(500).json({ success: false, message: "Không thể xóa sản phẩm" });
        }
    }
}

module.exports = new StorageCartController();
