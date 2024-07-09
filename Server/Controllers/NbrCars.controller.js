const mongoose = require('mongoose');
const Nbcars = require('../Models/Nbcars.model');





const addNbCars = async (req, res) => {
    try {
      const { nbr } = req.body;
      console.log("Verified User in Controller:", req.verifiedUser);
  
      if (!req.verifiedUser) {
        return res.status(403).json({ error: 'User not authenticated' });
      }
  
      const newNbcars = new Nbcars({
        nbr,
        station: req.verifiedUser._id,
        gerent: req.verifiedUser._id,
      });
  
      const savedNbrcars = await newNbcars.save();
      return res.status(201).json(savedNbrcars);
    } catch (err) {
      console.error("Error adding car:", err);
      return res.status(500).json({ error: err.message });
    }
  
  };
  



 

  const getNbr = async (req, res) => {
    try {
      const nbrid = req.params.id;
  
      if (!mongoose.isValidObjectId(nbrid)) {
        return res.status(400).json({ error: "Invalid nbr cars ID" });
      }
  
      const nbr = await Nbcars.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(nbrid) } },
        {
          $lookup: {
            from: "users",
            localField: "gerent",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "stations",
            localField: "station",
            foreignField: "_id",
            as: "stationDetails",
          },
        },
        {
          $project: {
            nbr: 1,
            station: 1,
            gerent: 1,
            userDetails: { $arrayElemAt: ["$userDetails", 0] },
            stationDetails: { $arrayElemAt: ["$stationDetails", 0] },
          },
        },
      ]);
  
      if (!nbr || nbr.length === 0) {
        return res.status(404).json({ error: "nbr not found" });
      }
  
      return res.status(200).json(nbr[0]);
    } catch (err) {
      console.error("Error fetching car:", err);
      return res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    getNbr
  };
  
  








  module.exports = {
    addNbCars,
    getNbr
};
