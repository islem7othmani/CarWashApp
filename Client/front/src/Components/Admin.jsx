import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as tf from "@tensorflow/tfjs";
import Estimation from "./Estimation";
import StationInfos from "./StationInfos";
import Informations from "./Informations";
import Available from "./Available";
import ReservList from "./ReservList";
import io from "socket.io-client";
import Spinner from "./Spinner";
import Payment from "./Payment";
import PaymentStation from "./PaymentStation";

const socket = io("http://localhost:5000");

export default function Admin() {
  const [numCars, setNumCars] = useState(0);
  const [washTime, setWashTime] = useState(0);
  const [prediction, setPrediction] = useState("");
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const simpleModel = tf.sequential();
      simpleModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      simpleModel.compile({ optimizer: "sgd", loss: "meanSquaredError" });

      const xs = tf.tensor2d([0, 1, 2, 3, 4, 5, 6, 7, 8], [9, 1]);
      const ys = tf.tensor2d([2, 3, 5, 7, 8, 10, 13, 15, 18], [9, 1]);

      await simpleModel.fit(xs, ys, { epochs: 500 });
      setModel(simpleModel);
    };

    loadModel();
  }, []);

  const handleNumCarsChange = (event) => {
    setNumCars(event.target.value);
  };

  const handleWashTimeChange = (event) => {
    setWashTime(event.target.value);
  };

  const predictWaitTime = async () => {
    if (model) {
      const currentTime = new Date().getHours();
      const input = tf.tensor2d([currentTime], [1, 1]);
      const predictedCarsTensor = model.predict(input);
      const predictedCars = (await predictedCarsTensor.data())[0];

      // Calculate the total wait time in minutes
      const totalTimeMinutes = numCars * washTime;
      const hours = Math.floor(totalTimeMinutes / 60);
      const minutes = totalTimeMinutes % 60;

      setPrediction(
        `Predicted number of cars at ${currentTime}: ${predictedCars.toFixed(
          2
        )}\nEstimated wait time: ${hours} hours and ${minutes} minutes`
      );
    } else {
      setPrediction("Model is not loaded yet.");
    }
  };

  const [estimation, setEstimation] = useState(false);
  const [Station, setStation] = useState(false);
  const [information, setInformation] = useState(true);
  const [Availability, setAvailability] = useState(false);
  const [Reservation, setReservation] = useState(false);
  const [payment, setPayment] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInformation(true);
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const changeUI = () => {
    setEstimation(true);
    setStation(false);
    setInformation(false);
    setReservation(false);
    setPayment(false);
  };
  const changeUI2 = () => {
    setStation(true);
    setEstimation(false);
    setInformation(false);
    setReservation(false);
    setPayment(false);
  };

  const changeUI3 = () => {
    setStation(false);
    setEstimation(false);
    setInformation(true);
    setReservation(false);
    setPayment(false);
  };

  const changeUI4 = () => {
    setAvailability(true);
    setStation(false);
    setEstimation(false);
    setInformation(false);
    setReservation(false);
    setPayment(false);
  };

  const changeUI5 = () => {
    setAvailability(false);
    setStation(false);
    setEstimation(false);
    setInformation(false);
    setReservation(true);
    setPayment(false);
  };
  const changeUI6 = () => {
    setAvailability(false);
    setStation(false);
    setEstimation(false);
    setInformation(false);
    setReservation(false);
    setPayment(true);
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  const [email, setEmail] = useState("");

  const [user, setUser] = useState(null);
  useEffect(() => {
    const cookieEmail = Cookies.get("email");
    if (cookieEmail) {
      setEmail(cookieEmail);
      fetchUserData(cookieEmail);
    } else {
      console.log("No email found in cookies.");
    }
  }, []);

  const [status, setStatus] = useState(false);
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
      setStatus(userData.isBlocked);
      console.log("user data from admin", userData);
    } catch (error) {
      console.log("Error fetching user data: " + error.message);
    }
  };

  fetchUserData();

  const stat = Cookies.get("stationId");

  const [isListening, setIsListening] = useState(false);

  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleNotification = (message) => {
      if (message.stationId === stat) {
        setNotification(message);
        setShowNotification(true);
        console.log("Received notification for station:", message.stationId);
      }
    };

    socket.on("receiveNotificationNavbar", handleNotification);

    return () => {
      socket.off("receiveNotificationNavbar", handleNotification);
    };
  }, [stat]);

  const showNL = () => {
    setIsListening(!isListening);
    setShowNotification(false);
  };

  const logout = () => {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      Cookies.remove(cookieName);
    });

    window.location.href = "/login";
  };

  const [sidebar, setSidebar] = useState(false);
  const showSideBar = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <aside class="bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
        <div class="relative border-b border-white/20">
          <a class="flex items-center gap-4 py-6 px-8" href="#/">
            <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
              Station Owner Dashboard
            </h6>
          </a>
          <button
            class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
            type="button"
          >
            <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5 text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </span>
          </button>
        </div>
        <div class="m-4">
          <ul class="mb-4 flex flex-col gap-1">
            <li
              className={`${activeIndex === 0 ? "bg-blue-500 rounded-lg" : ""}`}
              onClick={() => {
                handleItemClick(0);
                changeUI();
              }}
            >
              <a className="" href="#">
                <button
                  className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                  </svg>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    Estimation
                  </p>
                </button>
              </a>
            </li>

            <li
              className={`${activeIndex === 2 ? "bg-blue-500 rounded-lg" : ""}`}
              onClick={() => {
                handleItemClick(2);
                changeUI3();
              }}
            >
              <a class="" href="#">
                <button
                  class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    Get Station Informations
                  </p>
                </button>
              </a>
            </li>

            <li
              className={`${activeIndex === 4 ? "bg-blue-500 rounded-lg" : ""}`}
              onClick={() => {
                handleItemClick(4);
                changeUI5();
              }}
            >
              <a class="" href="#">
                <button
                  class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="w-5 h-5 text-inherit"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    Reservations
                  </p>
                </button>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="p-4 xl:ml-80">
        <nav class="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
          <div class="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
            <div class="flex justify-between items-center w-full">
              <button
                class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                type="button"
              >
                <span
                  class="absolute top-1/2 left-10 transform -translate-y-1/2 -translate-x-1/2"
                  onClick={showSideBar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    stroke-width="3"
                    class="h-6 w-6 text-blue-gray-500"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
              <div className="flex relative lg:left-3/4 xl:left-3/4">
                <a href="#">
                  <button
                    class="middle none font-sans font-bold center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 hidden items-center gap-1 px-4 xl:flex"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      class="h-5 w-5 text-blue-gray-500"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Welcome <span className="text-blue-500"></span>
                  </button>
                  <button
                    class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                    type="button"
                  >
                    <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="h-5 w-5 text-blue-gray-500"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </a>

                <button
                  aria-expanded="false"
                  aria-haspopup="menu"
                  id=":r2:"
                  className="relative -left-2 middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                  type="button"
                  onClick={showNL}
                >
                  {showNotification && (
                    <>
                      <span className="bg-red-500 rounded-full px-2 relative -top-3 left-2 z-50 text-white"></span>
                    </>
                  )}
                  {isListening && (
                    <div class="bg-white text-black border z-10 w-80 relative right-56 top-10 rounded-lg shadow-xl h-20 ">
                      <div class="relative top-4 ">
                        <h4 class="font-bold  flex justify-start  pl-4">
                          New Reservation
                        </h4>
                        <p class="font-semibold  flex justify-start  pl-4 pt-1">
                          Check Reservation List Please
                        </p>
                      </div>
                    </div>
                  )}

                  <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      class="h-5 w-5 text-blue-gray-500"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid"
                >
                  <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 material-icons">
                    logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div class="capitalize">
          <h6 class="">
            <Available />
          </h6>
        </div>
      </div>

      {estimation && <Estimation user={user} status={status} />}
      {Station && <StationInfos status={status} />}
      {loading ? (
        <Spinner />
      ) : (
        information && (
          <div>
            <Informations user={user} status={status} />
          </div>
        )
      )}

      {Reservation && (
        <div>
          <ReservList status={status} />
        </div>
      )}

      {sidebar && (
        <>
          <aside class="bg-gradient-to-br from-gray-800 to-gray-900 w-2/3 absolute top-16 h-screen rounded-xl">
            <div class="relative border-b border-white/20">
              <a class="flex items-center gap-4 py-6 px-8" href="#/">
                <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
                  Admin Dashboard
                </h6>
              </a>
              <button
                class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
                type="button"
              >
                <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="h-5 w-5 text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
            <div class="m-4">
              <ul class="mb-4 flex flex-col gap-1">
                <li
                  className={`${
                    activeIndex === 0 ? "bg-blue-500 rounded-lg" : ""
                  }`}
                  onClick={() => {
                    handleItemClick(0);
                    changeUI();
                  }}
                >
                  <a className="" href="#">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Estimation
                      </p>
                    </button>
                  </a>
                </li>

                <li
                  className={`${
                    activeIndex === 2 ? "bg-blue-500 rounded-lg" : ""
                  }`}
                  onClick={() => {
                    handleItemClick(2);
                    changeUI3();
                  }}
                >
                  <a class="" href="#">
                    <button
                      class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Get Station Informations
                      </p>
                    </button>
                  </a>
                </li>

                <li
                  className={`${
                    activeIndex === 4 ? "bg-blue-500 rounded-lg" : ""
                  }`}
                  onClick={() => {
                    handleItemClick(4);
                    changeUI5();
                  }}
                >
                  <a class="" href="#">
                    <button
                      class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="w-5 h-5 text-inherit"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Reservations
                      </p>
                    </button>
                  </a>
                </li>

                <li
                  className={`${
                    activeIndex === 5 ? "bg-blue-500 rounded-lg" : ""
                  }`}
                  onClick={() => {
                    handleItemClick(5);
                    changeUI6();
                  }}
                ></li>
              </ul>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
