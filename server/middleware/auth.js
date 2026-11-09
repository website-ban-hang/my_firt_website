const jwt=require("jsonwebtoken")

const   verifyToken = (req,res,next)=>{
    const authHeader = req.header("Authorization")
    const token=authHeader && authHeader.split(" ")[1]
    if(!token) return res.status(401).json({success:false,message:"chưa có token"})
    try {
        const   decoded= jwt.verify(token,process.env.ACCESSTOKEN)
        req.userId=decoded.userId
        next()
    } catch (error) {
        console.log(error) 
        res.status(403).json({success:false,message:"lỗi Token"})
    }
}

module.exports = verifyToken