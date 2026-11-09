const express = require("express")
const storagecartcontroller = require("../controllers/storagecartcontroller")
const router = express.Router()
const verifyToken = require("../middleware/auth")
const StorrageCart = require("../models/StorageCart")





// router.get("/",verifyToken,async (req, res) => {
//   try {
//       const user = req.userId
//       console.log(user);
//       const response = await StorrageCart.find({user:req.userId})
//       console.log(typeof(response));
      
//      res.json({success:true,message:"Get thành công",listStorage:response})
    
//   } catch (error) {
//       console.log("lỗi sever");
//   }
// })

router.get("/",verifyToken,storagecartcontroller.getstorage)
  
// router.post("/", verifyToken, async (req, res) => {
//    const newuser= req.userId
//     const { status, img, title, quantily, money, address } = req.body
//     console.log(req.body);
//     const newquantily = ~~quantily
//     const newtoltalmoney = newquantily * money

//     const data = { user: newuser, title: title, quantily: newquantily, toltalmoney: newtoltalmoney, address: address,img:img ,money:money}
//     console.log(data);
//     try {
       
//         const newpostsorage = new StorrageCart(data)
//         await newpostsorage.save()
//         res.json({ success: true, message: "addstoragecart thành công", newpostsorage })

//     }
//     catch {
//         res.json({ success: false, message: "addstoragecart thất bại" })

//     }
// })
router.post("/", verifyToken, storagecartcontroller.poststorage)


// router.put("/quantily/:id",verifyToken,async(req,res)=>{
//     const quantily=req.body
//     console.log(quantily);
//     if(!quantily)
//     return res.status(400).json({success:false,message:"Không được để trống quantily"})
  
//     try {
//         const updatePost = await StorrageCart.findByIdAndUpdate({ _id:req.params.id},quantily,{new:true})
 
//         if(!updatePost) return res.json({ succsess: false, message: "tăng quantily thất bại", quantily:updatePost  })
//          res.json({ succsess: true, message: "addcart thành công", quantily:updatePost })
//         console.log(updatePost);
//     } catch (error) {
        
//         console.log(error);
//     }
// })
router.put("/quantily/:id",verifyToken,storagecartcontroller.putstorage)


// router.delete("/quantily/:id",verifyToken,async(req,res)=>{
//     try {
//         const storageDeleteCondition={_id:req.params.id,user:req.userId}
//         const deletesorage = await StorrageCart.findOneAndDelete(storageDeleteCondition)
//         if(!deletesorage) return res.status(401).json({success:false,message:"người dùng không hợp lệ"})
//         res.json({success:true,message:"thành công ",deletesorage})
//     } catch (error) {
//         console.log(error);
//     }

// })
router.delete("/quantily/:id",verifyToken,storagecartcontroller.deletestorage)
module.exports = router