import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Cookies from "js-cookie";
import paymentpopup from "../Images/paymentpopup.png";


const Estimation = ({ user , status }) => {
  const [userD, setUserD] = useState(user);
  const [numCars, setNumCars] = useState(1);
  const [typeOfWash, setTypeOfWash] = useState("interne");
  const [sizeOfCar, setSizeOfCar] = useState("small");
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [model, setModel] = useState(null);
  const [stationId, setStationId] = useState("");

  const washTypeMap = { interne: 0, externe: 1, interneexterne: 2 };
  const sizeMap = { small: 0, medium: 1, large: 2 };

  const [trainingData, setTrainingData] = useState([
    [1, 0, 0], // 1 car, interne wash, small
    [2, 1, 1], // 2 cars, externe wash, medium
    [3, 2, 2], // 3 cars, interneexterne wash, large
    [1, 0, 1], // 1 car, interne wash, small
    [2, 1, 0], // 2 cars, externe wash, medium
    [3, 2, 0], // 3 cars, interneexterne wash, large
    [1, 0, 2], // 1 car, interne wash, small
    [2, 1, 2], // 2 cars, externe wash, medium
    [3, 2, 1], // 3 cars, interneexterne wash, large
  ]);

  const [outputData, setOutputData] = useState([
    [5], // Wait time for 1 car, interne wash, small
    [15], // Wait time for 2 cars, externe wash, medium
    [30], // Wait time for 3 cars, interneexterne wash, large
    [60], // Wait time for 1 car, interne wash, small
    [70], // Wait time for 2 cars, externe wash, medium
    [80], // Wait time for 3 cars, interneexterne wash, large
    [100], // Wait time for 1 car, interne wash, small
    [120], // Wait time for 2 cars, externe wash, medium
    [150], // Wait time for 3 cars, interneexterne wash, large
  ]);

  useEffect(() => {
    const stationIdFromCookie = Cookies.get("stationId");
    if (stationIdFromCookie) {
      setStationId(stationIdFromCookie);
      console.log(`Station ID set from cookie: ${stationIdFromCookie}`);
    } else {
      console.error("Station ID not found in cookies.");
    }
  }, []);

  useEffect(() => {
    const inputTensor = tf.tensor2d(trainingData);
    const outputTensor = tf.tensor2d(outputData);

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [3], units: 10, activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    const trainModel = async () => {
      await model.fit(inputTensor, outputTensor, { epochs: 100 });
      console.log("Model trained!");
      setModel(model);
    };

    trainModel();
  }, []);

  const handleCalculate = async () => {
    if (model) {
      const inputTensor = tf.tensor2d([
        [numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]],
      ]);
      const prediction = model.predict(inputTensor);
      const waitTime = (await prediction.data())[0];
      setEstimatedWaitTime(waitTime);
    }
  };

  const handleAddTrainingData = () => {
    const newTrainingData = [
      ...trainingData,
      [numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]],
    ];
    const newOutputData = [...outputData, [Number(estimatedWaitTime)]];
    setTrainingData(newTrainingData);
    setOutputData(newOutputData);
  };

  const [carCount, setCarCount] = useState(0);
  const [inputValue, setInputValue] = useState({
    nbr: "",
    waittimeSI: outputData[0][0] || "",
    waittimeME: outputData[1][0] || "",
    waittimeLIE: outputData[2][0] || "",
    waittimeSI1: outputData[0][0] || "",
    waittimeME1: outputData[1][0] || "",
    waittimeLIE1: outputData[2][0] || "",
    waittimeSI2: outputData[0][0] || "",
    waittimeME2: outputData[1][0] || "",
    waittimeLIE2: outputData[2][0] || "",
    station: "",
  });

  // Fetch stationId from cookies
  useEffect(() => {
    const stationIdFromCookie = Cookies.get("stationId");
    if (stationIdFromCookie) {
      setStationId(stationIdFromCookie);
    } else {
      console.warn("Station ID not found in cookies");
    }
  }, []);

  useEffect(() => {
    if (stationId) {
      setInputValue((prevState) => ({
        ...prevState,
        station: stationId,
      }));
      console.log(`Input value updated with station ID: ${stationId}`);
    }
  }, [stationId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCar = async () => {
    // Check that stationId is correctly set from the cookie before submission
    if (!inputValue.station) {
      alert("Station ID is not set. Please refresh the page or try again.");
      return;
    }

    if (
      !inputValue.nbr ||
      !inputValue.waittimeSI ||
      !inputValue.waittimeME ||
      !inputValue.waittimeLIE ||
      !inputValue.waittimeSI1 ||
      !inputValue.waittimeME1 ||
      !inputValue.waittimeLIE1 ||
      !inputValue.waittimeSI2 ||
      !inputValue.waittimeME2 ||
      !inputValue.waittimeLIE2
    ) {
      alert("Please enter all required fields.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8000/nbrc/addNbrCars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inputValue),
      });

      if (response.ok) {
        const result = await response.json();
        setCarCount(result.nbr);
        alert("Car count updated successfully!");
      } else {
        alert("Failed to update car count.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    status ? (
      <div className="w-full">
      <div className="flex justify-center border rounded-xl mx-80 shadow-xl">
        <img src={paymentpopup} alt="" className='h-64' />
        <div className="space-y-2 ml-4 relative top-16"> 
          <h1 className="text-2xl font-bold text-red-600">Payment Required</h1>
          <p className="text-lg text-gray-700 pb-4">Please complete your payment to proceed.</p>
          <a href="" className="bg-blue-500 text-white py-2 w-48 mt-4 rounded-lg font-semibold shadow-xl px-4">Go to payment page</a>
        </div>
      </div>
    </div>
    

    ):(
      <>
      <div className="flex">
      <div className="w-96"></div>
      <div className="bg-gray-50 p-4 relative w-screen pl-6 h-screen space-y-6">
        <a
          className="relative left-0 bg-gray-900 block p-6 border border-gray-100 rounded-lg"
          href="#"
        >
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
          <div className="my-4 space-y-1">
            <h2 className="text-white text-2xl font-bold pb-2">
              Current Number of Cars in Station
            </h2>
            <p className="text-gray-300 py-1">
              Update the number of cars so your clients can see the frequency of
              your station.
            </p>
            <input
              type="number"
              value={inputValue.nbr}
              name="nbr"
              onChange={handleInputChange}
              className="w-1/3 rounded-xl pl-2"
              placeholder="Number of cars"
            />
          </div>
          <div className="grid grid-cols-1">
            <div className="flex justify-end text-white font-bold text-5xl relative -top-16 sm:-top-16 lg:-top-24 xl:-top-24 right-24">
              <span>{carCount}</span>
            </div>
          </div>
        </a>
        <div>
          <div className="font-semibold mt-4">
            <h3>Training Data Wait Times</h3>
            <div className="mt-2">
              <span>Wait Time for 1 Car, Interne Wash, Small Car (SI):</span>
              <input
                type="number"
                name="waittimeSI"
                value={inputValue.waittimeSI}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>Wait Time for 2 Cars, Externe Wash, Medium Car (ME):</span>
              <input
                type="number"
                name="waittimeME"
                value={inputValue.waittimeME}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>
                Wait Time for 3 Cars, Interneexterne Wash, Large Car (LIE):
              </span>
              <input
                type="number"
                name="waittimeLIE"
                value={inputValue.waittimeLIE}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>Wait Time for 1 Car, Interne Wash, Small Car (SI):</span>
              <input
                type="number"
                name="waittimeSI1"
                value={inputValue.waittimeSI1}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>Wait Time for 2 Cars, Externe Wash, Medium Car (ME):</span>
              <input
                type="number"
                name="waittimeME1"
                value={inputValue.waittimeME1}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>
                Wait Time for 3 Cars, Interneexterne Wash, Large Car (LIE):
              </span>
              <input
                type="number"
                name="waittimeLIE1"
                value={inputValue.waittimeLIE1}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>Wait Time for 1 Car, Interne Wash, Small Car (SI):</span>
              <input
                type="number"
                name="waittimeSI2"
                value={inputValue.waittimeSI2}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>Wait Time for 2 Cars, Externe Wash, Medium Car (ME):</span>
              <input
                type="number"
                name="waittimeME2"
                value={inputValue.waittimeME2}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
            <div className="mt-2">
              <span>
                Wait Time for 3 Cars, Interneexterne Wash, Large Car (LIE):
              </span>
              <input
                type="number"
                name="waittimeLIE2"
                value={inputValue.waittimeLIE2}
                onChange={handleInputChange}
                className="ml-2 rounded-xl py-2 px-8 shadow-xl"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleAddCar}
              className="px-2 py-1 text-white w-80 bg-gray-800 relative top-10 border border-gray-200 font-semibold rounded hover:bg-gray-400  "
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
    )
   
  );
};

export default Estimation;
