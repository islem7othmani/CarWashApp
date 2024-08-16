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
 

const [emailData,setEmailData]= useState("")

  const fetchStationByEmail = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/station/getstationsByEmail/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const station = await response.json();
      setEmailData(station);
  //   console.log(emailData);
    } catch (error) {
      console.log("Error fetching user data: " + error.message);
    }
  };



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

  
  fetchStationByEmail(loginData.email);
  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { email, password } = loginData;

    if (email === "admin@admin" && password === "admin123456789") {
      // Navigate directly to the admin route
      navigate("/AdminDashboard");
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
      

      Cookies.set("userIdd",result.user._id,  { expires: 7 })


      const userIdd = Cookies.get("userIdd")
      // Save email and password to cookies (with optional expiration)
      Cookies.set("email", loginData.email, { expires: 7 });  // Set cookie to expire in 7 days
     // Cookies.set("password", loginData.password, { expires: 7 });  // Set cookie to expire in 7 days
      Cookies.set("token",result.token,  { expires: 7 })
      Cookies.set("isadmin",result.user.isAdmin,  { expires: 7 })
      
      if (result.user.isAdmin && ( !emailData || emailData.length === 0)) {
        navigate("/StationData");
    } else if (result.user.isAdmin  && ( emailData || emailData.length !== 0)) {


        navigate(`/Admin/${userIdd}`);
    }else {
      navigate(`/home/${result.user._id}`);
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
    <div className="flex flex-col md:flex-row h-screen">
      <div className="bg-gradient-to-r from-blue-950 to-blue-500 h-1/2 md:h-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="font-bold text-3xl md:text-5xl text-white">
          Join <span style={{ color: "#A2A8D3" }}>Us</span>
        </h1>
        <p className="font-medium text-lg md:text-xl text-gray-300 mt-4">
          To Reserve Your Car Wash
        </p>
        <img src={signupimg} alt="Sign Up" className="h-48 md:h-64 mt-8 md:mt-12" />
      </div>
      <div className="flex flex-col items-center justify-center p-8 md:w-1/2">
        <h1 className="font-bold text-xl md:text-2xl mb-4">Log In</h1>
        <form className="space-y-4 w-full max-w-md" onSubmit={handleFormSubmit}>
          <input
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            name="email"
            value={loginData.email}
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <input
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
            name="password"
            value={loginData.password}
            className="bg-white shadow-xl rounded-xl h-12 w-full pl-4"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full shadow-xl font-bold text-white mt-4"
            style={{ backgroundColor: "#A2A8D3" }}
          >
            Log In
          </button>
          <p className="font-medium text-sm text-gray-700 mt-4">
            <button
              className="text-blue-500 underline"
              onClick={handleForgotPassword}
            >
              Forget Password?
            </button>
          </p>
          <p className="font-medium text-sm text-gray-700 mt-4">
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