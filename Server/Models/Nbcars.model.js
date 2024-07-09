const mongoose = require("mongoose");

const Nbcars = new mongoose.Schema({
    nbr: {type:Number},
    station:{type: mongoose.Schema.Types.ObjectId,ref: "Station"},
    gerent:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
    
},{timestamps:true})



const NbCar = mongoose.model("Nbcars",Nbcars)
module.exports=NbCar


