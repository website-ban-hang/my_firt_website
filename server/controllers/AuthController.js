const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const createAccessToken = (userId) => {
    if (!process.env.ACCESSTOKEN) {
        throw new Error("Thiếu biến môi trường ACCESSTOKEN trên Vercel");
    }
    return jwt.sign({ userId }, process.env.ACCESSTOKEN, { expiresIn: "7d" });
};

class AuthController {
    async dangky(req, res) {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Thiếu tên đăng nhập hoặc mật khẩu" });
        }
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ success: false, message: "Tên đăng nhập đã tồn tại" });
            }

            const hashedPassword = await argon2.hash(password);
            const newUser = await User.create({
                username,
                password: hashedPassword,
                admin: false
            });
            const accessToken = createAccessToken(newUser._id);
            return res.status(201).json({
                success: true,
                message: "Bạn đã tạo tài khoản thành công",
                accessToken
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({
                success: false,
                message: "Không thể đăng ký tài khoản"
            });
        }
    }

    async getapi(req, res) {
        try {
            const adminUser = await User.findById(req.userId).select("-password");
            if (!adminUser || adminUser.admin !== true) {
                return res.status(403).json({ success: false, message: "Bạn không có quyền quản trị" });
            }
            const users = await User.find().select("-password");
            return res.json({ success: true, user: users });
        } catch (error) {
            console.error("Get admin users error:", error);
            return res.status(500).json({ success: false, message: "Không thể tải danh sách người dùng" });
        }
    }

    async login(req, res) {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Thiếu tên đăng nhập hoặc mật khẩu" });
        }
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Tên đăng nhập hoặc mật khẩu không chính xác"
                });
            }

            const passwordMatches = await argon2.verify(user.password, password);
            if (!passwordMatches) {
                return res.status(401).json({
                    success: false,
                    message: "Tên đăng nhập hoặc mật khẩu không chính xác"
                });
            }

            const accessToken = createAccessToken(user._id);
            return res.json({ success: true, message: "Đăng nhập thành công", accessToken });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ success: false, message: "Không thể đăng nhập lúc này" });
        }
    }

    async editadmin(req, res) {
        try {
            const { password, username, admin } = req.body || {};
            if (!username) {
                return res.status(400).json({ success: false, message: "Thiếu tên đăng nhập" });
            }
            if (username === "xuanhieu") {
                return res.status(403).json({ success: false, message: "Không thể sửa tài khoản quản trị chính" });
            }

            const existingUser = await User.findById(req.params.id);
            if (!existingUser) {
                return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
            }

            existingUser.username = username;
            if (typeof admin === "boolean") existingUser.admin = admin;
            if (password) existingUser.password = await argon2.hash(password);
            await existingUser.save();

            const safeUser = await User.findById(existingUser._id).select("-password");
            return res.json({ success: true, message: "Cập nhật thành công", post: safeUser });
        } catch (error) {
            console.error("Edit user error:", error);
            return res.status(500).json({ success: false, message: "Không thể cập nhật người dùng" });
        }
    }

    async getapipath(req, res) {
        try {
            const user = await User.findById(req.userId).select("-password");
            if (!user) {
                return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
            }
            return res.json({ success: true, user });
        } catch (error) {
            console.error("Get current user error:", error);
            return res.status(500).json({ success: false, message: "Không thể tải thông tin người dùng" });
        }
    }
}

module.exports = new AuthController();
