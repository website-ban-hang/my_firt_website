const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const StorageCart = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String
    },
    quantily:{
        type:Number
    },
    toltalmoney:{
        type:Number
    },
    address:{
        type:String
    },
    img:{
        type:String
    },
    money:{
        type:Number
    },
    createAt:{
        type:Date,
        default:Date.now

    }
})



module.exports = mongoose.model("storagecarts", StorageCart)