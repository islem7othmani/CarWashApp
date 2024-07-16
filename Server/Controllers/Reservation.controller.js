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

module.exports = {
  reserv,
};
