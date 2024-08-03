import React from 'react';
import HeroP from "../Images/HeroP.png";

export default function Hero() {
  return (
    <div
      className="relative z-0 flex flex-col md:flex-row justify-around md:-space-x-80 h-4/5 md:h-96 "
      style={{ backgroundColor: "#38598B" }}
    >
      <div className="relative top-8 sm:top-8 md:top-12 lg:top-20 xl:top-20 md:top-0 p-4 md:p-0">
        <h1 className="font-bold  text-blue-50 drop-shadow-xl text-4xl italic text-center md:text-left">
          QuickWash Locator
        </h1>
        <p className="font-semibold text-sm sm:text-sm md:text-lg lg:text-xl xl:text-4xl text-white pt-4 italic text-center md:text-left">
      
          Whether you're at home or on the go,
          <br />
           find the nearest car wash in seconds.
        </p>
        <div className="flex justify-center md:justify-start ">
          <button
            className="bg-purple-400 font-medium text-lg py-2 px-6 mt-4 rounded-xl shadow-xl text-white"
            style={{ backgroundColor: "#A2A8D3" }}
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="flex justify-center md:justify-end p-4 md:p-0">
        <img src={HeroP} className="h-40 md:h-60 relative top-2 sm:top sm:top-4 lg:top-4 xl:top-4 md:top-0 md:left-24 drop-shadow-2xl" alt="Hero" />
      </div>
    </div>
  );
}
