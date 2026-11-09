const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/auth")
const StorrageCart = require("../models/StorageCart")

class storagecartcontroller{
    async getstorage (req, res){
        try {
            const user = req.userId
            console.log(user);
            const response = await StorrageCart.find({user:req.userId})
            console.log(typeof(response));
            
           res.json({success:true,message:"Get thành công",listStorage:response})
          
        } catch (error) {
            console.log("lỗi sever");
        }
      }
      async poststorage(req, res)  {
        const newuser= req.userId
         const { status, img, title, quantily, money, address } = req.body
         console.log(req.body);
         const newquantily = ~~quantily
         const newtoltalmoney = newquantily * money
     
         const data = { user: newuser, title: title, quantily: newquantily, toltalmoney: newtoltalmoney, address: address,img:img ,money:money}
         console.log(data);
         try {
            
             const newpostsorage = new StorrageCart(data)
             await newpostsorage.save()
             res.json({ success: true, message: "addstoragecart thành công", newpostsorage })
     
         }
         catch {
             res.json({ success: false, message: "addstoragecart thất bại" })
     
         }
     }
     async putstorage(req,res){
        const quantily=req.body
        console.log(quantily);
        if(!quantily)
        return res.status(400).json({success:false,message:"Không được để trống quantily"})
      
        try {
            const updatePost = await StorrageCart.findByIdAndUpdate({ _id:req.params.id},quantily,{new:true})
     
            if(!updatePost) return res.json({ succsess: false, message: "tăng quantily thất bại", quantily:updatePost  })
             res.json({ succsess: true, message: "addcart thành công", quantily:updatePost })
            console.log(updatePost);
        } catch (error) {
            
            console.log(error);
        }
    }
    async deletestorage(req,res){
        try {
            const storageDeleteCondition={_id:req.params.id,user:req.userId}
            const deletesorage = await StorrageCart.findOneAndDelete(storageDeleteCondition)
            if(!deletesorage) return res.status(401).json({success:false,message:"người dùng không hợp lệ"})
            res.json({success:true,message:"thành công ",deletesorage})
        } catch (error) {
            console.log(error);
        }
    
    }
}
module.exports = new storagecartcontroller;