import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import website from '../Images/website.png'

// Fix the marker icon issue in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

const MapComponent = () => {
  const [position, setPosition] = useState([33.892166, 9.561555499999997]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);

      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=fuel](around:5000,${latitude},${longitude});out;`;

      axios.get(overpassUrl).then((response) => {
        setStations(response.data.elements);
      });
    });
  }, []);

  return (
    <>
    <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }} className='relative z-0'>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
      {stations.map((station) => (
        <Marker key={station.id} position={[station.lat, station.lon]}>
           <Popup>
            {station.tags && station.tags.name ? station.tags.name : 'Car Wash Station'}<br />
            
          </Popup>
          
        </Marker>


       
      ))}
    </MapContainer>
    <div className='overflow-y-scroll bg-white shadow-xl rounded-xl h-screen absolute w-1/3 z-50 top-0'>
            <h1 className='font-semibold text-2xl '>Results</h1>

            {stations.map((station) => (
        <div key={station.id} position={[station.lat, station.lon]} className=' h-48 border w-full  py-4 px-5'>
           <div>
            <span>Name:</span>{station.tags && station.tags.name ? station.tags.name : 'Car Wash Station'}<br />
            <span>Name:</span> {station.tags && station.tags['addr:street'] && `${station.tags['addr:street']}, `}
            <span>Name:</span>{station.tags && station.tags['addr:city'] && `${station.tags['addr:city']}, `}
            <span>Name:</span>{station.tags && station.tags['addr:postcode']}<br />
            <span>Name:</span>{station.tags && station.tags.operator && `Operator: ${station.tags.operator}`}<br />
            <span>Name:</span>{station.tags && station.tags.opening_hours && `Opening Hours: ${station.tags.opening_hours}`}<br />
            <span>Name:</span>{station.tags && station.tags['contact:phone'] && `Phone: ${station.tags['contact:phone']}`}<br />
            <span>Name:</span>{station.tags && station.tags['contact:website'] && <a href={station.tags['contact:website']} target="_blank" rel="noopener noreferrer">Website</a>}
            <button className='w-12'>website <span><img src={website} alt="" /></span></button>
          </div>
          
        </div>


       
      ))}
        </div>
    </>
  );
};

export default MapComponent;
