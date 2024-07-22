const mongoose = require("mongoose");

const reservation = new mongoose.Schema({
    carId: {type: mongoose.Schema.Types.ObjectId,ref: "Car"},
    user: {type: mongoose.Schema.Types.ObjectId,ref: "User"},
    carSize: {type:String},
    typeLavage:{type:String}, 
    day:{type:Number},
    month:{type:String},
    year:{type:Number},
    hour: {type:Number},
    min:{type:Number},
    station:{type: mongoose.Schema.Types.ObjectId,ref: "Station"},
    
},{timestamps:true})



const Reservation = mongoose.model("reservation",reservation)
module.exports=Reservation


