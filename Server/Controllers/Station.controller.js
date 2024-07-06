const mongoose = require('mongoose');
const Station = require('../Models/Station.model');

const StationInformations = async (req, res) => {
  try {
    const { nameStation, phoneStation, emailStation, area, city, state, CodePostal } = req.body;
    console.log("Verified User in Controller:", req.verifiedUser);

    if (!req.verifiedUser) {
      return res.status(403).json({ error: 'User not authenticated' });
    }

    const newStation = new Station({
      nameStation,
      phoneStation,
      emailStation,
      area,
      city,
      state,
      CodePostal,
      gerent: req.verifiedUser._id,
    });

    const savedStation = await newStation.save();
    return res.status(201).json(savedStation);
  } catch (err) {
    console.error("Error adding car:", err);
    return res.status(500).json({ error: err.message });
  }

};

module.exports = {
    StationInformations
};
