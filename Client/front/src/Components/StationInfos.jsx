import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Informations from './Informations';
import { useNavigate } from 'react-router-dom';

const StationInfos = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    city: '',
    state: '',
    postCode: '',
  });
  const navigate = useNavigate();

  const [infos, setInfos] = useState(false); // State to manage form visibility
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [stationData, setStationData] = useState(null); // State to store station data

  useEffect(() => {
    let stationId2 = Cookies.get('stationId');
    if (stationId2) {
      fetchStationData(stationId2);
    }
  }, []);
const [showfom,setShowform]=useState("invisible ");
//console.log("yyyyyyyyy")
  const fetchStationData = async (stationId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8000/station/getInformations/${stationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      setStationData(result);
      setFormData({
        name: result.nameStation,
        phone: result.phoneStation,
        email: result.emailStation,
        area: result.area,
        city: result.city,
        state: result.state,
        postCode: result.CodePostal,
      });
      if (result){
        console.log("done")
      }
    } catch (error) {
      console.error('Error fetching station data:', error.message);
      toast.error('Error fetching station data: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'city' || name === 'state' ? value.toLowerCase() : value,
    });
  };
  

  const validateForm = () => {
    const { name, phone, email, area, city, state, postCode } = formData;
    let isValid = true;

    if (!name) {
      toast.error('Enter the station name', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }
    if (!phone) {
      toast.error('Enter your phone number', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }
    if (!email) {
      toast.error('Enter your email', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }
    if (!area) {
      toast.error('Enter the area', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }
    if (!city) {
      toast.error('Enter the city', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }
    if (!state) {
      toast.error('Enter the state', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }
    if (!postCode) {
      toast.error('Enter the post code', {
        position: 'top-right',
        autoClose: 3000,
      });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const token = Cookies.get('token');
      const response = await fetch('http://localhost:8000/station/informations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nameStation: formData.name,
          phoneStation: formData.phone,
          emailStation: formData.email,
          area: formData.area,
          city: formData.city.toLowerCase(),
          state: formData.state.toLowerCase(),
          CodePostal: formData.postCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      console.log('Station added:', result);

      // Set station ID in cookie
      Cookies.set('stationId', result._id, { expires: 7 }); // Expires in 7 days

      setStationData(result); // Update the station data
      setInfos(true); // Show the Informations component
      toast.success('Station added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate("/admin")
    } catch (error) {
      console.error('Error adding station:', error.message);
      toast.error('Error adding station: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  return (
    <div className="flex items-center justify-center p-12 relative bg-gray-50">
      <div className="mx-auto w-full max-w-[550px] relative -top-6 bg-gray-50">
       
        {!infos ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                Station Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Station Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="phone" className="mb-3 block text-base font-medium text-[#07074D]">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5 pt-3">
              <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                Address Details
              </label>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      name="area"
                      id="area"
                      placeholder="Enter area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      placeholder="Enter country"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      name="postCode"
                      id="post-code"
                      placeholder="Post Code"
                      value={formData.postCode}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Adding...' : 'Add Station Informations'} {/* Show loading state */}
              </button>
            </div>
          </form>
        ) : (
          <Informations stationData={stationData} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StationInfos;