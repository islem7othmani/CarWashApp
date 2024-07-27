const mongoose = require('mongoose');
const Nbcars = require('../Models/Nbcars.model');

// Add new number of cars
const addNbCars = async (req, res) => {
    try {
        const { nbr, waittimeSI, waittimeME, waittimeLIE, waittimeSI1, waittimeME1, waittimeLIE1, waittimeSI2, waittimeME2, waittimeLIE2, station } = req.body;

        if (!req.verifiedUser) {
            return res.status(403).json({ error: 'User not authenticated' });
        }

        if (!station) {
            return res.status(400).json({ error: 'Station ID is required' });
        }

        const newNbcars = new Nbcars({
            nbr,
            waittimeSI,
            waittimeME,
            waittimeLIE,
            waittimeSI1,
            waittimeME1,
            waittimeLIE1,
            waittimeSI2,
            waittimeME2,
            waittimeLIE2,
            station,
        });

        const savedNbrcars = await newNbcars.save();
        return res.status(201).json(savedNbrcars);
    } catch (err) {
        console.error("Error adding car:", err);
        return res.status(500).json({ error: err.message });
    }
};

// Get number of cars by ID
const getNbr = async (req, res) => {
    try {
        const nbrid = req.params.id;

        if (!mongoose.isValidObjectId(nbrid)) {
            return res.status(400).json({ error: "Invalid nbr cars ID" });
        }

        const nbcar = await Nbcars.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(nbrid) } },
            {
                $lookup: {
                    from: "stations",
                    localField: "station",
                    foreignField: "_id",
                    as: "stationDetails",
                },
            },
            { $unwind: { path: "$stationDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    nbr: 1,
                    waittimeSI: 1,
                    waittimeME: 1,
                    waittimeLIE: 1,
                    waittimeSI1: 1,
                    waittimeME1: 1,
                    waittimeLIE1: 1,
                    waittimeSI2: 1,
                    waittimeME2: 1,
                    waittimeLIE2: 1,
                    station: 1,
                    stationDetails: 1,
                },
            },
        ]);

        if (!nbcar || nbcar.length === 0) {
            return res.status(404).json({ error: "Nbcars not found" });
        }

        return res.status(200).json(nbcar[0]);
    } catch (err) {
        console.error("Error fetching car:", err);
        return res.status(500).json({ error: err.message });
    }
};

// Get number of cars by station ID
const getNbrByStation = async (req, res) => {
    try {
        const { station } = req.params;

        if (!mongoose.isValidObjectId(station)) {
            return res.status(400).json({ error: "Invalid station ID" });
        }

        const stations = await Nbcars.aggregate([
            { $match: { station: new mongoose.Types.ObjectId(station) } },
            {
                $lookup: {
                    from: "stations",
                    localField: "station",
                    foreignField: "_id",
                    as: "stationDetails",
                },
            },
            { $unwind: { path: "$stationDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    nbr: 1,
                    waittimeSI: 1,
                    waittimeME: 1,
                    waittimeLIE: 1,
                    waittimeSI1: 1,
                    waittimeME1: 1,
                    waittimeLIE1: 1,
                    waittimeSI2: 1,
                    waittimeME2: 1,
                    waittimeLIE2: 1,
                    station: 1,
                    "stationDetails.nameStation": 1,
                    "stationDetails.city": 1,
                    "stationDetails.state": 1,
                    "stationDetails.CodePostal": 1,
                },
            },
        ]);

        if (!stations || stations.length === 0) {
            return res.status(404).json({ error: "No records found for the specified station" });
        }

        return res.status(200).json(stations);
    } catch (err) {
        console.error("Error fetching records by station:", err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addNbCars,
    getNbr,
    getNbrByStation
};
