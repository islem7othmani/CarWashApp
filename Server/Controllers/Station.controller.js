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



const updateStation = async (req, res) => {
	const id = req.params.id;
	try {
		const updatedStation = await Station.findByIdAndUpdate(
			id,
			req.body,
			{
				new: true,
			}
		);
		return res.status(200).json(updatedStation);
	} catch (err) {
		return res.status(500).json(err);
	}
};








const getStation = async (req, res) => {
  try {
    const stationId = req.params.id;

    if (!mongoose.isValidObjectId(stationId)) {
      return res.status(400).json({ error: "Invalid station ID" });
    }

    const station = await Station.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(stationId) } },
      {
        $lookup: {
          from: "users",
          localField: "gerent",
          foreignField: "_id",
          as: "gerentDetails",
        },
      },
      {
        $project: {
          nameStation:1,
          phoneStation:1,
          emailStation:1,
          area:1,
          city:1,
          state:1,
          CodePostal:1,
          gerentDetails: { $arrayElemAt: ["$gerentDetails", 0] },
        },
      },
    ]);

    if (!station || station.length === 0) {
      return res.status(404).json({ error: "Station not found" });
    }

    return res.status(200).json(station[0]);
  } catch (err) {
    console.error("Error fetching station:", err);
    return res.status(500).json({ error: err.message });
  }
};



const getStationsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    const stations = await Station.aggregate([
      { $match: { city: city } },
      {
        $lookup: {
          from: "users",
          localField: "gerent",
          foreignField: "_id",
          as: "gerentDetails",
        },
      },
      {
        $project: {
          nameStation: 1,
          phoneStation: 1,
          emailStation: 1,
          area: 1,
          city: 1,
          state: 1,
          CodePostal: 1,
          gerentDetails: { $arrayElemAt: ["$gerentDetails", 0] },
        },
      },
    ]);

    if (!stations || stations.length === 0) {
      return res.status(404).json({ error: "No stations found in the specified city" });
    }

    return res.status(200).json(stations);
  } catch (err) {
    console.error("Error fetching stations:", err);
    return res.status(500).json({ error: err.message });
  }
};

const getStationsByGerent = async (req, res) => {
  try {
    const { gerent } = req.params;

    if (!gerent) {
      return res.status(400).json({ error: 'Gerent parameter is required' });
    }

    const stationsg = await Station.aggregate([
      { $match: { gerent: new mongoose.Types.ObjectId(gerent) } }, // Convert `gerent` to ObjectId
      {
        $lookup: {
          from: 'users',
          localField: 'gerent',
          foreignField: '_id',
          as: 'gerentDetails',
        },
      },
      {
        $project: {
          nameStation: 1,
          phoneStation: 1,
          emailStation: 1,
          area: 1,
          city: 1,
          state: 1,
          CodePostal: 1,
          gerentDetails: { $arrayElemAt: ['$gerentDetails', 0] },
        },
      },
    ]);

    if (!stationsg || stationsg.length === 0) {
      return res.status(404).json({ error: 'No stations found for the specified gerent' });
    }

    return res.status(200).json(stationsg);
  } catch (err) {
    console.error('Error fetching stations:', err);
    return res.status(500).json({ error: err.message });
  }
};

 
const getStationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    const stations = await Station.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "gerent",
          foreignField: "_id",
          as: "gerentDetails",
        },
      },
      {
        $match: {
          "gerentDetails.email": email,
        },
      },
      {
        $project: {
          nameStation: 1,
          phoneStation: 1,
          emailStation: 1,
          area: 1,
          city: 1,
          state: 1,
          CodePostal: 1,
          gerentDetails: { $arrayElemAt: ["$gerentDetails", 0] },
        },
      },
    ]);

    if (!stations || stations.length === 0) {
      return res.status(404).json({ error: "No stations found for the specified email" });
    }

    return res.status(200).json(stations);
  } catch (err) {
    console.error("Error fetching stations:", err);
    return res.status(500).json({ error: err.message });
  }
};





module.exports = {
    StationInformations,
    updateStation,
    getStation,
    getStationsByCity,
    getStationsByGerent,
    getStationsByEmail
};
