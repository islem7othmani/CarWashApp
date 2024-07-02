const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {type:String,required:true},
    email: {type:String,required:true},
    password: {type:String,required:true},
    profilepic: { type: String },
    phone: {type: Number},
    isActive: {type:Boolean, default: false},
    activationCode: {type: String},
    resetToken:{type: String},
    isAdmin: { type: Boolean, default: false },
},{timestamps:true})



const User = mongoose.model("user",user)
module.exports=User


