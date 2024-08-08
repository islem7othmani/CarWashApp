const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
