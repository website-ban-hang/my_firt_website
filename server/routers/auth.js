const express = require("express")
const User = require("../models/User")
const router = express.Router()
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/auth")
const verifyAdmin = require("../middleware/admin")
const AuthController = require("../controllers/AuthController")


//router Post api/auth/register
//desc Register iser
// access Public


//sửa thông tin từ admin
// router.put("/:id",verifyToken,async(req,res)=>{
// try {
// const {password,username,admin} = req.body
// if(username==="xuanhieu") return res.json({succsess:false,messaage:"Đây là adimin mày không được sửa"})
// const haspassword =  await argon2.hash(password)
// const GetPASSWORD= await User.findOne({username})
// console.log("getpas",GetPASSWORD.password)
// const checkpassword = (password==="")?GetPASSWORD.password:haspassword
// const data = {username,admin,password:checkpassword}
// const check ={_id:req.params.id}
// let POSTUPDATEConDITOn = { username: data.username }
// const edituser = await User.findOneAndUpdate(check,data,{new:true}).select("-password")
// if (!edituser)
// return res.status(401).json({ succsess: false, messaage: "thất bại ở auth" })
// res.json({succsess:true,messaage:"update thành công",post:edituser})
// } catch (error) {
    
// }
// })
//sửa thông tin từ admin
router.put("/:id",verifyToken,verifyAdmin,AuthController.editadmin)
//get APi/ath
// router.get("/login", verifyToken, async (req, res) => {
//     try {
//         const user = await User.findById(req.userId).select("-password")
//         console.log(user);
//         if (!user) return res.status(400).json({ success: false, message: "user not found" })
//         res.json({ success: true, user })   
//     } catch (error) {
//         res.status(400).json({ message: "lỗi sever", error })

//     }
// })
//get APi/ath
router.get("/login", verifyToken,AuthController.getapipath)
//đăng ký tài khoản
// router.post("/register", async (req, res) => {
//     const { username, password } = req.body
//     if (!username || !password) return res.status(400).json({ success: false, message: "Thiếu Tên đăng nhập hoặc mật khẩu" })
//     try {
//         const user = await User.findOne({ username })
//         //kiểm tra tên đăng nhập có tồn tại hay chưa
//         if (user) return res.json({ success: false, message: "tên đăng nhập đã tồn tại" })
//         //tất cả đều đúng
//         const haspassword = await argon2.hash(password)
//         const checkuser=(req.userId)==="xuanhieu"?true:false
//         const newuser = new User({
//             username: username,
//             password: haspassword,
//             admin:checkuser
//         })
//         newuser.save()
//         //Token
//         const accessToken = jwt.sign({ userId: newuser._id }, process.env.ACCESSTOKEN)
//         res.json({ success: true, message: "bạn đã tạo tài khoản thành công", accessToken })
//     } catch (error) {
//         res.status(400).json({ message: "lỗi sever", error })
//     }
// })
router.post("/register",  AuthController.dangky)
//GET API ADMIN
// router.get("/login/admin", verifyToken, async (req, res) => {
    
//     const useradmin = await User.findById(req.userId).select("-password")
//     if(useradmin.admin !==true)  return res.status(400).json({ success: false, message:`mày không phải là admin` })
//     try {
//         const user = await User.find().select("-password")
//         if (!user) return res.status(400).json({ success: false, message: "lỗi server" })
//         res.json({ success: true, user })

//     } catch (error) {
//         res.status(400).json({ message: "lỗi sever", error })

//     }
// })

//GET API ADMIN
router.get("/login/admin", verifyToken,AuthController.getapi)

//THêm tài khoản bằng admin
router.post("/register/admin",verifyToken, async (req, res) => {
    const useradmin = await User.findById(req.userId).select("-password")
    const { username, password,admin } = req.body
    if (!username || !password) return res.status(400).json({ success: false, message:`THiếu Tên đăng nhập hoặc mật khẩu`})
 
   else if(useradmin.admin !==true)  return res.status(400).json({ success: false, message:`mày không phải là admin` })
    try {
        const user = await User.findOne({ username })
        //kiểm tra tên đăng nhập có tồn tại hay chưa
        if (user) return res.json({ success: false, message: "tên đăng nhập đã tồn tại" })
        //tất cả đều đúng
        const haspassword = await argon2.hash(password)
        const newuser = new User({
            username: username,
            password: haspassword,
            admin:admin
        })
        newuser.save()
        //Token
        const accessToken = jwt.sign({ userId: newuser._id }, process.env.ACCESSTOKEN)
        res.json({ success: true, message: "bạn đã tạo tài khoản thành công", accessToken, user: req.userId })
    } catch (error) {
        res.status(400).json({ message: "lỗi sever", error })
    }
})

// đăng nhập
// router.post("/login", async (req, res) => {

    
//     const { username, password } = req.body
//     if (!username || !password) return res.status(400).json({ success: false, message: "Thiếu Tên đăng nhập hoặc mật khẩu" })
//     try {
//         const user = await User.findOne({ username })

//         if (!user) res.json({ success: false, message: "Mật Khẩu Hoặc Tên Đăng Nhập Chưa Chính Xác" })
//         //nếu như tên đăng nhập đúng tiếp theo sẽ kiểm tra mật khẩu 
//         const verifyPassword = await argon2.verify(user.password, password)
//         if (!verifyPassword) return res.json({ success: false, message: "Tên đăng nhập hoặc mật khẩu Không Chinh xác" })
//         //tất cả đúng
//         const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESSTOKEN)
//         console.log(accessToken)
//         if (verifyPassword) res.json({ success: true, message: "đăng nhập thành công", accessToken })
//     } catch (error) { }
// })
// đăng nhập
router.post("/login", AuthController.login)



module.exports = router
