const mongoose = require("mongoose");
const Car = require("../Models/Car.model");
const User = require("../Models/User.model");

const addCar = async (req, res) => {
  try {
    const { carname, model, version, marque } = req.body;

    const newCar = new Car({
      carname,
      model,
      version,
      marque,
      user: req.verifiedUser._id,
    });

    const savedCar = await newCar.save();
    return res.status(201).json(savedCar);
  } catch (err) {
    console.error("Error adding car:", err);
    return res.status(500).json({ error: err.message });
  }
};

const getCar = async (req, res) => {
  try {
    const carId = req.params.id;

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({ error: "Invalid car ID" });
    }

    const car = await Car.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(carId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          carname: 1,
          model: 1,
          version: 1,
          marque: 1,
          user: 1,
          userDetails: { $arrayElemAt: ["$userDetails", 0] },
        },
      },
    ]);

    if (!car || car.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    return res.status(200).json(car[0]);
  } catch (err) {
    console.error("Error fetching car:", err);
    return res.status(500).json({ error: err.message });
  }
};




const getCarByUser = async (req, res) => {
	try {
		const car = await Car.find({ user: req.params.id });
		return res.status(200).json(car);
	} catch (err) {
		return res.status(500).json(err);
	}
};



const deleteCar = async (req, res) => {
	const id = req.params.id;
	try {
		const car = await Car.findByIdAndDelete(id);
		return res.status(200).json(car);
	} catch (err) {
		return res.status(500).json(err);
	}
};


const updateStory = async (req, res) => {
	const id = req.params.id;
	try {
		const updatedStory = await Car.findByIdAndUpdate(
			id,
			req.body,
			{
				new: true,
			}
		);
		return res.status(200).json(updatedStory);
	} catch (err) {
		return res.status(500).json(err);
	}
};


module.exports = {
  addCar,
  getCar,
  getCarByUser,
  deleteCar,
  updateStory
};
