const mongoose = require("mongoose");
const Reservation = require("../Models/Reservation.model");

const reserv = async (req, res) => {
  try {
    const { carSize, typeLavage, day, month, year, hour, min, carId, user, station } = req.body;

    // Ensure all required fields are present
    if (!carId) {
      return res.status(400).json({ error: "Missing car information" });
    }
    if (!user) {
      return res.status(400).json({ error: "Missing user information" });
    }
    if (!station) {
      return res.status(400).json({ error: "Missing station information" });
    }

    const newReservation = new Reservation({
      carSize,
      typeLavage,
      day,
      month,
      year,
      hour,
      min,
      carId,
      user,
      station,
    });

    const savedReservation = await newReservation.save();
    return res.status(201).json(savedReservation);
  } catch (err) {
    console.error("Error adding reservation:", err);
    return res.status(500).json({ error: err.message });
  }
};








const getReservationsByStation = async (req, res) => {
  try {
    const { station } = req.params;

    if (!mongoose.isValidObjectId(station)) {
        return res.status(400).json({ error: "Invalid station ID" });
    }

    const objectId = new mongoose.Types.ObjectId(station);

    const reservations = await Reservation.aggregate([
        { $match: { station: objectId } },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
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
                carId: 1,
                user: 1,
                carSize: 1,
                typeLavage: 1,
                day: 1,
                month: 1,
                year: 1,
                hour: 1,
                min: 1,
                station: 1,
                "userDetails.name": 1,  // Assuming the user model has a name field
                "stationDetails.nameStation": 1,
                "stationDetails.city": 1,
                "stationDetails.state": 1,
                "stationDetails.CodePostal": 1,
            },
        },
    ]);

    if (!reservations || reservations.length === 0) {
        return res.status(404).json({ error: "No records found for the specified station" });
    }

    return res.status(200).json(reservations);
} catch (err) {
    console.error("Error fetching records by station:", err);
    return res.status(500).json({ error: err.message });
}

};





const deleteReservation = async (req, res) => {
	const id = req.params.id;
	try {
		const reservation = await Reservation.findByIdAndDelete(id);
		return res.status(200).json(reservation);
	} catch (err) {
		return res.status(500).json(err);
	}
};


module.exports = {
  reserv,
  getReservationsByStation,
  deleteReservation
};