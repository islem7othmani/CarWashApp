import React, { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
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

  const redirectToInfo = (stationId) => {
    console.log("Station ID:", stationId);
    // history.push(`/station-info/${stationId}`);
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
    } catch (error) {
      setError("Error fetching station details: " + error.message);
    }
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
            <div className="border rounded-lg overflow-hidden">
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
                      City
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
                          {stat.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {stat.city}
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
    </>
  );
}

export default Reservation;
