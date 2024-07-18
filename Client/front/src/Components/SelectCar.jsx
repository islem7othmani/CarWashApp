import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function SelectCar() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [carsdata, setCarsdata] = useState([]);
  const [error, setError] = useState("");

    const storedUser = Cookies.get("user");
    console.log("Stored user:", storedUser); // Log the stored cookie value
 
  const fetchCarData = async (userId) => {
    console.log(`Fetching car data for user ID: ${userId}`);
    try {
      const response = await fetch(`http://localhost:8000/car/getcarByUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const cars = await response.json();
    //  console.log("Fetched cars data:", cars);
      setCarsdata(cars);
    } catch (error) {
      console.error("Error fetching car data:", error);
      setError("Error fetching car data: " + error.message);
    }
  };

      fetchCarData(storedUser);
  
  const getCar = (id) => {
    console.log("Selected car IDddddddddddddddddddddddddddddd:", id);
    Cookies.set("carselected",id, { expires: 7 })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Select the car
          </h1>
          <p className="text-gray-600 mb-6">
            Please select the car to wash.
          </p>

          {error && <p className="text-red-600">{error}</p>}

          <div className="relative overflow-x-auto">
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
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap dark:text-white">
                        <img src={car.image} alt="" className="w-56  shadow-xl " />
                      </th>
                      <td className="px-6 py-4">{car.mark}</td>
                      <td className="px-6 py-4">
                        <button className="bg-green-500 " onClick={() => getCar(car._id)}>Select</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">No cars available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
