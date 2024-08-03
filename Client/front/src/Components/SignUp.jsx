import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupimg from '../Images/signupimg.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function SignUp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [postData, setPostData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    profilepic: "",
    isActive: false,
    activationCode: "",
    resetToken: "",
    isAdmin: false, 
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostData({
      ...postData,
      [name]: type === 'checkbox' || type === 'radio' ? value === 'true' : value,
    });
  };


  Cookies.set("admin", postData.isAdmin, { expires: 7 }); 
  const isAdmin1 = Cookies.get("admin");

  const allgood = () => {
    // Check if all required fields are filled
    if (postData.phone !== "" && postData.username !== "" && postData.password !== "" && postData.email !== "" ) {
      navigate("/login"); 
    }
    else {
      console.log("Please fill out all required fields.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/authentification/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Registration successful:", result);

      // Call allgood to check fields and navigate to login if valid
      allgood();
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };
  const validateForm = () => {
    const {  username,email,
      phone,
      password,
  
   } = postData;
    let isValid = true;

    if (email === "") {
      toast.error("Enter your email");
      isValid = false;
    }

    if (password === "") {
      toast.error("Enter your password");
      isValid = false;
    }
    if (username === "") {
      toast.error("Enter your username");
      isValid = false;
    }
    if (phone === "") {
      toast.error("Enter your phone number");
      isValid = false;
    }
    const confirmPassword = document.querySelector('input[type="password"][placeholder="Confirm Password"]').value;
    if (postData.password !== confirmPassword) {
      toast.error("Passwords do not match."); 
      return;
    }


    return isValid;
  };

  return (
    <>
    <div className="flex flex-col md:flex-row h-screen">
      <div className="bg-gradient-to-r from-blue-950 to-blue-500 h-1/2 md:h-full md:w-1/2 flex flex-col items-center justify-center">
        <h1 className="font-bold text-3xl md:text-5xl text-white">
          Join <span style={{ color: "#A2A8D3" }}>Us</span>
        </h1>
        <p className="font-medium text-lg md:text-xl text-gray-300 mt-4">
          To Reserve Your Car Wash
        </p>
        <img src={signupimg} alt="Sign Up" className="h-48 md:h-64 mt-8 md:mt-12" />
      </div>
      <div className="flex flex-col items-center justify-center p-8 md:w-1/2">
        <h1 className="font-bold text-xl md:text-2xl mb-4">CREATE ACCOUNT</h1>
        <form className="space-y-4 w-full max-w-md" onSubmit={handleFormSubmit}>
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="User Name"
            name="username"
            value={postData.username}
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <input
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            name="email"
            value={postData.email}
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <input
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
            name="password"
            value={postData.password}
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <input
            onChange={handleInputChange}
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={postData.phone}
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <div className="flex items-center mt-4">
            <label htmlFor="isAdmin" className="mr-2">is admin?</label>
            <input
              type="radio"
              name="isAdmin"
              value="true"
              checked={postData.isAdmin === true}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-full shadow-xl font-bold text-white mt-4"
            style={{ backgroundColor: "#A2A8D3" }}
          >
            Sign Up
          </button>
          <p className="font-medium text-sm text-gray-700 mt-4">
            Already Have An Account? <a href="/login" className="font-bold underline" style={{ color: "#A2A8D3" }}>Log In</a>
          </p>
        </form>
      </div>
    </div>
    <ToastContainer toastClassName="toastify-container" />
  </>
  );
}