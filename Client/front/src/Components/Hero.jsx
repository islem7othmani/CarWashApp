import React from 'react'
import HeroP from "../Images/HeroP.png";
export default function Hero() {
  return (
    <div
    className="h-96 relative z-0  flex justify-around -space-x-80"
    style={{ backgroundColor: "#38598B" }}
  >
    <div className="relative top-24">
      <h1 className="font-bold text-5xl text-blue-50 drop-shadow-xl italic">
        QuickWash Locator
      </h1>
      <p className="font-semibold text-xl text-white pt-4 italic">
        {" "}
        Discover the ultimate convenience with QuickWash Locator!<br></br> Whether you're at home or on the go, find the nearest car wash<br></br> in seconds. 
      </p>
      <button
        className="bg-purple-400 font-medium text-lg py-2 px-6 mt-4 rounded-xl shadow-xl  text-white"
        style={{ backgroundColor: "#A2A8D3" }}
      >
        Get Started
      </button>
    </div>

    <div>
      <img src={HeroP} className="h-80 relative top-4 drop-shadow-2xl" alt="" />
    </div>
  </div>
  )
}
