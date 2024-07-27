import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import Cookies from "js-cookie";
import Navbar from './Navbar'
import { useParams } from 'react-router-dom';  // Import useParams from react-router-dom
import { useLocation } from 'react-router-dom';

// Custom red icon for "You're here" marker
const redIcon = new L.DivIcon({
  className: 'red-marker',
  html: '<div style="background-color: red; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.5);"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom blue icon for stations
const blueIcon = new L.DivIcon({
  className: 'blue-marker',
  html: '<div style="background-color: blue; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.5);"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = () => {
  const [position, setPosition] = useState([33.892166, 9.561555499999997]);
  const [stations, setStations] = useState([]);
  const { userId } = useParams();
  console.log("rrrre", userId)
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const userId2 = queryParams.get('userId');
  console.log('User ID2:', userId2);

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

  console.log("your current position", position);
  Cookies.set("position", position);

  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        className="relative z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={redIcon}>
          <Popup>You are here</Popup>
        </Marker>
        {stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lon]} icon={blueIcon}>
            <Popup>
              {station.tags && station.tags.name
                ? station.tags.name
                : "Car Wash Station"}
              <br />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="overflow-y-scroll bg-white shadow-xl rounded-xl h-screen absolute w-1/3 z-10 top-0">
        <h1 className="font-semibold text-2xl relative top-2 left-4 pb-4">
          Results
        </h1>
        {stations.map((station) => (
          <div
            key={station.id}
            position={[station.lat, station.lon]}
            className="h-80 border w-full py-4 px-5"
          >
            <div className="relative top-2 left-4">
              <span className="font-bold text-xl">
                {station.tags && station.tags.name
                  ? station.tags.name
                  : "Car Wash Station"}
              </span>
              <br />
              <span>Street:</span>{" "}
              {station.tags &&
                station.tags["addr:street"] &&
                `${station.tags["addr:street"]}, `}{" "}
              <br />
              <span>City:</span>
              {station.tags &&
                station.tags["addr:city"] &&
                `${station.tags["addr:city"]}, `}{" "}
              <br />
              <span>Postcode:</span>
              {station.tags && station.tags["addr:postcode"]}
              <br />
              <span>Operator:</span>
              {station.tags &&
                station.tags.operator &&
                `Operator: ${station.tags.operator}`}
              <br />
              <span className="text-green-500">
                {station.tags &&
                  station.tags.opening_hours &&
                  `Opening Hours: ${station.tags.opening_hours}`}
                <br />
              </span>
              <span className="">Phone:</span>
              {station.tags &&
                station.tags["contact:phone"] &&
                `Phone: ${station.tags["contact:phone"]}`}
              <br />
              <span>Website:</span>
              {station.tags && station.tags["contact:website"] && (
                <a
                  href={station.tags["contact:website"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <a href={`/reservation/${userId}`} className='absolute bottom-0 z-50 w-1/3 bg-blue-900 rounded-lg shadow-xl py-3 px-3 text-white font-semibold text-xl flex justify-center pointer-cursor'>
        Get Reservation
      </a>
    </>
  );
};

export default MapComponent;
