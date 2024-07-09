import React, { useState } from 'react';
import axios from 'axios';

const Position = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [error, setError] = useState('');

  const API_KEY = process.env.API_KEY; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocationDetails('');
    setError('');

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: `${latitude},${longitude}`,
          key: API_KEY,
          pretty: 1,
          no_annotations: 1,
        },
      });

      if (response.data.results.length === 0) {
        setLocationDetails('Location not found');
        return;
      }

      const components = response.data.results[0].components;
      const city = components.city || components.town || components.village || 'City not found';
      const state = components.state || 'State not found';
      const country = components.country || 'Country not found';

      setLocationDetails(`${city}, ${state}, ${country}`);
    } catch (err) {
      setError('Error fetching location details');
      console.error(err);
    }
  };

  return (
    <div className="city-finder">
      <h2>Find City by Coordinates</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
        >
          Find City
        </button>
      </form>
      {locationDetails && <p className="mt-4 text-lg font-medium text-gray-900">Location: {locationDetails}</p>}
      {error && <p className="mt-4 text-lg font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default Position;
