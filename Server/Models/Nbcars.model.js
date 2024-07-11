const mongoose = require("mongoose");

const Nbcars = new mongoose.Schema({
    nbr: {type:Number},
    waittimeSI: {type:Number},
    waittimeME: {type:Number},
    waittimeLIE: {type:Number},
    station:{type: mongoose.Schema.Types.ObjectId,ref: "Station"},
    
},{timestamps:true})



const NbCar = mongoose.model("Nbcars",Nbcars)
module.exports=NbCar


