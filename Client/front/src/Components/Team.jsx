import React from 'react'
import team1 from "../Images/team1.png";
export default function Team() {
  return (
    <div className="relative top-56 pb-16">
        <h1 className="font-bold text-3xl text-blue-900 flex justify-center italic pb-6 pt-10">Meet Our Team</h1>
        <div className="flex justify-center gap-10">
            <div className="">
            <img src={team1} alt="" className="h-72 w-64 rounded-xl " />
            <span className="font-bold text-xl flex justify-center text-blue-900">John Doe</span>
          <p className="text-lg font-medium flex justify-center pt-1 " style={{ color: "#38598B" }}>Car Wash Agent</p>
          </div>


           <div className="">
            <img src={team1} alt="" className="h-72 w-64 rounded-xl " />
            <span className="font-bold text-xl flex justify-center text-blue-900">John Doe</span>
          <p className="text-lg font-medium flex justify-center pt-1 " style={{ color: "#38598B" }}>Car Wash Agent</p>
          </div>


           <div className="">
            <img src={team1} alt="" className="h-72 w-64 rounded-xl " />
            <span className="font-bold text-xl flex justify-center text-blue-900">John Doe</span>
          <p className="text-lg font-medium flex justify-center pt-1 " style={{ color: "#38598B" }}>Car Wash Agent</p>
          </div>



        </div>
     </div>


  )
}
