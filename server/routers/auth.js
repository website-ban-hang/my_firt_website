const express = require("express");
const User = require("../models/User");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");
const AuthController = require("../controllers/AuthController");

router.put("/:id", verifyToken, verifyAdmin, AuthController.editadmin);
router.get("/login", verifyToken, AuthController.getapipath);
router.post("/register", AuthController.dangky);
router.get("/login/admin", verifyToken, AuthController.getapi);

router.get("/addresses", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("addresses");
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
        return res.json({ success: true, addresses: user.addresses || [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Không thể tải sổ địa chỉ" });
    }
});

router.post("/addresses", verifyToken, async (req, res) => {
    try {
        const { label, recipient, phone, address, isDefault } = req.body || {};
        if (!recipient || !/^0[0-9]{9,10}$/.test(String(phone || "")) || !address) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập tên người nhận, số điện thoại hợp lệ và địa chỉ" });
        }
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
        const makeDefault = Boolean(isDefault) || user.addresses.length === 0;
        if (makeDefault) user.addresses.forEach(item => { item.isDefault = false; });
        user.addresses.push({ label: label || "Nhà riêng", recipient, phone, address, isDefault: makeDefault });
        await user.save();
        return res.status(201).json({ success: true, addresses: user.addresses });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Không thể lưu địa chỉ" });
    }
});

router.put("/addresses/:id/default", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
        const target = user.addresses.id(req.params.id);
        if (!target) return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
        user.addresses.forEach(item => { item.isDefault = item._id.equals(target._id); });
        await user.save();
        return res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Không thể cập nhật địa chỉ mặc định" });
    }
});

router.delete("/addresses/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
        const target = user.addresses.id(req.params.id);
        if (!target) return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
        const wasDefault = target.isDefault;
        target.deleteOne();
        if (wasDefault && user.addresses.length) user.addresses[0].isDefault = true;
        await user.save();
        return res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Không thể xóa địa chỉ" });
    }
});

router.post("/register/admin", verifyToken, async (req, res) => {
    try {
        const useradmin = await User.findById(req.userId).select("admin");
        if (!useradmin || useradmin.admin !== true) return res.status(403).json({ success: false, message: "Bạn không có quyền quản trị" });
        const { username, password, admin } = req.body || {};
        if (!username || !password) return res.status(400).json({ success: false, message: "Thiếu tên đăng nhập hoặc mật khẩu" });
        if (await User.findOne({ username })) return res.status(409).json({ success: false, message: "Tên đăng nhập đã tồn tại" });
        const hashed = await argon2.hash(password);
        const newUser = await User.create({ username, password: hashed, admin: Boolean(admin) });
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESSTOKEN, { expiresIn: "7d" });
        return res.status(201).json({ success: true, message: "Đã tạo tài khoản", accessToken });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Không thể tạo tài khoản" });
    }
});

router.post("/login", AuthController.login);
module.exports = router;
