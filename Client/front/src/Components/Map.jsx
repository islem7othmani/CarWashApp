import React from 'react'
import map1 from "../Images/map1.png";
export default function Map() {
  return (
    <div className="relative top-48" style={{ backgroundColor: "#38598B" }}>  
    <div>
      <h1 className="font-bold text-3xl text-blue-100 flex justify-center italic pb-6 pt-10">
        How Our Application Works
      </h1>
    </div>

    <div className="flex justify-center">
      <img src={map1} alt="" className="w-3/5 flex justify-center pb-12" />
      
    </div>
  </div>




  )
}
