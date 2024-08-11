import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import CarCard from "./CarCard";
import Admin from "./Admin";
import Profile from "../Images/profile.mp4";
import mail from "../Images/mail.png";
import phone from "../Images/telephone.png";
import paymentpopup from "../Images/paymentpopup.png";


export default function MainProfil() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [carsdata, setCarsdata] = useState([]);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  useEffect(() => {
    // Get email from cookies
    const cookieEmail = Cookies.get("email");
    if (cookieEmail) {
      setEmail(cookieEmail);
      // Fetch user data
      fetchUserData(cookieEmail);
    } else {
      setError("No email found in cookies.");
    }
  }, []);


  const [status,setStatus]=useState();
  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/authentification/User/${email}`,
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

      const userData = await response.json();
      setUser(userData);
      setStatus(userData.isBlocked)
      // console.log("user data", userData);
      //  console.log(user);

      Cookies.set("user", userData._id, { expires: 7 });
    } catch (error) {
      setError("Error fetching user data: " + error.message);
    }
  };

  const [popup, setPopup] = useState(false);
  const showform = () => {
    setPopup(true);
  };
  const closeForm = () => {
    console.log("Close button clicked");
    setPopup(false);
    setImagePreview(null); // Reset image preview on close
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCarData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0])); // Set image preview
    } else {
      setCarData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const [carData, setCarData] = useState({
    carname: "",
    model: "",
    version: "",
    marque: "",
    image: "",
    user: "",
  });
  useEffect(() => {
    if (user) {
      setCarData((prevCarData) => ({
        ...prevCarData,
        user: user._id,
      }));
    }
  }, [user]);
  console.log(carData);

  const addCar = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      for (const key in carData) {
        formData.append(key, carData[key]);
      }

      const response = await fetch("http://localhost:8000/car/addCar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      window.location.reload();
    } catch (error) {
      setError("Error adding car: " + error.message);
    }
  };

  // car data
  const fetchCarData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/car/getcarByUser/${userId}`,
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

      const cars = await response.json();
      setCarsdata(cars);
      console.log(cars);
    } catch (error) {
      setError("Error fetching user data: " + error.message);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchCarData(user._id);
    }
  }, [user]);






  

  return (
  

status ? (

  <div className="w-full relative top-36">
      <div className="flex justify-center border rounded-xl mx-80 shadow-xl">
        <img src={paymentpopup} alt="" className='h-64' />
        <div className="space-y-2 ml-4 relative top-16"> 
          <h1 className="text-2xl font-bold text-red-600">Payment Required</h1>
          <p className="text-lg text-gray-700 pb-4">Please complete your payment to proceed.</p>
          <a href="" className="bg-blue-500 text-white py-2 w-48 mt-4 rounded-lg font-semibold shadow-xl px-4">Go to payment page</a>
        </div>
      </div>
    </div>
):(
<>

      <div className="relative top-6">
        <img
          src="https://i.pinimg.com/564x/6b/9d/75/6b9d75569b9b2f49967153b03afdac47.jpg"
          alt="Background"
          className="w-screen h-60"
        />
      </div>

      <div className=" flex flex-wrap justify-center">
        <div className="h-96 w-64 rounded-xl shadow-xl relative z-10 -top-10 bg-white z-50  ">
          {user ? (
            <div className="bg-white pt-4 rounded-xl ">
              <div className="relative left-12 bottom-8 ml-2">
                <video
                  className="w-36 h-36 rounded-full absolute"
                  src={Profile}
                  autoPlay
                  muted
                  loop
                  playsInline
                  alt="Profile Video"
                />

                <div className="w-20 h-20 group hover:bg-gray-200 opacity-60 rounded-full absolute  flex justify-center items-center cursor-pointer transition duration-500">
                  <img
                    className="hidden group-hover:block w-6"
                    src="https://www.svgrepo.com/show/33565/upload.svg"
                    alt="Upload"
                  />
                </div>
              </div>

              <div className="relative top-20 pt-4">
                <h1 className="flex justify-center pt-2 font-bold text-xl pb-6">
                  {user.username}
                </h1>
              </div>

              <div className="font-medium text-lg relative top-20 ">
                <div className="flex gap-2 relative left-6">
                  <img src={mail} alt="mail" className="h-4" />
                  <p className="flex text-sm justify-center">{user.email}</p>
                </div>
                <div className="flex gap-2 relative left-6">
                  <img src={phone} alt="phone" className="h-4" />
                  <p className="flex text-sm justify-center">{user.phone}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 space-x-4 space-y-4 ">
          <button
            onClick={showform}
            className="rounded-xl hover:bg-gray-100 border border-dashed text-blue-500 font-semibold border-blue-500 relative w-72 left-4 top-12 h-96"
          >
            Add Car
          </button>

          {carsdata.map((car, index) => (
            <CarCard key={index} car={car} carData={carData} />
          ))}
        </div>
      </div>

      {popup && (
        <div
          id="default-modal"
          className="bg-black bg-opacity-75 h-screen w-full fixed top-0 left-0 z-50 flex justify-center items-center"
        >
          <button
            type="button"
            onClick={closeForm}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow">
            <form
              className="py-20 relative left-28 space-y-2"
              onSubmit={addCar}
              encType="multipart/form-data"
            >
              <h1 className="font-semibold text-xl text-blue-500 relative bottom-5">
                Enter Informations About The Car
              </h1>
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Mark"
                name="carname"
                className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
              />
              <input
                onChange={handleInputChange}
                type="file"
                placeholder="Image"
                name="image"
                className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2 pt-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-20 h-20 mt-4"
                />
              )}
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Model"
                name="model"
                className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
              />
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Version"
                name="version"
                className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
              />

              <button
                type="submit"
                className="relative top-4 py-2 px-36 left-2 rounded-full shadow-xl font-bold text-white"
                style={{ backgroundColor: "#A2A8D3" }}
              >
                Add Car
              </button>
            </form>
          </div>
        </div>
      )}
</>
)
    
  );
}
