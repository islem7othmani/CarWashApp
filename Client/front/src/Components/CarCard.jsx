import React, { useState } from 'react';
import Cookies from 'js-cookie';

export default function CarCard({ car, onEdit }) {
  const [popup, setPopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [carData1, setCarData1] = useState({
    carname: car.carname || '',
    model: car.model || '',
    version: car.version || '',
    marque: car.marque || '',
    image: car.image || '',
  });

  const [imageFile, setImageFile] = useState(null);

  const extractFileName = (path) => {
    return path.split('\\').pop().split('/').pop();
  };

  const fileName = extractFileName(car.image);

  const handleInputChange = (e) => {
    setCarData1({
      ...carData1,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setCarData1({
      ...carData1,
      image: e.target.files[0].name,
    });
  };

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
        window.location.reload();  
      }
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const updateCar = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('carname', carData1.carname);
      formData.append('model', carData1.model);
      formData.append('version', carData1.version);
      formData.append('marque', carData1.marque);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`http://localhost:8000/car/updateCar/${car._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const updatedCar = await response.json();
      console.log('Updated car:', updatedCar);
      setPopup(false);
      if (onEdit) {
        onEdit(); 
      }
    } catch (error) {
      console.error('Error updating car:', error.message);
    }
  };

  const showForm = () => {
    setPopup(true);
  };

  const closeForm = () => {
    setPopup(false);
  };

  const showDeleteConfirmation = () => {
    setConfirmDelete(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDelete(false);
  };

  const handleDelete = async () => {
    await deleteCar(); 
    closeDeleteConfirmation(); 
    window.location.reload(); 
  };

  return (
    <>
      <div className="w-72 h-96 relative top-10 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
        <a href="#">
          <img
            src={`http://localhost:8000/uploads/${fileName}`}
            alt="Product"
            className="h-56 w-72 object-cover rounded-t-xl"
          />
          <div className="px-4 py-3 w-72 font-bold text-lg">
            <div className="">
              <p className="">
                Mark: {car.carname}
              </p>
              <p className="">
                Model: {car.model}
              </p>
            </div>
          </div>
        </a>
        <div className="w-full flex justify-center">
          <button className="bg-blue-500 rounded-lg text-white w-11/12 flex justify-center py-1 font-semibold mb-1" onClick={showForm}>
            Update
          </button>
        </div>
        <div className="w-full flex justify-center">
          <button
            className="bg-red-500 rounded-lg text-white w-11/12 flex justify-center py-1 font-semibold pb-1"
            onClick={showDeleteConfirmation}
          >
            Delete
          </button>
        </div>
      </div>

      {popup && (
        <div
          id="default-modal"
          className="bg-black bg-opacity-75 h-screen w-full fixed -top-4 -left-4 z-50 justify-center items-center"
        >
              <button
  type="button"
  onClick={closeForm}
  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
          <div className="relative p-4 top-12 left-1/4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        

              <form
                className="py-20 relative left-28 space-y-2"
                onSubmit={updateCar}
              >
              
                <h1 className='font-semibold text-xl text-blue-500 relative bottom-5'>Update Car Informations</h1>
                <input
                  value={carData1.carname}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Mark"
                  name="carname"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
                />
                <input
                  type="file"
                  placeholder="Image"
                  name="image"
                  className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2 pt-2"
                  onChange={handleImageChange}
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
                  className="relative top-4 py-2 px-36 left-2 rounded-full shadow-xl font-bold text-white"
                  style={{ backgroundColor: '#A2A8D3' }}
                >
                  Update Car
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          id="confirm-delete-modal"
          className="bg-black bg-opacity-75 h-screen w-screen fixed -top-4 -left-4 z-50 flex justify-center items-center"
        >
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this car?</p>
            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteConfirmation}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
