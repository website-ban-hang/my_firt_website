const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/auth")
const TheOder = require("../models/TheOder")
const StorageCart = require("../models/StorageCart")
const TheOderController = require("../controllers/TheOderController")


// router.post("/", verifyToken, async (req, res) => {
//     const { address, tell, listStorage } = req.body
//     console.log(req.body);
//     const data = { user: req.userId, address, tell, listOder: listStorage, status: false };
//     console.log(data);
//     const newlistTheoder = new TheOder(data)
//     try {
//         const response = await newlistTheoder.save()
//         await StorageCart.deleteMany({ user: req.userId })
//         res.json({ message: "thành công", success: true })
//     } catch (error) {
//         console.log(error);
//     }
// })

router.post("/", verifyToken, TheOderController.postoder)
//lấy ra mặt hàng theo người dùng 
// router.get("/", verifyToken, async (req, res) => {
//     try {
//         const response = await TheOder.find({ user: req.userId })
//         res.json({ success: true, response })
//     } catch (error) {
//         console.log(error);
//     }
// })
//lấy ra mặt hàng theo người dùng 
router.get("/", verifyToken,TheOderController.getoder)
//lấy ra mặt hàng cho admin ( tất cả )
// router.get("/admintheoder", verifyToken, async (req, res) => {
//     try {
//         const response = await TheOder.find()
//         res.json({ success: true, response })
//     } catch (error) {
//         console.log(error);
//     }
// })
//lấy ra mặt hàng cho admin ( tất cả )
router.get("/admintheoder", verifyToken, TheOderController.getoderadmin)
// chấp nhận đơn hàng từ admin

// router.put("/:id",verifyToken,async(req,res)=>{
//     try {
//         const status =req.body.status
//         const id = req.params.id
//         console.log(status);
//         await TheOder.findByIdAndUpdate(id,{status:status},{new:true})
//         res.json({ success: true })
//     } catch (error) {
//         console.log(error);
//     }
// })
// chấp nhận đơn hàng từ admin

router.put("/:id",verifyToken,TheOderController.acceptoderadmin)

//xoa oder
// router.delete("/:id", verifyToken, async (req, res) => {
//     try {
//         const id = req.params.id
//         await TheOder.findByIdAndDelete(id)
//         res.json({ success: true })
//     } catch (error) {
//         console.log(error);
//     }
// })
//xoa oder
router.delete("/:id", verifyToken, TheOderController.deleteoder)

module.exports = router