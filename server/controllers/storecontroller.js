const express = require('express')
const app = express()
const multer = require('multer')
const router = express.Router()
const upload = multer({ dest: 'public' })
const fs = require("fs")
const verifyToken = require("../middleware/auth")
const Store = require("../models/Store")


class storecontroller {
    async poststorage(req, res) {
        let filetype = req.file.mimetype.split("/")[1]
        let newfileName = req.file.filename + "." + filetype
        if(!filetype || !newfileName ) return res.json({ success: false, message: "Thiếu hình ảnh không được upload" })
        fs.rename(`public/${req.file.filename}`, `public/${newfileName}`, (req, res) => {
          console.log("thành côgn");
        })
        const { title, status, money } = req.body
      
        try {
          const file = new Store({
            title, status, img: newfileName, uer: req.userId, money
          })
          await file.save()
          res.json({ success: true, message: "addcart thành công", file })
      
        } catch (error) {
          res.json({ success: false, message: "lỗi upload" })
        }
      }
      async getstorage(req, res) {
        try {
          const reponse = await Store.find({})
          if (!reponse) return res.status(400).json({ success: false, message: "lỗi server" })
          res.json({ success: true, list: reponse })
        } catch (error) {
          res.json({ success: false, message: "lỗi không chạy được" })
        }
      
      }
      async getkhachvanglai(req, res) {
        try {
          const reponse = await Store.find({})
          if (!reponse) return res.status(400).json({ success: false, message: "lỗi server" })
          res.json({ success: true, list: reponse })
        } catch (error) {
          res.json({ success: false, message: "lỗi không chạy được" })
        }
      
      }
      async deletestorage(req, res) {
        try {
          const optiondelete = { _id: req.params.id, user: req.userId }
          const deletecart = await Store.findOneAndDelete(optiondelete)
          if (!deletecart) return res.status(401).json({ success: false, message: "người dùng không hợp lệ" })
          res.json({ success: true, message: "thành công ", deletecard: deletecart })
        } catch (error) {
      
        }
      }
      async putstorage (req, res) {
        let filetype = req.file.mimetype.split("/")[1]
        let newfileName = req.file.filename + "." + filetype
        fs.rename(`public/${req.file.filename}`, `public/${newfileName}`, (req, res) => {
        })
        const { title, status, money } = req.body
        try {
          const param = req.params.id
          const data2 = await Store.findOne({ param })
          const updatePost = {
            title, status, img: newfileName, uer: req.userId, money
          }
          const postUpdateConditon = { _id: req.params.id, user: req.userId }
          const editput = await Store.findOneAndUpdate(postUpdateConditon, updatePost, { new: true })
          if (!editput)
            return res.status(401).json({ succsess: false, messaage: "thất bại ở auth" })
          res.json({ success: true, message: "addcart thành công", listpost: editput })
        } catch (error) {
          res.json({ success: false, message: "lỗi upload" })
      
        }
      }
      async detailstorage(req, res)  {
        const params = req.params.id
      
        try {
          const detailcart = await Store.find({ params })
          if (detailcart)
            res.json({ success: true, message: " Get thành công ", detail: detailcart })
        } catch (error) {
      
        }
      }

}
module.exports = new storecontroller;