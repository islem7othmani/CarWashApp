import React, { useState,useEffect } from "react";
import signupimg from "../Images/signupimg.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";



export default function Login() {

  const [loginData, setLoginData] = useState({
    email: Cookies.get("email") || "",  // Get email from cookie if it exists
   // password: Cookies.get("password") || "",   // Get password from cookie if it exists
  });

  const navigate = useNavigate();
 

  // Handle input changes
  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Form validation
  const validateForm = () => {
    const { email, password } = loginData;
    let isValid = true;

    if (email === "") {
      toast.error("Enter your email");
      isValid = false;
    }

    if (password === "") {
      toast.error("Enter your password");
      isValid = false;
    }

    return isValid;
  };

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/authentification/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData);
      }

      const result = await response.json();
      

      // Save email and password to cookies (with optional expiration)
      Cookies.set("email", loginData.email, { expires: 7 });  // Set cookie to expire in 7 days
     // Cookies.set("password", loginData.password, { expires: 7 });  // Set cookie to expire in 7 days
      Cookies.set("token",result.token,  { expires: 7 })
      Cookies.set("isadmin",result.user.isAdmin,  { expires: 7 })
      
      if (result.user.isAdmin) {
        navigate("/StationData");
    } else {
        navigate("/home");
    }
    } catch (error) {
      console.error("Error during login:", error.message);

      if (error.message === "Account is not activated, verify your email") {
        toast.info(
          "Your account is not activated. Please check your email for verification."
        );
      } else if (
        error.message === "Address not found" ||
        error.message === "Incorrect email or password"
      ) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

   

  
  

  // Navigate to the password reset page
  const handleForgotPassword = () => {
    navigate("/forgetPassword");
  };

  // Navigate to the sign up page
  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="flex">
      <div className="bg-gradient-to-r from-blue-950 to-blue-500 h-screen w-1/2 ">
        <h1 className="font-bold text-5xl text-white relative top-24 left-36">
          Join <span style={{ color: "#A2A8D3" }}>Us</span>
        </h1>
        <p className="font-medium text-xl text-gray-300 relative top-24 pt-4 left-36">
          To Reserve Your Car Wash
        </p>
        <img
          src={signupimg}
          alt="Sign Up"
          className="h-64 fixed top-96 left-80"
        />
      </div>
      <div className="relative left-48 pt-48">
        <div>
          <h1 className="font-bold pb-2 flex justify-center text-xl">Log In</h1>
        </div>
        <form className="relative top-6 space-y-2" onSubmit={handleFormSubmit}>
          <input
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            name="email"
            value={loginData.email}
            className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
          />
          <input
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
            name="password"
            value={loginData.password}
            className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
          />
          <button
            type="submit"
            className="relative top-4 py-2 px-36 left-5 rounded-full shadow-xl font-bold text-white"
            style={{ backgroundColor: "#A2A8D3" }}
          >
            Log In
          </button>
          <p className="font-medium relative top-5 text-sm text-gray-700">
            <button
              className="text-blue-500 underline"
              onClick={handleForgotPassword}
            >
              Forget Password?
            </button>
          </p>
          <p className="font-medium relative top-5 text-sm text-gray-700">
            You don't Have An Account?{" "}
            <a
              href="/signup"
              className="font-bold underline text-blue-500"
              onClick={handleSignUp}
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
      <ToastContainer toastClassName="toastify-container" />
    </div>
  );
}