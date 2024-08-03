import React from 'react';
import step1 from "../Images/step1.png";
import step2 from "../Images/step2.png";
import step3 from "../Images/step3.png";

export default function Application() {
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="font-bold text-3xl text-blue-900 pt-20 flex justify-center italic text-center text-sm sm:text-sm md:text-lg lg:text-xl xl:text-4xl">
          How Our Application Works
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-around items-center relative top-12">
          <div className="flex flex-col items-center mb-8 md:mb-0">
            <div className="h-72 w-72 flex justify-center rounded-xl" style={{ backgroundColor: "#38598B" }}>
              <div>
                <span className="rounded-full px-6 py-4 relative -top-3 font-bold left-16" style={{ backgroundColor: "#A2A8D3" }}>
                  1
                </span>
                <img src={step1} alt="Step 1" className="rounded-full w-48 h-48 mt-2" />
                <span className="font-semibold text-lg flex justify-center mt-2 text-white">
                  Sign Up To Our App
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mb-8 md:mb-0">
            <div className="h-72 w-72 flex justify-center rounded-xl" style={{ backgroundColor: "#38598B" }}>
              <div>
                <span className="rounded-full px-6 py-4 relative -top-3 font-bold left-16" style={{ backgroundColor: "#A2A8D3" }}>
                  2
                </span>
                <img src={step2} alt="Step 2" className="rounded-full w-48 h-48 mt-2" />
                <span className="font-semibold text-lg flex justify-center mt-2 text-white">
                  Find Nearest Station
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-72 w-72 flex justify-center rounded-xl" style={{ backgroundColor: "#38598B" }}>
              <div>
                <span className="rounded-full px-6 py-4 relative -top-3 font-bold left-16" style={{ backgroundColor: "#A2A8D3" }}>
                  3
                </span>
                <img src={step3} alt="Step 3" className="rounded-full w-48 h-48 mt-2" />
                <span className="font-semibold text-lg flex justify-center mt-2 text-white">
                  Reserve
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
