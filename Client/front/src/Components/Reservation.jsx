import React, { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import * as tf from '@tensorflow/tfjs';
import Cookies from "js-cookie";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment';
import { UNSAFE_useRouteId, useParams } from 'react-router-dom';  // Import useParams from react-router-dom


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
  const [popup, setPopup] = useState(false);
  const [numCars, setNumCars] = useState(1);
  const [typeOfWash, setTypeOfWash] = useState('interne');
  const [sizeOfCar, setSizeOfCar] = useState('small');
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [model, setModel] = useState(null);
  const [stationId, setStationId] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [nbrl,setNbrl]=useState(0)  // Added to manage fetch errors
  const { userId } = useParams();
console.log("userid", userId)
  const [reservationDetails, setReservationDetails] = useState({
  
    carSize: '',
    typeLavage: '',
    date: new Date(),
    hour: 0,
    min: 0
  });

  const washTypeMap = { interne: 0, externe: 1, interneexterne: 2 };
  const sizeMap = { small: 0, medium: 1, large: 2 };

  const [trainingData, setTrainingData] = useState([
    [1, 0, 0],  // 1 car, interne wash, small
    [1, 1, 1],  // 2 cars, externe wash, medium
    [1, 2, 2],  // 3 cars, interneexterne wash, large
  ]);

  const [outputData, setOutputData] = useState([
    [0],  // Wait time for 1 car, interne wash, small
    [0], // Wait time for 2 cars, externe wash, medium
    [0], // Wait time for 3 cars, interneexterne wash, large
  ]);

  // Extract latitude and longitude from cookie data
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

  // Fetch location details based on latitude and longitude
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

  // Fetch stations based on state name
  const fetchStationByLocation = async (stateName) => {
    try {
      // Convert stateName to string and then to lowercase
      const stateNameStr = String(stateName).trim().toLowerCase();
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
      setFetchError("Error fetching station data: " + error.message);  // Set fetch error
      console.error("Error fetching station data:", error);  // Log the error for debugging
    }
  };
  
  // Fetch details of a specific station
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
        // console.log(stationData.nbr)
      // Ensure there are at least 3 data points to access the 3rd one
      if (data.length > 0) {
        // Get the last object in the array
        const lastObject = data[data.length - 1];
        console.log('Last object data:', lastObject);
      
        // Extract the relevant properties from the last object
        const x = [
          [lastObject.waittimeSI],
          [lastObject.waittimeME],
          [lastObject.waittimeLIE],
        ];
        setOutputData(x);
        setNbrl(lastObject.nbr);

        // Retrain the model with the updated outputData
        const inputTensor = tf.tensor2d(trainingData);
        const outputTensor = tf.tensor2d(x);

        const newModel = tf.sequential();
        newModel.add(tf.layers.dense({ inputShape: [3], units: 10, activation: 'relu' }));
        newModel.add(tf.layers.dense({ units: 1 }));

        newModel.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        await newModel.fit(inputTensor, outputTensor, { epochs: 100 });
        console.log('Model retrained with new output data!');
        setModel(newModel);
      } else {
        console.error('Not enough data points to fetch the 3rd object.');
      }
    } catch (error) {
      setError("Error fetching station details: " + error.message);
      console.error("Error fetching station details:", error);
    }
  };

  // Redirect to more information page (currently commented out)
  const redirectToInfo = (stationId) => {
    console.log("Station ID:", stationId);
    fetchStationDetailsNbr(stationId);  // Fetch data when button is clicked
    // history.push(`/station-info/${stationId}`);
    setPopup(true);
  };

  // Initialize model on component mount
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
  }, [trainingData, outputData]);

  // Calculate estimated wait time based on input values
  const handleCalculate = async () => {
    if (model) {
      const inputTensor = tf.tensor2d([[numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]]]);
      const prediction = model.predict(inputTensor);
      const waitTime = (await prediction.data())[0];
      setEstimatedWaitTime(waitTime);
    }
  };

  // Add new training data and update output data
  const handleAddTrainingData = () => {
    const newTrainingData = [...trainingData, [numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]]];
    const newOutputData = [...outputData, [Number(estimatedWaitTime)]];
    setTrainingData(newTrainingData);
    setOutputData(newOutputData);
  };

const [showreserv,setShowreserv]=useState(false)
  const reserv =(id)=>{
    console.log("iddd",id)
         setShowreserv(true)
  }

  






























const [showCar,setShowCar]=useState(false)

const showCars=()=>{
      setShowCar(true)
}






const handleReservationSubmit = async (e) => {
  console.log("azerty",stationId)
  e.preventDefault();
  try {
    const reservationData = {
      carId: "66965ae90d12ef140f05be4b",
      user: userId,
      station:"66914f58c7f5559bdcd6bd61",
      carSize: reservationDetails.carSize,
      typeLavage: reservationDetails.typeLavage,
      day: reservationDetails.date.getDate(),
      month: reservationDetails.date.toLocaleString('default', { month: 'long' }),
      year: reservationDetails.date.getFullYear(),
      hour: reservationDetails.hour,
      min: reservationDetails.min
    };

    console.log("Reservation data to send:", reservationData); // Log reservation data

    const response = await fetch("http://localhost:8000/reservation/reserv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read the response text for more information
      throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Reservation created:", responseData);

    // Reset reservation form
    setReservationDetails({
      carSize: '',
      typeLavage: '',
      date: new Date(),
      hour: '',
      min: ''
    });

    alert("Reservation created successfully!");

  } catch (error) {
    console.error("Error creating reservation:", error);
    alert("Error creating reservation: " + error.message);
  }
};



  return (
    <>
      <Navbar />
      <div className="bg-gray-100 h-screen z-0 mt-6">
        <div className="relative top-20 left-12">
          <h1 className="font-bold text-xl text-blue-600 pb-2">Stations Near You</h1>
          <p className="text-gray-700 font-medium">View detailed information about various car wash stations based on your geographical location</p>
        </div>

        <div className="flex flex-col relative top-36 bg-white">
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
                            <button onClick={() => reserv(stat._id)} className="bg-green-400 text-white rounded-xl shadow-xl py-1 px-4">
                              Reservation
                            </button>
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
                          colSpan="7"
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
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Car Details</h1>
      <p className="text-gray-600 mb-6">Please provide the following details to estimate the wait time for your car wash.</p>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="sizeOfCar" className="block text-sm font-medium text-gray-700">Car Size</label>
          <select
            id="sizeOfCar"
            value={sizeOfCar}
            onChange={(e) => setSizeOfCar(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label htmlFor="typeOfWash" className="block text-sm font-medium text-gray-700">Wash Type</label>
          <select
            id="typeOfWash"
            value={typeOfWash}
            onChange={(e) => setTypeOfWash(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="interne">Interior</option>
            <option value="externe">Exterior</option>
            <option value="interneexterne">Interior & Exterior</option>
          </select>
        </div>

        <div>
          <label htmlFor="numCars" className="block text-sm font-medium text-gray-700">Number of Cars</label>
         <span>{nbrl}</span>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate Wait Time
        </button>

        {estimatedWaitTime > 0 && (
          <div className="mt-4 text-center">
            <h5 className="text-lg font-medium text-gray-700">Estimated Wait Time</h5>
            <p className="text-2xl font-bold text-blue-600">{estimatedWaitTime.toFixed(2)} min</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddTrainingData}
          className="w-full bg-green-500 text-white rounded-lg py-2 px-4 mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add Training Data
        </button>
      </form>

      <button
        type="button"
        onClick={() => setPopup(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}

{showreserv && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Car Details</h1>
            <p className="text-gray-600 mb-6">Please provide the following details to estimate the wait time for your car wash.</p>
            
          <form onSubmit={handleReservationSubmit}>
            <label>
              Car Size:
              <select value={reservationDetails.carSize} onChange={(e) => setReservationDetails({ ...reservationDetails, carSize: e.target.value })}>
                <option value="">Select Car Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
            <br />
            <label>
              Type of Wash:
              <select value={reservationDetails.typeLavage} onChange={(e) => setReservationDetails({ ...reservationDetails, typeLavage: e.target.value })}>
                <option value="">Select Wash Type</option>
                <option value="interne">Interne</option>
                <option value="externe">Externe</option>
                <option value="interneexterne">Interne & Externe</option>
              </select>
            </label>
            <br />
            <label>
              Date:
              <DatePicker
                selected={reservationDetails.date}
                onChange={(date) => setReservationDetails({ ...reservationDetails, date })}
              />
            </label>
            <br />
            <label>
              Hour:
              <input type="number" value={reservationDetails.hour} onChange={(e) => setReservationDetails({ ...reservationDetails, hour: e.target.value })} />
            </label>
            <br />
            <label>
              Minutes:
              <input type="number" value={reservationDetails.min} onChange={(e) => setReservationDetails({ ...reservationDetails, min: e.target.value })} />
            </label>
            <br />
            <div>
            <span onClick={showCars} className="my-6 cursor-pointer">Select Car</span>
            </div>
            <button type="submit" className="bg-blue-500 py-1 w-full rounded-xl shadow-xl  text-white">Submit Reservation</button>
          </form>
        </div>
        </div>
      )}
  


  {showCar &&(
     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
     <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md">
       <h1 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Car Details</h1>
       <p className="text-gray-600 mb-6">Please provide the following details to estimate the wait time for your car wash.</p>




















       <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="p-4">
                    <div class="flex items-center">
                        <input id="radio-all-search" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="radio-all-search" class="sr-only">radio</label>
                    </div>
                </th>
                <th scope="col" class="px-6 py-3">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3">
                    Color
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Accessories
                </th>
                <th scope="col" class="px-6 py-3">
                    Available
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
                <th scope="col" class="px-6 py-3">
                    Weight
                </th>
                <th scope="col" class="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="w-4 p-4">
                    <div class="flex items-center">
                        <input id="radio-table-search-1" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="radio-table-search-1" class="sr-only">radio</label>
                    </div>
                </td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    Yes
                </td>
                <td class="px-6 py-4">
                    Yes
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4">
                    3.0 lb.
                </td>
                <td class="flex items-center px-6 py-4">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a>
                </td>
            </tr>
            
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="w-4 p-4">
                    <div class="flex items-center">
                        <input id="radio-table-search-3" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="radio-table-search-3" class="sr-only">radio</label>
                    </div>
                </td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple TV 4K
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4">
                    TV
                </td>
                <td class="px-6 py-4">
                    Yes
                </td>
                <td class="px-6 py-4">
                    No
                </td>
                <td class="px-6 py-4">
                    $179
                </td>
                <td class="px-6 py-4">
                    1.78 lb.
                </td>
                <td class="flex items-center px-6 py-4">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a>
                </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="w-4 p-4">
                    <div class="flex items-center">
                        <input id="radio-table-search-3" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="radio-table-search-3" class="sr-only">radio</label>
                    </div>
                </td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    AirTag
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    Yes
                </td>
                <td class="px-6 py-4">
                    No
                </td>
                <td class="px-6 py-4">
                    $29
                </td>
                <td class="px-6 py-4">
                    53 g
                </td>
                <td class="flex items-center px-6 py-4">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>













       </div>
       </div>
  )}
    </>
  );
}

export default Reservation;
