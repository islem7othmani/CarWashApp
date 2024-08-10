const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    name: { type: String },
    cardNumber: { type: String },
    exp: { type: Date },
    cvv: { type: Number },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    station: { type: mongoose.Schema.Types.ObjectId, ref: "Station"},
    isBlocked : {type:Boolean, default:false}
}, { timestamps: true });

const PaymentStation = mongoose.model("PaymentStation", paymentSchema);

module.exports = PaymentStation;
