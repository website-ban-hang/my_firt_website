const express = require('express')
const app = express()
const multer = require('multer')
const router = express.Router()
const upload = multer({ dest: 'public' })
const fs = require("fs")
const verifyToken = require("../middleware/auth")
const Store = require("../models/Store")
const storecontroller = require('../controllers/storecontroller')


// router.post("/", verifyToken, upload.single('file'), async (req, res) => {
//   let filetype = req.file.mimetype.split("/")[1]
//   let newfileName = req.file.filename + "." + filetype
//   if(!filetype || !newfileName ) return res.json({ success: false, message: "Thiếu hình ảnh không được upload" })
//   fs.rename(`public/${req.file.filename}`, `public/${newfileName}`, (req, res) => {
//     console.log("thành côgn");
//   })
//   const { title, status, money } = req.body

//   try {
//     const file = new Store({
//       title, status, img: newfileName, uer: req.userId, money
//     })
//     await file.save()
//     res.json({ success: true, message: "addcart thành công", file })

//   } catch (error) {
//     res.json({ success: false, message: "lỗi upload" })
//   }
// })
router.post("/", verifyToken, upload.single('file'), storecontroller.poststorage)

//lấy ra tất cả mặt hàng
// router.get("/getlistCart", verifyToken, async (req, res) => {
//   try {
//     const reponse = await Store.find({})
//     if (!reponse) return res.status(400).json({ success: false, message: "lỗi server" })
//     res.json({ success: true, list: reponse })
//   } catch (error) {
//     res.json({ success: false, message: "lỗi không chạy được" })
//   }

// })
//lấy ra tất cả mặt hàng
router.get("/getlistCart", verifyToken, storecontroller.getstorage)
//lấy ra mặt hàng cho returnguest khách vãng lai 
// router.get("/getlistCartreturnguest", async (req, res) => {
//   try {
//     const reponse = await Store.find({})
//     if (!reponse) return res.status(400).json({ success: false, message: "lỗi server" })
//     res.json({ success: true, list: reponse })
//   } catch (error) {
//     res.json({ success: false, message: "lỗi không chạy được" })
//   }

// })

//lấy ra mặt hàng cho returnguest khách vãng lai 
router.get("/getlistCartreturnguest", storecontroller.getkhachvanglai)

// xóa một cart đã đăng 
// router.delete("/deletecart/:id", verifyToken, async (req, res) => {
//   try {
//     const optiondelete = { _id: req.params.id, user: req.userId }
//     const deletecart = await Store.findOneAndDelete(optiondelete)
//     if (!deletecart) return res.status(401).json({ success: false, message: "người dùng không hợp lệ" })
//     res.json({ success: true, message: "thành công ", deletecard: deletecart })
//   } catch (error) {

//   }
// })

// xóa một cart đã đăng 
router.delete("/deletecart/:id", verifyToken, storecontroller.deletestorage)

// router.put("/editcart/:id", verifyToken, upload.single('file'), async (req, res) => {
//   let filetype = req.file.mimetype.split("/")[1]
//   let newfileName = req.file.filename + "." + filetype
//   fs.rename(`public/${req.file.filename}`, `public/${newfileName}`, (req, res) => {
//   })
//   const { title, status, money } = req.body
//   try {
//     const param = req.params.id
//     const data2 = await Store.findOne({ param })
//     const updatePost = {
//       title, status, img: newfileName, uer: req.userId, money
//     }
//     const postUpdateConditon = { _id: req.params.id, user: req.userId }
//     const editput = await Store.findOneAndUpdate(postUpdateConditon, updatePost, { new: true })
//     if (!editput)
//       return res.status(401).json({ succsess: false, messaage: "thất bại ở auth" })
//     res.json({ success: true, message: "addcart thành công", listpost: editput })
//   } catch (error) {
//     res.json({ success: false, message: "lỗi upload" })

//   }
// })

router.put("/editcart/:id", verifyToken, upload.single('file'), storecontroller.putstorage)

//lấy một mặt hàng chi tiết 
// router.get("/detailcart/:id", verifyToken, async (req, res) => {
//   const params = req.params.id

//   try {
//     const detailcart = await Store.find({ params })
//     if (detailcart)
//       res.json({ success: true, message: " Get thành công ", detail: detailcart })
//   } catch (error) {

//   }
// })

//lấy một mặt hàng chi tiết 
router.get("/detailcart/:id", verifyToken, storecontroller.detailstorage)

module.exports = router