const mongoose = require("mongoose");

const reservation = new mongoose.Schema({
    carId: {type: mongoose.Schema.Types.ObjectId,ref: "Car"},
    carSize: {type:String},
    typeLavage:{type:String},
    gerent:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
    
},{timestamps:true})



const Reservation = mongoose.model("reservation",reservation)
module.exports=Reservation


