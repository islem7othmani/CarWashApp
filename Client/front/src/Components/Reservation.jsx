
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
import SelectCar from "./SelectCar";
import io from 'socket.io-client';
import DateTimePicker from 'react-datetime-picker';
import paymentpopup from "../Images/paymentpopup.png";




const socket = io('http://localhost:5000'); // Connect to the server


function Reservation() {
  // const history = useHistory();
  const positionC = Cookies.get("position");
  const email = Cookies.get("email");
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
  const [message, setMessage] = useState('');
  const [reservationsById, setReservationsById] = useState([]);


  const { userId } = useParams();
//console.log("userid", userId)
const [date, setDate] = useState(new Date());
const [isDisabled, setIsDisabled] = useState(false);
const [reservationDetails, setReservationDetails] = useState({
  carSize: '',
  typeLavage: '',
  date: new Date(),
  hour: '',
  min: ''
});


  const washTypeMap = { interne: 0, externe: 1, interneexterne: 2 };
  const sizeMap = { small: 0, medium: 1, large: 2 };

 
  const [trainingData, setTrainingData] = useState([
    [1, 0, 0],  // 1 car, interne wash, small
    [2, 1, 1],  // 2 cars, externe wash, medium
    [3, 2, 2],  // 3 cars, interneexterne wash, large
    [1, 0, 1],  // 1 car, interne wash, medium
    [2, 1, 0],  // 2 cars, externe wash, small
    [3, 2, 0],  // 3 cars, interneexterne wash, small
    [1, 0, 2],  // 1 car, interne wash, large
    [2, 1, 2],  // 2 cars, externe wash, large
    [3, 2, 1],  // 3 cars, interneexterne wash, medium
  ]);

  const [outputData, setOutputData] = useState([
    [5],   // Wait time for 1 car, interne wash, small
    [15],  // Wait time for 2 cars, externe wash, medium
    [30],  // Wait time for 3 cars, interneexterne wash, large
    [40],  // Wait time for 1 car, interne wash, medium
    [60],  // Wait time for 2 cars, externe wash, small
    [90],  // Wait time for 3 cars, interneexterne wash, small
    [120], // Wait time for 1 car, interne wash, large
    [150], // Wait time for 2 cars, externe wash, large
    [160], // Wait time for 3 cars, interneexterne wash, medium
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
          console.log(response)
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
          //console.error("Error fetching location details:", err);
        }
      }
    };

    fetchLocationDetails();
  }, [latitude, longitude]);



  const extractLastPart = (encodedStateName) => {
    // Decode the encoded string
    const decodedString = decodeURIComponent(encodedStateName);
    
    // Split the string by space, get the last part, and convert it to lowercase
    const lastPart = decodedString.split(' ').pop().toLowerCase();
    
    return lastPart;
  };
  
  
  // Fetch stations based on state name
  const fetchStationByLocation = async (stateName) => {
    try {
      // Convert stateName to string and then to lowercase
      const stateNameStr = String(stateName).trim().toLowerCase();
      const encodedStateName = encodeURIComponent(stateNameStr);
   
      //console.log("The name of the state is", stateNameStr);
      //console.log(`Fetching stations for state: ${stateNameStr}`);  // Debugging line
      //console.log(`Encoded state name: ${encodedStateName}`);  // Debugging line
  const result = extractLastPart(stateName)
  console.log(result)
      const requestURL = `http://localhost:8000/station/getstations/${result}`; 
      //console.log(`Request URL: ${requestURL}`);  // Debugging line
  console.log(encodedStateName)
  console.log(stateName)
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
      //console.log('Stations data:', data);  // Debugging line
      setStations(data);  
      console.log(data)// Update stations to an array
    } catch (error) {
      setFetchError("Error fetching station data: " + error.message);  // Set fetch error
      //console.error("Error fetching station data:", error);  // Log the error for debugging
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
      //console.log('Fetched station data:', data);  // Debugging line
      setStationData(data);  // Update state with fetched data
        // //console.log(stationData.nbr)
      // Ensure there are at least 3 data points to access the 3rd one
      if (data.length > 0) {
        // Get the last object in the array
        const lastObject = data[data.length - 1];
        //console.log('Last object data:', lastObject);
      console.log(lastObject)
        // Extract the relevant properties from the last object
        const x = [
          [lastObject.waittimeSI],
          [lastObject.waittimeME],
          [lastObject.waittimeLIE],
          [lastObject.waittimeSI1],
          [lastObject.waittimeME1],
          [lastObject.waittimeLIE1],
          [lastObject.waittimeSI2],
          [lastObject.waittimeME2],
          [lastObject.waittimeLIE2],
        ];
        console.log(x)
        setOutputData(x);
        console.log(outputData)
        setNbrl(lastObject.nbr);
        setStatId(lastObject.station)

        // Retrain the model with the updated outputData
        const inputTensor = tf.tensor2d(trainingData);
        const outputTensor = tf.tensor2d(x);

        const newModel = tf.sequential();
        newModel.add(tf.layers.dense({ inputShape: [3], units: 10, activation: 'relu' }));
        newModel.add(tf.layers.dense({ units: 1 }));

        newModel.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        await newModel.fit(inputTensor, outputTensor, { epochs: 100 });
        //console.log('Model retrained with new output data!');
        setModel(newModel);
      } else {
        //console.error('Not enough data points to fetch the 3rd object.');
      }
    } catch (error) {
      setError("Error fetching station details: " + error.message);
      //console.error("Error fetching station details:", error);
    }
  };



  


const [statId,setStatId]=useState("");

  // Redirect to more information page (currently commented out)
  const redirectToInfo = (stationId) => {
    //console.log("Station ID:", stationId);
    fetchStationDetailsNbr(stationId);  // Fetch data when button is clicked
    // history.push(`/station-info/${stationId}`);
    setPopup(true);
    setStatId(stationId) 
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
      //console.log('Model trained!');
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
    //console.log("iddd",id)
     // setIsAvailable(!isAvailable);
 
         setShowreserv(true)
  }

  



























  const [showCar, setShowCar] = useState(false);
  const showCars = () => {

    setShowCar(true);

    fetchCarData(storedUser);
  };
  
  const disabledDateTimes = [
    new Date(2024, 6, 15, 3, 0), // July 15, 2024, at 3:00 AM
    new Date(2024, 6, 26, 0, 0), // July 26, 2024, at 12:00 AM
    new Date(2024, 6, 29, 0, 0), // July 29, 2024, at 12:00 AM
    new Date(2024, 6, 15, 18, 0) // July 15, 2024, at 6:00 PM
  ];

  const isDateTimeDisabled = (selectedDate) => {
    return disabledDateTimes.some(disabledDateTime =>
      selectedDate.getFullYear() === disabledDateTime.getFullYear() &&
      selectedDate.getMonth() === disabledDateTime.getMonth() &&
      selectedDate.getDate() === disabledDateTime.getDate() &&
      selectedDate.getHours() === disabledDateTime.getHours() &&
      selectedDate.getMinutes() === disabledDateTime.getMinutes()
    );
  };
  
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setIsDisabled(isDateTimeDisabled(newDate));
    setReservationDetails(prevDetails => ({
      ...prevDetails,
      date: newDate,
      hour: newDate.getHours(),
      min: newDate.getMinutes()
    }));
  };






  const [user, setUser] = useState("");
  const [status, setStatus] = useState(false);
  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/authentification/User/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure that cookies are sent with the request
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const userData = await response.json();
     setStatus(userData.isBlocked)
      //   console.log("user data", userData);
      //    console.log(user);
    } catch (error) {
      setError("Error fetching user data: " + error.message);
    }
  };

  fetchUserData(email)

  const fetchReservationsById = async (stationId) => {
    try {
      //console.log("Fetching reservations for:", stationId);
  
      const response = await fetch(`http://localhost:8000/reservation/reservations/${stationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorDetails}`);
      }
  
      const data = await response.json();
      //console.log("Fetched reservations for user:", data);
      setReservationsById(data);
  
      data.forEach(reservation => {
        //console.log("Reservation ID:", reservation.day);
        //console.log("Reservation ID:", reservation.month);
        //console.log("Reservation ID:", reservation.year);
        //console.log("Reservation ID:", reservation.hour);
        //console.log("Reservation ID:", reservation.min);
      });
  
    } catch (error) {
      //console.error('Failed to fetch reservations:', error);
    }
  };



  const fetchCarData = async (storedUser) => {
    //console.log(`Fetching car data for user ID: ${storedUser}`);
    try {
      const response = await fetch(`http://localhost:8000/car/getcarByUser/${storedUser}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      if (!response.ok) {
        throw new Error("Network response was not ok."); 
      }
    
      const cars = await response.json();
    //  //console.log("Fetched cars data:", cars);
      setCarsdata(cars);
      //console.log("riehgk",carsdata)
    } catch (error) {
      //console.error("Error fetching car data:", error);
      setError("Error fetching car data: " + error.message);
    }
    };





  const [carsdata, setCarsdata] = useState([]);
const [conflict, setConflict] = useState(false);

const handleReservationSubmit = async (e) => {
  e.preventDefault();

  const car = Cookies.get("carselected");
  const reservationData = {
    carId: car,
    user: userId, // Ensure userId is set correctly
    station: statId,  // Ensure statId holds the selected station ID
    carSize: reservationDetails.carSize,
    typeLavage: reservationDetails.typeLavage,
    day: reservationDetails.date.getDate(),
    month: reservationDetails.date.toLocaleString('default', { month: 'long' }),
    year: reservationDetails.date.getFullYear(),
    hour: reservationDetails.hour,
    min: reservationDetails.min
  };

  //console.log("Reservation data to send:", reservationData);

  // Check for conflicts
  const conflictFound = reservationsById.some(reservation =>
    reservation.day === reservationData.day &&
    reservation.month === reservationData.month &&
    reservation.year === reservationData.year &&
    reservation.hour === reservationData.hour &&
    reservation.min === reservationData.min
  );

  if (conflictFound) {
    //console.log("Conflict detected");
    setConflict(true);
    alert("This date is reserved");
    return; // Exit function if a conflict is found
  }

  // Proceed with reservation creation if no conflict
  try {
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
    //console.log("Reservation created:", responseData);

    // Reset reservation form
    setReservationDetails({
      carSize: '',
      typeLavage: '',
      date: new Date(),
      hour: '',
      min: ''
    });

    alert("Reservation created successfully!");

    // Emit notification
    if (socket) {
      socket.emit('sendNotification2', {
        message: 'reservation',
        stationId: statId // Emit the station ID along with the notification
      });
      //console.log("Sending notification to station:", statId);
    }

  } catch (error) {
    //console.error("Error creating reservation:", error);
    alert("Error creating reservation: " + error.message);
  }
};
const storedUser = Cookies.get("user");
//console.log("Stored user:", storedUser); // Log the stored cookie value
const [color,setColor]=useState("blue")


  
const extractFileName = (path) => {
  if (!path) {
    return ''; // or handle the error case as needed
  }
  return path.split('\\').pop().split('/').pop();
};


//const fileName = extractFileName(image);


const [selectedCarId, setSelectedCarId] = useState(null);
const [selectedImage,setSelectedImage] = useState(null);
const getCar = (id,image) => {
  // Set cookie with the selected car ID
  Cookies.set("carselected", id, { expires: 7 });
 

  // Update the selected car ID
  setSelectedCarId(id);
  setSelectedImage(image)
};


//fetchReservationsById('66914f58c7f5559bdcd6bd61')



  return (
    <>
      <Navbar />


      
      {status ? (
  <div className="w-full relative top-36">
    <div className="flex justify-center border rounded-xl mx-80 shadow-xl">
      <img src={paymentpopup} alt="Payment Popup" className="h-64" />
      <div className="space-y-2 ml-4 relative top-16">
        <h1 className="text-2xl font-bold text-red-600">Payment Required</h1>
        <p className="text-lg text-gray-700 pb-4">Please complete your payment to proceed.</p>
        <a href="" className="bg-blue-500 text-white py-2 w-48 mt-4 rounded-lg font-semibold shadow-xl px-4">Go to payment page</a>
      </div>
    </div>
  </div>
) : (
  <div>
    
    <div className="bg-gray-100 h-screen z-0 mt-6 w-screen ">
        <div className="relative top-20 left-2  sm:left-2 lg:left-12 xl:left-12">
          <h1 className="font-bold text-xl text-blue-600 pb-2">Stations Near You</h1>
          <p className="text-gray-700 font-medium">View detailed information about various car wash stations based on your geographical location</p>
        </div>

        <div className="flex flex-col relative top-28  w-full overflow-x-scroll">
          <div className="bg-gray-100 ">
            <div className="p-1.5 w-11/12 inline-block align-middle ml-12 ">
              <div className="border rounded-lg  ">
                <table className="min-w-full divide-y divide-gray-200 bg-white ">
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
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Reservation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {stations.length > 0 ? (
  stations
    .filter(stat => stat.gerentDetails && stat.gerentDetails.isBlocked === false) // Filter stations with unblocked gerents
    .map(stat => (
      <tr key={stat._id}>
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
          {stat.state}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
          {stat.phoneStation}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
          {stat.emailStation}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
          <button
            className="bg-blue-400 text-white rounded-xl shadow-xl py-1 px-4"
            onClick={() => {
              redirectToInfo(stat._id);
              fetchReservationsById(stat._id);
            }}
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
  <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
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
          <label htmlFor="numCars" className="block text-sm font-medium text-gray-700">Cars Waiting</label>
         <span className="font-bold text-xl">{nbrl}</span>
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
          onClick={() => reserv(statId)}
          className="w-full bg-green-500 text-white rounded-lg py-2 px-4 mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Reserve
        </button>
      </form>

      <button
        type="button"
        onClick={() => setPopup(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}

{showreserv && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-2xl h-auto ">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Enter Your Car Details</h1>
            <p className="text-gray-600 mb-6">Please provide the following details to estimate the wait time for your car wash.</p>
            
          <form onSubmit={handleReservationSubmit} className="space-y-4 h-80  ">
            <div className="">
            <label className="font-semibold flex gap-2">
              Car Size:
              <select className="  border-b" value={reservationDetails.carSize} onChange={(e) => setReservationDetails({ ...reservationDetails, carSize: e.target.value })}>
                
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
            <br  />
            <label className="font-semibold  flex gap-2">
              Type of Wash:
              <select className=" border-b"  value={reservationDetails.typeLavage} onChange={(e) => setReservationDetails({ ...reservationDetails, typeLavage: e.target.value })}>
                
                <option value="interne">Interne</option>
                <option value="externe">Externe</option>
                <option value="interneexterne">Interne & Externe</option>
              </select>
            </label>
            <br />
            <div>
              <div  className="flex gap-2">
      <h1 className="font-semibold ">Date:</h1>
      <DateTimePicker
        onChange={handleDateChange}
        value={date}
        disableClock={false}
        format="y-MM-dd h:mm a"
        clearIcon={null}
        disableCalendar={false}
        className="bg-gray-100 w-72 mb-2"
      />
      </div>
      {isDisabled ? (
        <p style={{ color: 'red' }}>This time slot is unavailable</p>
      ) : (
        <p className="text-gray-500 -mb-2">Selected date and time: {date.toString()}</p>
      )}
      <form className="hidden " onSubmit={handleReservationSubmit}>
        <input
          type="text"
          placeholder="Car Size"
          value={reservationDetails.carSize}
          onChange={(e) => setReservationDetails(prevDetails => ({ ...prevDetails, carSize: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Type of Lavage"
          value={reservationDetails.typeLavage}
          onChange={(e) => setReservationDetails(prevDetails => ({ ...prevDetails, typeLavage: e.target.value }))}
        />
        <button type="submit" disabled={isDisabled}>Submit Reservation</button>
      </form>
    </div>
            <br />
            </div>
            <div className="flex gap-3 ">
            <span onClick={showCars} className=" border border-blue-500  border-dashed py-4 px-4 text-blue-500 cursor-pointer hover:bg-gray-100 ">+ Select Car</span>
            <img src={`http://localhost:8000/uploads/${extractFileName(selectedImage)}`}  alt="" className="h-14" />
            </div>
            <button type="submit" className="bg-blue-500 py-1 w-full rounded-xl shadow-xl relative -top-1 sm:-top-1 lg:top-4 xl-top-4 text-white">Submit Reservation</button>
          </form>




          <button
        type="button"
        onClick={() => setShowreserv(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
        </div>
        </div>
      )}
  


  {showCar &&(
    <>
    <div>
 
     









    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-2xl h-auto ">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Enter Your Car Details</h1>
            <p className="text-gray-600 mb-6">Please provide the following details to estimate the wait time for your car wash.</p>
            

            {error && <p className="text-red-600">{error}</p>}

            <div className="relative overflow-x-auto max-h-96 overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Car</th>
            <th scope="col" className="px-6 py-3">Mark</th>
            <th scope="col" className="px-6 py-3">Select</th>
          </tr>
        </thead> 
        <tbody>
          {carsdata.length > 0 ? (
            carsdata.map((car, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <img src={`http://localhost:8000/uploads/${extractFileName(car.image)}`} alt="carimage" className="w-20 sm:w-20  lg:w-56 xm:w-12 shadow-xl" />
                </th>
                <td className="px-6 py-4 font-bold">{car.model}</td>
                <td className="px-6 py-4">
                  <button
                    key={car._id}
                    className={`font-semibold ${selectedCarId === car._id ? 'bg-green-500' : 'bg-blue-500'} rounded-lg py-2 px-5 text-white`}
                    onClick={() => getCar(car._id, car.image)}
                  >
                    Select
                  </button>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="h-48">
                <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute left-72 bottom-20"></div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

     </div>


     <button
            type="button"
            onClick={() => setShowCar(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
     </div>
     </div>
     </>
  )}
  </div>
)}

    </>
  );
}

export default Reservation;
