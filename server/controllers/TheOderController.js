const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/auth")
const TheOder = require("../models/TheOder")
const StorageCart = require("../models/StorageCart")

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
            const id = req.params.id
            await TheOder.findByIdAndDelete(id)
            res.json({ success: true })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new TheOderController;