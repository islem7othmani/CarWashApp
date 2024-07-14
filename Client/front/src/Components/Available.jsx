import React, { useState } from "react";
import Cookies from "js-cookie";
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the server

export default function Available() {
  const [isAvailable, setIsAvailable] = useState(false); 
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
  };

  const sendNotification = () => {
    setIsAvailable(!isAvailable);
    socket.emit('sendNotification', message);
    setMessage('available');
  };

  const stationId = Cookies.get("stationId");
  console.log(stationId);

  return (
    <>
      <div className="fixed left-1/3">
        <div className="space-y-2">
          <span className="font-semibold text-xl">Set Availability:</span>
          <div>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isAvailable} 
                onChange={sendNotification} 
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Available
              </span>
            </label>
          </div>
        </div>
        <h2>Admin Component</h2>
        
      </div>
    </>
  );
}
