const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const TheOderschema = new Schema({
    address:{
        type:String,
    },
    tell:{
        type:String,
    },
    listOder:{
        type:Array,
    },
    totalMoney:{
        type:Number,
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    status:{
        type:Boolean
    },
    createAt:{
        type:Date,
        default:Date.now

    }
})

module.exports = mongoose.model("TheOders", TheOderschema)