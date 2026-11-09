const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        require,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
    },
    createAt:{
        type:Date,
        default:Date.now

    }
})

module.exports=mongoose.model("users",UserSchema)