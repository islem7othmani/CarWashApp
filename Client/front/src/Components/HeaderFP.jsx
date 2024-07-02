import React from 'react'

export default function HeaderFP() {
  return (
    <div
    className="h-20 z-50 shadow-xl flex justify-center "
    style={{ backgroundColor: "#38598B" }}
  >
    <div className="flex justify-between w-5/6 relative top-6  ">
      <h1 className="font-bold text-2xl text-blue-300 italic">LAVAGE</h1>
      <nav className="flex gap-8 font-medium text-sm  text-white list-none h-10  cursor-pointer	">
        <li>Home</li>
        <li>Application</li>
        <li>Statistics</li>
        <li>Team</li>
        <li>Testimonial</li>
        <li>Contact</li>
        <li className=' py-2 px-4 relative -top-2 rounded-xl 'style={{ backgroundColor: "#A2A8D3" }}>Sign Up</li>
        <li>Log In</li>
      </nav>
    </div>
  </div>
  )
}
