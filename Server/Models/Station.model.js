const mongoose = require("mongoose");

const station = new mongoose.Schema({
    nameStation: {type:String},
    phoneStation: {type:Number},
    emailStation:{type:String},
    area:{type:String},
    city:{type:String},
    state:{type:String},
    CodePostal:{type:String},
    gerent:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
    isBlocked: {type:Boolean, default:false}
},{timestamps:true})



const Station = mongoose.model("station",station)
module.exports=Station


