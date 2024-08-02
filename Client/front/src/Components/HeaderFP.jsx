import React, { useState } from 'react';

export default function HeaderFP() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className="h-20 z-50 shadow-xl flex justify-center"
      style={{ backgroundColor: "#38598B" }}
    >
      <div className="flex justify-between w-5/6 relative top-6">
        <h1 className="font-bold text-2xl text-blue-300 italic">LAVAGE</h1>
        <nav className="hidden md:flex gap-8 font-medium text-sm text-white list-none h-10 cursor-pointer">
          <li>Home</li>
          <li>Application</li>
          <li>Statistics</li>
          <li>Team</li>
          <li>Testimonial</li>
          <li>Contact</li>
          <li className="py-2 px-4 relative -top-2 rounded-xl" style={{ backgroundColor: "#A2A8D3" }}>Sign Up</li>
          <li>Log In</li>
        </nav>
        <div className="md:hidden flex items-center">
          <button className="text-white" onClick={toggleMobileMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col gap-4 font-medium text-sm text-white list-none cursor-pointer">
            <li>Home</li>
            <li>Application</li>
            <li>Statistics</li>
            <li>Team</li>
            <li>Testimonial</li>
            <li>Contact</li>
            <li className="py-2 px-4 rounded-xl" style={{ backgroundColor: "#A2A8D3" }}>Sign Up</li>
            <li>Log In</li>
          </nav>
        </div>
      )}
    </div>
  );
}
