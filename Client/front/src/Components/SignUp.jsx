import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupimg from '../Images/signupimg.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminChange = () => {
    const newIsAdmin = !isAdmin; // Toggle the isAdmin state
    setIsAdmin(newIsAdmin);
    setPostData({
      ...postData,
      isAdmin: newIsAdmin, // Update postData with the new isAdmin value
    });
  };

  const allgood = () => {
    // Check if all required fields are filled
    if (postData.phone !== "" && postData.username !== "" && postData.password !== "" && postData.email !== "") {
      navigate("/login"); // Navigate to the login page if valid
    } else {
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
      <div className="flex">
        <div className="bg-gradient-to-r from-blue-950 to-blue-500 h-screen w-1/2">
          <h1 className="font-bold text-5xl text-white relative top-24 left-36">
            Join <span style={{ color: "#A2A8D3" }}>Us</span>
          </h1>
          <p className="font-medium text-xl text-gray-300 relative top-24 pt-4 left-36">
            To Reserve Your Car Wash
          </p>
          <img src={signupimg} alt="Sign Up" className="h-64 fixed top-96 left-80" />
        </div>
        <div className="relative left-48 pt-20">
          <div>
            <h1 className="font-bold pb-2 flex justify-center text-xl">CREATE ACCOUNT</h1>
            <button className="bg-white flex justify-center ml-12 gap-2 shadow-xl rounded-xl py-3 px-12">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                className="h-6 w-6 rounded-full"
                alt="Google Logo"
              />
              <span>Sign Up With Google</span>
            </button>
          </div>
          <form className="relative top-6 space-y-2" onSubmit={handleFormSubmit}>
            <input
              onChange={handleInputChange}
              type="text"
              placeholder="User Name"
              name="username"
              value={postData.username} // Set value from state
              className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
            />
            <input
              onChange={handleInputChange}
              type="email"
              placeholder="Email"
              name="email"
              value={postData.email} // Set value from state
              className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
            />
            <input
              onChange={handleInputChange}
              type="password"
              placeholder="Password"
              name="password"
              value={postData.password} // Set value from state
              className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
            />
            <input
              onChange={handleInputChange}
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={postData.phone} // Set value from state
              className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
            />

            <div>
              <label htmlFor="isAdmin">Admin</label>
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={handleAdminChange}
              />
            </div>

            <button
              type="submit"
              className="relative top-4 py-2 px-36 left-5 rounded-full shadow-xl font-bold text-white"
              style={{ backgroundColor: "#A2A8D3" }}
            >
              Sign Up
            </button>
            <p className="font-medium relative top-5 text-sm text-gray-700">
              Already Have An Account? <a href='/login' className="font-bold underline" style={{ color: "#A2A8D3" }}>Log In</a>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer toastClassName="toastify-container" />
    </>
  );
}
