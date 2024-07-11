import React, { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import * as tf from '@tensorflow/tfjs';
import Cookies from "js-cookie";

function Reservation() {
 // const history = useHistory();
  const positionC = Cookies.get("position");
  const [data, setData] = useState(positionC);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [error, setError] = useState("");
  const [stations, setStations] = useState([]);
  const [stateName, setStateName] = useState("");
  const [stationData, setStationData] = useState(null); 
  const [popup, setpopup] = useState(false); 

  useEffect(() => {
    const handleSeparateCoordinates = () => {
      const decodedData = decodeURIComponent(data);
      const [lat, lon] = decodedData.split(",");
      setLatitude(lat);
      setLongitude(lon);
    };

    if (data) {
      handleSeparateCoordinates();
    }
  }, [data]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (latitude && longitude) {
        const API_KEY = "7209fd98662c49339fcd5befd8b86192";
        const requestURL = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${API_KEY}&pretty=1&no_annotations=1`;

        try {
          const response = await axios.get(requestURL);

          if (response.data.results.length === 0) {
            setLocationDetails("Location not found");
            return;
          }

          const components = response.data.results[0].components;
          const city = components.city || components.town || components.village || "City not found";
          const state = components.state || "State not found";
          const country = components.country || "Country not found";

          setStateName(state);
          setLocationDetails(`${city}, ${state}, ${country}`);
          fetchStationByLocation(state); // Fetch stations when state is obtained
        } catch (err) {
          setError("Error fetching location details");
          console.error("Error fetching location details:", err);
        }
      }
    };

    fetchLocationDetails();
  }, [latitude, longitude]);

  const fetchStationByLocation = async (stateName) => {
    try {
      // Convert stateName to string and then to lowercase
      const stateNameStr = String(stateName).trim().toLowerCase(); // Ensuring it's a string, trimming whitespace, and converting to lowercase
      const encodedStateName = encodeURIComponent(stateNameStr);
      
      console.log("The name of the state is", stateNameStr);
      console.log(`Fetching stations for state: ${stateNameStr}`);  // Debugging line
      console.log(`Encoded state name: ${encodedStateName}`);  // Debugging line

      const requestURL = `http://localhost:8000/station/getstations/${encodedStateName}`;
      console.log(`Request URL: ${requestURL}`);  // Debugging line

      const response = await fetch(requestURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Stations data:', data);  // Debugging line
      setStations(data);  // Update stations to an array
    } catch (error) {
      setError("Error fetching station data: " + error.message);
    }
  };







  const fetchStationDetailsNbr = async (stationId) => {
    try {
      const response = await fetch(`http://localhost:8000/nbrc/getnbrByStation/${stationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched station data:', data);  // Debugging line
      setStationData(data);  // Update state with fetched data
      console.log('Updated station data state:', data); // Debugging line to confirm state update
    } catch (error) {
      setError("Error fetching station details: " + error.message);
      console.error("Error fetching station details:", error); // Added to log the actual error
    }
  };

  const redirectToInfo = (stationId) => {
    console.log("Station ID:", stationId);
    fetchStationDetailsNbr(stationId);  // Fetch data when button is clicked
    // history.push(`/station-info/${stationId}`);
    setpopup(true)
  };




  //const [userD, setUserD] = useState("");
  const [numCars, setNumCars] = useState(1);
  const [typeOfWash, setTypeOfWash] = useState('interne');
  const [sizeOfCar, setSizeOfCar] = useState('small');
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [model, setModel] = useState(null);
  const [stationId, setStationId] = useState("");

  const washTypeMap = { interne: 0, externe: 1, interneexterne: 2 };
  const sizeMap = { small: 0, medium: 1, large: 2 };

  const [trainingData, setTrainingData] = useState([
    [1, 0, 0],  // 1 car, interne wash, small
    [2, 1, 1],  // 2 cars, externe wash, medium
    [3, 2, 2],  // 3 cars, interneexterne wash, large
  ]);

  const [outputData, setOutputData] = useState([
    [5],  // Wait time for 1 car, interne wash, small
    [15], // Wait time for 2 cars, externe wash, medium
    [30], // Wait time for 3 cars, interneexterne wash, large
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
    model.add(tf.layers.dense({ inputShape: [3], units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    const trainModel = async () => {
      await model.fit(inputTensor, outputTensor, { epochs: 100 });
      console.log('Model trained!');
      setModel(model);
    };

    trainModel();
  }, []);

  const handleCalculate = async () => {
    if (model) {
      const inputTensor = tf.tensor2d([[numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]]]);
      const prediction = model.predict(inputTensor);
      const waitTime = (await prediction.data())[0];
      setEstimatedWaitTime(waitTime);
    }
  };

  const handleAddTrainingData = () => {
    const newTrainingData = [...trainingData, [numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]]];
    const newOutputData = [...outputData, [Number(estimatedWaitTime)]];
    setTrainingData(newTrainingData);
    setOutputData(newOutputData);
  };



  return (
    <>
      <Navbar />
    <div className="bg-gray-100 h-screen z-0 mt-6">
      <div className="relative top-20 left-12">
        <h1 className="font-bold text-xl  text-blue-600 pb-2">Stations Near You</h1>
        <p className="text-gray-700 font-medium">View detailed information about various car wash stations based on your geographical location</p>
      </div>

      <div className="flex flex-col relative top-36  bg-white">
        <div className="-m-1.5 ">
          <div className="p-1.5 w-screen inline-block align-middle">
            <div className="border rounded-lg overflow-">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Station
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Area
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Number of Cars
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Wait Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stations.length > 0 ? (
                    stations.map((stat) => (
                      <tr key={stat.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {stat.nameStation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {stat.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {stat.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {stat.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {stat.numberOfCars}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          {stat.waitTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <button
                            className="bg-blue-400 text-white rounded-xl shadow-xl py-1 px-4"
                            onClick={() => redirectToInfo(stat._id)}
                          >
                            See More Information
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center"
                      >
                        No stations available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>



      {popup && (
  <div className="bg-black bg-opacity-75 h-screen  w-screen  fixed -top-2 right-0 -left-4 z-50 justify-center items-center">
    <div className="bg-white h-2/3 w-2/3 relative top-20 left-48 z-50 rounded-xl">
    <div className="bg-white rounded-xl">
    <h1 className="mb-2 font-bold text-xl p-6">Enter Informations About Your Car</h1>

    <div className="flex gap-4 pl-10 pb-2">
      <h5 className="font-bold text-lg text-blue-700">Number Of Car In This Station:</h5>
      <h3 className="text-xl font-bold text-blue-500">5</h3>
    </div>
    
<form class=" w-full px-12 space-y-2">
  <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your car's size</label>
  <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option selected>size</option>
    <option value="small">small</option>
    <option value="medium">medium</option>
    <option value="large">large</option>
  </select>


  <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lavage type</label>
  <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option selected>Interior</option>
    <option value="Interior">Interior</option>
    <option value="Exterior">Exterior</option>
    <option value="Interior-Exterior">Interior-Exterior</option>
  </select>



  <div>
    <h5 className="font-bold text-lg text-blue-700">Wait Time Estimation</h5>
    <h3 className="text-xl font-bold text-blue-500">23.25 min</h3>
  </div>
   

</form>
</div>
    </div>
  </div>
)}
    </>
  );
}

export default Reservation;
