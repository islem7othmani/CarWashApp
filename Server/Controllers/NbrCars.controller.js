const mongoose = require('mongoose');
const Nbcars = require('../Models/Nbcars.model');





const addNbCars = async (req, res) => {
    try {
      const { nbr,waittimeSI,waittimeME,waittimeLIE } = req.body;
      console.log("Verified User in Controller:", req.verifiedUser);
  
      if (!req.verifiedUser) {
        return res.status(403).json({ error: 'User not authenticated' });
      }
  
      const newNbcars = new Nbcars({
        nbr,
        waittimeSI,
        waittimeME,
        waittimeLIE,
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
  
      // First, find the Nbcars document to ensure the station field is correct
      const nbcar = await Nbcars.findById(nbrid).exec();
      if (!nbcar) {
        return res.status(404).json({ error: "Nbcars not found" });
      }
  
      console.log("Nbcars Document:", JSON.stringify(nbcar, null, 2)); // Debugging log
  
      // Next, perform the aggregation pipeline
      const nbr = await Nbcars.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(nbrid) } },
        {
          $lookup: {
            from: "stations",
            localField: "station",
            foreignField: "_id",
            as: "stationDetails",
          },
        },
        {
          $unwind: {
            path: "$stationDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "gerent",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            nbr: 1,
            waittimeSI: 1,
            waittimeME: 1,
            waittimeLIE: 1,
            station: 1,
            gerent: 1,
            userDetails: 1,
            stationDetails: 1,
          },
        },
      ]);
  
      console.log("Aggregated Result:", JSON.stringify(nbr, null, 2)); // Debugging log
  
      if (!nbr || nbr.length === 0) {
        return res.status(404).json({ error: "nbr not found" });
      }
  
      return res.status(200).json(nbr[0]);
    } catch (err) {
      console.error("Error fetching car:", err);
      return res.status(500).json({ error: err.message });
    }
  };
  

  
  
  const getNbrByStation = async (req, res) => {
    try {
      const { station } = req.params;
  
      // Validate the station ID
      if (!mongoose.isValidObjectId(station)) {
        return res.status(400).json({ error: "Invalid station ID" });
      }
  
      // Convert the station ID to a new ObjectId instance
      const objectId = new mongoose.Types.ObjectId(station);
  
      // Perform the aggregation pipeline
      const stations = await Nbcars.aggregate([
        { $match: { station: objectId } },
        {
          $lookup: {
            from: "stations",
            localField: "station",
            foreignField: "_id",
            as: "stationDetails",
          },
        },
        {
          $unwind: {
            path: "$stationDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "gerent",
            foreignField: "_id",
            as: "gerentDetails",
          },
        },
        {
          $unwind: {
            path: "$gerentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            nbr: 1,
            waittimeSI: 1,
            waittimeME: 1,
            waittimeLIE: 1,
            station: 1,
            gerent: 1,
            "stationDetails.nameStation": 1,
            "stationDetails.city": 1,
            "stationDetails.state": 1,
            "stationDetails.CodePostal": 1,
            "gerentDetails.name": 1,
            "gerentDetails.email": 1,
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
