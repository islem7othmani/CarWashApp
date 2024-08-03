import {React, useState} from "react";
import HeroP from "../Images/HeroP.png";
import { FaTwitter, FaFacebookSquare, FaDribbble, FaGithub, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';

import step1 from "../Images/step1.png";
import step2 from "../Images/step2.png";
import step3 from "../Images/step3.png";


import HeaderFP from "../Components/HeaderFP";
import Hero from "../Components/Hero";
import Application from "../Components/Application";
import Map from "../Components/Map";
import Team from "../Components/Team";
import Testimonial from "../Components/Testimonial";
import Contact from "../Components/Contact";
import FooterFP from "../Components/FooterFP";

export default function FirstPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  function getCurrentYear() {
    return new Date().getFullYear();
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div
      className="h-20 z-50 shadow-xl flex justify-center"
      style={{ backgroundColor: "#38598B" }}
    >
      <div className="flex justify-between w-5/6 relative top-6">
        <h1 className="font-bold text-lg sm:text-lg md:text-lg lg:text-2xl xl:text-2xl text-blue-300 italic">LAVAGE</h1>
        <nav className="hidden md:flex gap-8 font-medium text-sm text-white list-none h-10 cursor-pointer">
        <li onClick={() => scrollToSection("home")}>Home</li>
            <li onClick={() => scrollToSection("application")}>Application</li>
            <li onClick={() => scrollToSection("testimonial")}>Testimonial</li>
            <li onClick={() => scrollToSection("contact")}>Contact</li>
            <a href="http://localhost:3000/signup" className="py-2 px-4 relative bottom-2 rounded-xl" style={{ backgroundColor: "#A2A8D3" }}>
  <span>Sign Up</span>
</a>
<li>
  <a href="http://localhost:3000/login" className="py-2 px-4 rounded-xl">
    Log in
  </a>
</li>

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
          <nav className="flex flex-col gap-4 font-medium text-sm text-white list-none cursor-pointer bg-white text-black h-screen w-2/3 absolute right-0 top-20 z-50 rounded-lg shadow-xl " >
          <li onClick={() => scrollToSection("home")}>Home</li>
            <li onClick={() => scrollToSection("application")}>Application</li>
            <li onClick={() => scrollToSection("testimonial")}>Testimonial</li>

            <li onClick={() => scrollToSection("contact")}>Contact</li>
            <a href="http://localhost:3000/signup" className="py-2 px-4 w-36 flex justify-center rounded-xl" style={{ backgroundColor: "#A2A8D3" }}>
  <span>Sign Up</span>
</a>
<li>
  <a href="http://localhost:3000/login" className="py-2 px-4 rounded-xl" >
    Log in
  </a>
</li>

          </nav>
        </div>
      )}
    </div>


    <div
      className="relative z-0 flex flex-col md:flex-row justify-around md:-space-x-80 h-4/5 md:h-96 "
      style={{ backgroundColor: "#38598B" }}
    >
      <div className="relative top-8 sm:top-8 md:top-12 lg:top-20 xl:top-20 md:top-0 p-4 md:p-0" id="home">
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
   


    <div className="flex justify-center p-4" id="application">
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
    

    <section class="bg-gray-50 relative top-56" style={{ backgroundColor: "#38598B" }} id="testimonial">
  <div class="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <div class="md:flex md:items-end md:justify-between">
      <div class="max-w-xl text-blue-100">
        <h2 class="text-3xl italic font-bold  sm:text-5xl">
          Read trusted reviews from our customers
        </h2>

      
      </div>

     
    </div>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" >
      <blockquote class="flex h-full flex-col justify-between  p-6 shadow-sm sm:p-8 rounded-xl"  style={{ backgroundColor: "#A2A8D3" }} >
        <div>
          <div class="flex gap-0.5 text-yellow-300">
            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>

          <div class="mt-4">

            <p class="mt-4 leading-relaxed text-white font-medium">
            I've been using this car wash app for a few months now, and it's been a game-changer. The app is super easy to navigate, and I can find a nearby car wash in seconds. Booking a slot is hassle-free, and I love the variety of services offered. The staff is always friendly, and my car comes out looking brand new every time. Highly recommend!
            </p>
          </div>
        </div>

       
      </blockquote>

     <blockquote class="flex h-full flex-col justify-between  p-6 shadow-sm sm:p-8 rounded-xl"  style={{ backgroundColor: "#A2A8D3" }} >
        <div>
          <div class="flex gap-0.5 text-yellow-300">
            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>

          <div class="mt-4">

            <p class="mt-4 leading-relaxed text-white font-medium">
            The car wash app has made keeping my car clean so much easier. I can book a wash while I'm out running errands, and the app sends me reminders, so I never miss an appointment. The wash itself is quick, and the quality is consistent. My only suggestion would be to add more detailed descriptions of the services offered, but overall, it's a fantastic app!
            </p>
          </div>
        </div>

      </blockquote>

     <blockquote class="flex h-full flex-col justify-between  p-6 shadow-sm sm:p-8 rounded-xl"  style={{ backgroundColor: "#A2A8D3" }} >
        <div>
          <div class="flex gap-0.5 text-yellow-300">
            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>

          <div class="mt-4">

            <p class="mt-4 leading-relaxed text-white font-medium">
            As someone with a busy schedule, this app is a lifesaver. I can easily find the nearest car wash and book a time that fits my day. The app's interface is clean and user-friendly, making the whole process smooth. The car wash stations I've visited have all been top-notch, and my car always looks great afterward. The rewards program is a nice bonus too!
            </p>
          </div>
        </div>

        
      </blockquote>
    </div>
  </div>
</section>







    <div className="relative pt-8 pb-6 top-56" style={{ backgroundColor: "#0000" }} id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap text-center md:text-left">
          <div className="w-full md:w-6/12 px-4">
            <h4 className="text-3xl font-semibold text-blueGray-700">Let's keep in touch!</h4>
            <h5 className="text-lg mt-0 mb-2 text-blueGray-600">
              Find us on any of these platforms, we respond within 1-2 business days.
            </h5>
            <div className="mt-6 mb-6 flex justify-center md:justify-start">
      
      <a href="https://www.facebook.com/Lab.ITTech" className="bg-white flex justify-center text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
        <FaFacebookSquare />
      </a>
     
      
      <a href="https://www.instagram.com/lab.ittech/"  className="bg-white flex justify-center text-pink-500 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
        <FaInstagram />
      </a>
      <a href="https://www.linkedin.com/company/lab-it/people/?facetCurrentFunction=8"  className="bg-white flex justify-center text-blue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
        <FaLinkedin />
      </a>
      <a href="https://lab-it.tn/"  className="bg-white flex justify-center text-green-500 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
        <FaGlobe />
      </a>
    </div>
          </div>
        
        </div>
        <hr className="my-6 border-blueGray-300"/>
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-blueGray-500 font-semibold py-1">
            Copyright © {getCurrentYear()}
              <a href="" className="text-blueGray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer"> Lab-It </a>
            </div>
          </div>
        </div>
      </div>
    </div>




    </>
  );
}
