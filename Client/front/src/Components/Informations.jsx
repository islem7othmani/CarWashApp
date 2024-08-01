import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Informations({ user }) {
  // Changed to destructure id from props
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [stationData, setStationData] = useState({});
  const [stationUser, setStationUser] = useState("");
console.log("hhhhhhhhhh",user._id)
const id = user._id
  useEffect(() => {
    setStationUser(user.__id);
  }, [user.__id]);

  useEffect(() => {
    if (id) {
      getStationByUser(id);
    }
  }, [id]);

  // Handle input change for the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle the update form visibility
  const handleUpdate = () => {
    setIsUpdating(true);
  };






  const getStationById = async (stationId) => {
    try {
      const response = await fetch(`http://localhost:8000/station/getstation/${stationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const station = await response.json();
      return station; // Return the fetched station data
  
    } catch (error) {
      console.error('Error fetching station data:', error.message);
      throw error; // Re-throw the error to be handled by the calling code
    }
  };
  



  console.log("rlgjlerkglegjelrjgmeqrg", stationUser);
  const getStationByUser = async (stationUser) => {
    try {
      const response = await fetch(
        `http://localhost:8000/station/getInformations/${stationUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const stations = await response.json();
      setStationData(stations[0]); // Update to fetch the first station from the array
      setFormData({
        nameStation: stations[0].nameStation,
        phoneStation: stations[0].phoneStation,
        emailStation: stations[0].emailStation,
        area: stations[0].area,
        city: stations[0].city,
        state: stations[0].state,
        CodePostal: stations[0].CodePostal,
      });
      Cookies.set("stationId",stations[0]._id, { expires: 7 })
    } catch (error) {
      console.log("Error fetching user data:", error.message);
    }
  };

  console.log("rrrrr", stationData);
  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const stationId = Cookies.get("stationId");
      const response = await fetch(
        `http://localhost:8000/station/updateInformations/${stationData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nameStation: formData.nameStation,
            phoneStation: formData.phoneStation,
            emailStation: formData.emailStation,
            area: formData.area,
            city: formData.city,
            state: formData.state,
            CodePostal: formData.CodePostal, // Corrected to match the model attribute name
          }),
        }
      );

      
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      // Handle successful station update
      const updatedStation = await response.json();
      console.log("Updated station:", updatedStation);
      setIsUpdating(false); // Close the update form
    } catch (error) {
      console.error("Error updating station:", error.message);
    }
  };

  return (
    <div className="flex">
      <div className="w-96"></div>
      <div className="p-6 bg-white shadow-md rounded-lg w-2/3">
        {!isUpdating ? (
          <>
            <h1 className="text-blue-600 text-2xl font-bold">
              Informations about your station
            </h1>
            <div className="pt-6">
              <p>
                <span className="text-lg font-semibold pr-2">
                  Name of station:
                </span>
                <span className="font-medium text-gray-600">
                  {stationData.nameStation}
                </span>
              </p>
              <p>
                <span className="text-lg font-semibold pr-2">
                  Phone Number:
                </span>
                <span className="font-medium text-gray-600">
                  {stationData.phoneStation}
                </span>
              </p>
              <p>
                <span className="text-lg font-semibold pr-2">
                  Email address:
                </span>
                <span className="font-medium text-gray-600">
                  {stationData.emailStation}
                </span>
              </p>
              <p>
                <span className="text-lg font-semibold pr-2">Area:</span>
                <span className="font-medium text-gray-600">
                  {stationData.area}
                </span>
              </p>
              <p>
                <span className="text-lg font-semibold pr-2">State:</span>
                <span className="font-medium text-gray-600">
                  {stationData.city}
                </span>
              </p>
              <p>
                <span className="text-lg font-semibold pr-2">Country:</span>
                <span className="font-medium text-gray-600">
                  {stationData.state}
                </span>
              </p>
              <p>
                <span className="text-lg font-semibold pr-2">Post Code:</span>
                <span className="font-medium text-gray-600">
                  {stationData.CodePostal}
                </span>
              </p>
            </div>
            <div>
              <button
                onClick={handleUpdate}
                className="bg-blue-400 font-semibold text-white py-2 px-5 w-full shadow-xl rounded-xl mt-4"
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nameStation"
                className="block text-lg font-semibold"
              >
                Station Name
              </label>
              <input
                type="text"
                name="nameStation"
                id="nameStation"
                value={formData.nameStation}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="phoneStation"
                className="block text-lg font-semibold"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneStation"
                id="phoneStation"
                value={formData.phoneStation}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="emailStation"
                className="block text-lg font-semibold"
              >
                Email Address
              </label>
              <input
                type="email"
                name="emailStation"
                id="emailStation"
                value={formData.emailStation}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-lg font-semibold">
                Area
              </label>
              <input
                type="text"
                name="area"
                id="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-lg font-semibold">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-lg font-semibold">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="CodePostal"
                className="block text-lg font-semibold"
              >
                Post Code
              </label>
              <input
                type="text"
                name="CodePostal"
                id="CodePostal"
                value={formData.CodePostal}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-400 font-semibold text-white py-2 px-5 w-full shadow-xl rounded-xl mt-4"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsUpdating(false)}
              className="bg-gray-400 font-semibold text-white py-2 px-5 w-full shadow-xl rounded-xl mt-2"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
