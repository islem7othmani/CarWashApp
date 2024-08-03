import React from 'react';

export default function Contact() {
  return (
    <div className="flex flex-col md:flex-row justify-around items-center gap-8 md:gap-36 px-6 md:px-36 py-12 relative top-56">
      <h1 className="font-bold text-lg md:text-xl text-center md:text-left text-blue-100 italic" style={{ color: "#38598B" }}>
        Do you have any questions or feedback? Contact us now.
      </h1>
      <button className="bg-purple-400 font-medium text-lg py-2 px-5 text-white rounded-xl shadow-xl" style={{ backgroundColor: "#A2A8D3" }}>
        Contact Us
      </button>
    </div>
  );
}
