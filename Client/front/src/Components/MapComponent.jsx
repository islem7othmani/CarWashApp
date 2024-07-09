import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import website from '../Images/website.png'
import Cookies from "js-cookie";


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


  console.log("your current postion",position);
  const pos = Cookies.set("position",position)

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
    <div className='overflow-y-scroll bg-white shadow-xl rounded-xl  h-screen absolute w-1/3 z-50 top-0'>
            <h1 className='font-semibold text-2xl relative top-2 left-4 pb-4'>Results</h1>

            {stations.map((station) => (
        <div key={station.id} position={[station.lat, station.lon]} className=' h-80 border w-full  py-4 px-5'>
           <div className='relative top-2 left-4 '>
            <span className='font-bold text-xl'>{station.tags && station.tags.name ? station.tags.name : 'Car Wash Station'}</span><br />
            <span>Street:</span> {station.tags && station.tags['addr:street'] && `${station.tags['addr:street']}, `} <br />
            <span>City:</span>{station.tags && station.tags['addr:city'] && `${station.tags['addr:city']}, `} <br />
            <span>Postcode:</span>{station.tags && station.tags['addr:postcode']}<br />
            <span>Operator:</span>{station.tags && station.tags.operator && `Operator: ${station.tags.operator}`}<br />
            <span className='text-green-500'>{station.tags && station.tags.opening_hours && `Opening Hours: ${station.tags.opening_hours}`}<br /></span>
            
            
            
            
            <span className='bg-blue-200 rounded-full'>Phone:</span>{station.tags && station.tags['contact:phone'] && `Phone: ${station.tags['contact:phone']}`}<br />
            <span>Website:</span>{station.tags && station.tags['contact:website'] && <a href={station.tags['contact:website']} target="_blank" rel="noopener noreferrer">Website</a>}
           
            
            </div>
          

          <button className='relative top-4 bg-blue-400 text-white rounded-xl px-16 hover:bg-blue-600 shadow-xl py-2'>Visit Station</button>



          
        </div>

















       
      ))}
        </div>
    </>
  );
};

export default MapComponent;
