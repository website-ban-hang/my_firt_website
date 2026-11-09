const express = require("express")
const Post = require("../models/Post")
const router = express.Router()
const verifyToken = require("../middleware/auth")
const User = require("../models/User")

router.post("/",verifyToken,async(req,res)=>{
    const {title,description,url,status}=req.body
    //validation
    if(!title)
    return res.status(400).json({success:false,message:"Không được để trống title"})
    try {
        const newPost= new Post({
            title,description,url:(url.startsWith("htttps://"))?url : `https://${url}`,status:status ||"TO LEARN",
            user: req.userId,
        })
        await newPost.save()
    res.json({success:true,message:"post thành công",newPost})
    } catch (error) {
        
    }
})
router.put("/:id",verifyToken, async(req,res)=>{
    const {title,description,url,status}=req.body
    //validation
    if(!title)
    return res.status(400).json({success:false,message:"Không được để trống title"})
    try {
        let updatePost= {
            title,description:description||"",url:(url.startsWith("htttps://")?url : `https://${url}`)||"",status:status ||"TO LEARN",
            
        }
        const postUpdateConditon = {_id:req.params.id,user:req.userId}
        updatePost = await Post.findOneAndUpdate(postUpdateConditon,updatePost,{new:true})
        //user not authorised to update post
        if(!updatePost) return res.status(401).json({success:false,message:"người dùng không hợp lệ"})
        res.json({success:true,message:"thành công ",updatePost})
    } catch (error) {
        
    }
})

router.delete("/:id",verifyToken,async(req,res)=>{
    try {
        const postDeleteCondition={_id:req.params.id,user:req.userId}
        const deletePost = await Post.findOneAndDelete(postDeleteCondition)
        if(!deletePost) return res.status(401).json({success:false,message:"người dùng không hợp lệ"})
        res.json({success:true,message:"thành công ",deletePost})
    } catch (error) {
        
    }
})

//DELETE USER Từ ADMIN
router.delete("/admin/:id",verifyToken,async(req,res)=>{
    const useradmin = await User.findById(req.userId).select("-password")
    if(useradmin.admin !==true  )  return res.status(400).json({ success: false, message:`mày không phải là admin` })
else if (req.params.id===req.userId) return  res.status(400).json({ success: false, message:`mày không ĐƯỢC XÓA CHÍNH MÌNH` })
    try {
        const admin= useradmin.admin
        const nameADMIN= useradmin.username
        const postDeleteCondition={_id:req.params.id,admin:false}
        const data={_id:req.params.id}
        const offjecDeleteCondition = (nameADMIN==="xuanhieu")?data:postDeleteCondition
        const deleteUserAdm = await User.findOneAndDelete(offjecDeleteCondition)
        if(!deleteUserAdm) return res.status(401).json({success:false,message:"người dùng không hợp lệ"})
        res.json({success:true,message:"thành công ",userdlt:deleteUserAdm})
    } catch (error) {
        console.log("lỗi")
    }
})
module.exports= router