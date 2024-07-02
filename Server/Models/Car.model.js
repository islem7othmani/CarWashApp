const mongoose = require("mongoose");

const car = new mongoose.Schema({
    carname: {type:String},
    model: {type:String},
    version: {type:String},
    marque: {type:String},
    user:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
    
},{timestamps:true})



const Car = mongoose.model("car",car)
module.exports=Car


