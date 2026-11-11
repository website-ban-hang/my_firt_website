const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/auth")
const TheOder = require("../models/TheOder")
const StorageCart = require("../models/StorageCart")
const User = require("../models/User")

class TheOderController {
    async postoder(req, res) {
        const { address, tell, listStorage } = req.body
        console.log(req.body);
        const data = { user: req.userId, address, tell, listOder: listStorage, status: false };
        console.log(data);
        const newlistTheoder = new TheOder(data)
        try {
            const response = await newlistTheoder.save()
            await StorageCart.deleteMany({ user: req.userId })
            res.json({ message: "thành công", success: true })
        } catch (error) {
            console.log(error);
        }
    }
    async getoder (req, res) {
        try {
            const response = await TheOder.find({ user: req.userId })
            res.json({ success: true, response })
        } catch (error) {
            console.log(error);
        }
    }
    async getoderadmin(req, res) {
        try {
            const response = await TheOder.find()
            res.json({ success: true, response })
        } catch (error) {
            console.log(error);
        }
    }
    async acceptoderadmin(req,res){
        try {
            const status =req.body.status
            const id = req.params.id
            console.log(status);
            await TheOder.findByIdAndUpdate(id,{status:status},{new:true})
            res.json({ success: true })
        } catch (error) {
            console.log(error);
        }
    }
    async deleteoder (req, res) {
        try {
            const user = await User.findById(req.userId).select("admin")
            if (!user) return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ" })
            const condition = user.admin === true
                ? { _id: req.params.id }
                : { _id: req.params.id, user: req.userId, status: false }
            const deleted = await TheOder.findOneAndDelete(condition)
            if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng hoặc đơn đã được xác nhận" })
            return res.json({ success: true, message: "Đã xóa đơn hàng" })
        } catch (error) {
            console.error("Delete order error:", error && error.name)
            return res.status(500).json({ success: false, message: "Không thể xóa đơn hàng" })
        }
    }
}

module.exports = new TheOderController;