// Replace with actual API calls and action creators based on your backend integration
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';

export const updateFormData = ({ name, value }) => ({
    type: 'UPDATE_FORM_DATA',
    payload: { name, value },
  });
  
  export const setStationData = (data) => ({
    type: 'SET_STATION_DATA',
    payload: data,
  });
  
  export const fetchStationData = () => async (dispatch) => {
    try {
      // Example API call to fetch station data
      const token = Cookies.get('token');
      const response = await fetch('http://localhost:8000/station/getStation', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const result = await response.json();
      dispatch(setStationData(result));
    } catch (error) {
      console.error('Error fetching station data:', error.message);
      toast.error('Error fetching station data: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  
  export const addStationData = (formData) => async (dispatch) => {
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
          city: formData.city,
          state: formData.state,
          CodePostal: formData.postCode,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const result = await response.json();
      dispatch(setStationData(result)); // Update station data in Redux store
    } catch (error) {
      console.error('Error adding station:', error.message);
      toast.error('Error adding station: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
   