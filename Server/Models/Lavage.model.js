const mongoose = require("mongoose");

const lavage = new mongoose.Schema({
    type: {type:String},
    station: {type:String},//would be like car and user
    time:{type:String},
    user:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
    car:{type: mongoose.Schema.Types.ObjectId,ref: "Car"},
    
},{timestamps:true})



const Lavage = mongoose.model("lavage",lavage)
module.exports=Lavage


