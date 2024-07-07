import { React, useState } from 'react';
import Cookies from 'js-cookie';

export default function CarCard({ car, onEdit }) {
  const [popup, setPopup] = useState(false);
  const [carData1, setCarData1] = useState({
    carname: car.carname || '',
    model: car.model || '',
    version: car.version || '',
    marque: car.marque || '',
    image: car.image || '',
  });

  // Handle input change for the update form
  const handleInputChange = (e) => {
    setCarData1({
      ...carData1,
      [e.target.name]: e.target.value,
    });
  };

  // Delete car functionality
  const deleteCar = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8000/car/deleteCar/${car._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log('Delete result:', result);
      if (result.success) {
        // Trigger a refresh or callback to update the list of cars
        window.location.reload();  // This will reload the page
      }
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  // Update car functionality
  const updateCar = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8000/car/updateCar/${car._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(carData1),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      // Handle successful car update
      const updatedCar = await response.json();
      console.log('Updated car:', updatedCar);
      setPopup(false);
      if (onEdit) {
        onEdit(); // Trigger a refresh or callback to update the list of cars
      }
    } catch (error) {
      console.error('Error updating car:', error.message);
    }
  };

  // Show and hide the form
  const showForm = () => {
    setPopup(true);
  };

  const closeForm = () => {
    setPopup(false);
  };

  return (
    <>
      <div className="w-72 h-96 relative top-10 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
        <a href="#">
          <img
            src={car.image}
            alt="Product"
            className="h-56 w-72 object-cover rounded-t-xl"
          />
          <div className="px-4 py-3 w-72">
            <p className="text-lg font-bold text-black truncate block capitalize">
              {car.carname}
            </p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg font-semibold text-black cursor-auto my-3">
                {car.marque}
              </p>
              <del>
                <p className="text-sm text-gray-600 cursor-auto ml-2">
                  {car.model}
                </p>
              </del>
              <del>
                <p className="text-sm text-gray-600 cursor-auto ml-2">
                  {car.version}
                </p>
              </del>
              <div className="space-y-2 space-x-2">
                <button className="bg-gray-200 rounded-lg py-1 px-2" onClick={showForm}>
                  Update
                </button>
                <button
                  className="rounded-xl border py-1 px-3"
                  onClick={deleteCar}
                >
                  Delete
                </button>
              </div>
            </div>
            <button className='w-full bg-blue-500 rounded-xl text-white py-1 px-4 relative top-2'>
              Add to lavage
            </button>
          </div>
        </a>
      </div>

      {popup && (
        <div
          id="default-modal"
          className="bg-black bg-opacity-75 h-screen w-full fixed top-0 -left-4 z-50 justify-center items-center"
        >
          <div className="relative p-4 top-12 left-1/4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                onClick={closeForm}
                className="absolute right-6 top-2 z-50"
              >
                X
              </button>
              <form
                className="py-20 relative left-28 space-y-2"
                onSubmit={updateCar}
              >
                <input
                  value={carData1.carname}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Car Name"
                  name="carname"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
                />
                <input
                  value={carData1.marque}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Mark"
                  name="marque"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
                />
                <input
                  value={carData1.image}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Image"
                  name="image"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
                />
                <input
                  value={carData1.model}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Model"
                  name="model"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
                />
                <input
                  value={carData1.version}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Version"
                  name="version"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
                />
                <button
                  type="submit"
                  className="relative top-4 py-2 px-36 left-5 rounded-full shadow-xl font-bold text-white"
                  style={{ backgroundColor: '#A2A8D3' }}
                >
                  Update Car
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
