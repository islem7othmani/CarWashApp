import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import paymentpopup from "../Images/paymentpopup.png";



export default function Informations({ user, status }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [stationData, setStationData] = useState({});
  const [stationUser, setStationUser] = useState("");

  const id = user._id;

  useEffect(() => {
    setStationUser(user._id); // Corrected from __id to _id
  }, [user._id]);

  useEffect(() => {
    if (id) {
      getStationByUser(id);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
      return station; 

    } catch (error) {
      console.error('Error fetching station data:', error.message);
      throw error;
    }
  };

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
      Cookies.set("stationId", stations[0]._id, { expires: 7 });
    } catch (error) {
      console.log("Error fetching user data:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");

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
            CodePostal: formData.CodePostal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const updatedStation = await response.json();
      console.log("Updated station:", updatedStation);
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating station:", error.message);
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
    
    ) : (
      <div className="w-full">
        <div className="w-96"></div>
        <div className="p-6 bg-white shadow-md relative rounded-lg lg:w-2/3 xl:w-2/3 lg:left-80 xl:left-80">
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
              <div>
                <button
                  type="submit"
                  className="bg-blue-400 font-semibold text-white py-2 px-5 w-full shadow-xl rounded-xl mt-4"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
}
