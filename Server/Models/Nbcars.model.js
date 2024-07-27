const mongoose = require("mongoose");

const NbcarsSchema = new mongoose.Schema({
    nbr: { type: Number, required: true },
    waittimeSI: { type: Number },
    waittimeME: { type: Number },
    waittimeLIE: { type: Number },
    waittimeSI1: { type: Number },
    waittimeME1: { type: Number },
    waittimeLIE1: { type: Number },
    waittimeSI2: { type: Number },
    waittimeME2: { type: Number },
    waittimeLIE2: { type: Number },
    station: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
}, { timestamps: true });

const NbCar = mongoose.model("Nbcars", NbcarsSchema);
module.exports = NbCar;
