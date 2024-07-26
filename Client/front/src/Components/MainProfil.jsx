import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import CarCard from "./CarCard";
import Admin from "./Admin";

export default function MainProfil() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [carsdata, setCarsdata] = useState([]);
  const [error, setError] = useState("");

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
  };

  const handleInputChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };
  const [carData, setCarData] = useState({
    carname: "",
    model: "",
    version: "",
    marque: "",
    image:"",
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
      const response = await fetch("http://localhost:8000/car/addCar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      // Handle successful car addition if needed
    } catch (error) {
      setError("Error adding car: " + error.message);
    }
  };

  // car data
    const fetchCarData = async (userId) => {
      try {
          const response = await fetch(`http://localhost:8000/car/getcarByUser/${userId}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: "include",
          });

          if (!response.ok) {
              throw new Error("Network response was not ok.");
          }

          const cars = await response.json();
          setCarsdata(cars);
          console.log(cars)
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
    <>

<div className="relative top-6">
  <img
    src="https://i.pinimg.com/564x/6b/9d/75/6b9d75569b9b2f49967153b03afdac47.jpg"
    alt="Background"
    className="w-screen h-60"
  />
</div>

<div className="flex justify-center">
  <div className="h-96 w-64 rounded-xl shadow-xl relative -top-10 bg-white z-50 -left-12">
    {user ? (
      <div className="bg-white pt-4 rounded-xl">
        <div className="relative left-20 ml-2">
          <img
            className="w-20 h-20 rounded-full absolute"
            src={
              user.profilepic ||
              "https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1-640x640.jpg"
            }
            alt="Profile"
          />
          <div className="w-20 h-20 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
            <img
              className="hidden group-hover:block w-6"
              src="https://www.svgrepo.com/show/33565/upload.svg"
              alt="Upload"
            />
          </div>
        </div>

        <div className="relative top-20">
          <h1 className="flex justify-center pt-2 font-bold text-xl pb-6">
            {user.username}
          </h1>
        </div>

        <div className="font-medium text-lg relative top-20">
          <p className="flex justify-center">{user.email}</p>
          <p className="flex justify-center">{user.phone}</p>
        </div>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>

  <div className="grid grid-cols-3 space-x-4 space-y-4 ">
    <button
      onClick={showform}
      className="rounded-xl hover:bg-gray-100 border border-dashed text-blue-500 font-semibold border-blue-500 relative top-12 h-96"
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
    <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow">
      <button
        onClick={closeForm}
        className="absolute right-6 top-2 z-50"
      >
        X
      </button>
      <form
        className="py-20 relative left-28 space-y-2"
        onSubmit={addCar}
      >
        <input
          onChange={handleInputChange}
          type="text"
          placeholder="Car Name"
          name="carname"
          className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
        />
        <input
          onChange={handleInputChange}
          type="text"
          placeholder="Mark"
          name="marque"
          className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
        />
        <input
          onChange={handleInputChange}
          type="text"
          placeholder="Image"
          name="image"
          className="bg-white flex justify-center gap-2 shadow-xl rounded-xl h-12 w-96 pl-2"
        />
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
          className="relative top-4 py-2 px-36 left-5 rounded-full shadow-xl font-bold text-white"
          style={{ backgroundColor: "#A2A8D3" }}
        >
          Add Car
        </button>
      </form>
    </div>
  </div>
)}

    </>
  );
}