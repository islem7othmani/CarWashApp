import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

export default function Navbar(msg) {
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification]=useState(false);
  const [notification2, setNotification2] = useState('');
  const [showNotification2, setShowNotification2]=useState(false);
  useEffect(() => {
    socket.on('receiveNotification', (message) => {
      setNotification(message);
      setShowNotification(true);
    });
 
    return () => {
      socket.off('receiveNotification'); // Clean up the subscription on component unmount
    };
  }, []);



  
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
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
          credentials: "include", // Ensure that cookies are sent with the request
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const userData = await response.json();
      setUser(userData);
      console.log("user data", userData);
      console.log(user);
    } catch (error) {
      setError("Error fetching user data: " + error.message);
    }
  };





  const logout = () => {
    // Remove all cookies
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      Cookies.remove(cookieName);
    });
    // Redirect to login page or home page
    window.location.href = "/login";
  };
  return (
    <>
      {user ? (
        <nav class="flex-no-wrap relative flex w-full items-center justify-between h-12 z-50">
          <div class="flex w-full flex-wrap items-center justify-between px-3">
            <button
              class="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
              type="button"
              data-twe-collapse-init
              data-twe-target="#navbarSupportedContent1"
              aria-controls="navbarSupportedContent1"
              aria-expanded="false"
              aria-label="Toggle navigation"
            ></button>

            <div class="relative top-2 left-4">
              <ul
                class="list-style-none me-auto flex flex-col ps-0 lg:flex-row"
                data-twe-navbar-nav-ref
              >
                <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    class="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
                    href={`/MapComponent/${user._id}`}
                    data-twe-nav-link-ref
                  >
                    Find Stations
                  </a>
                </li>
                <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    class="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
                    href="/home"
                    data-twe-nav-link-ref
                  >
                    Home
                  </a>
                </li>
              
              </ul>
            </div>

            <div class="relative flex items-center justify-between">
              <div
                class="relative top-2 right-8"
                data-twe-dropdown-ref
                data-twe-dropdown-alignment="end"
              >
                  {showNotification && (
          <div className="text-white bg-red-500 rounded-full relative left-2 h-6 w-6">
            <span className="flex justify-center items-center h-full w-full">2</span>
          </div>
        )}
                <a
                  class="me-4 flex items-center text-neutral-600 dark:text-white"
                  href="#"
                  id="dropdownMenuButton1"
                  role="button"
                  data-twe-dropdown-toggle-ref
                  aria-expanded="false"
                >
                  
                  <span class="[&>svg]:w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                  <span class="absolute -mt-4 ms-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">
                    1
                  </span>
                </a>
              </div>
              <div className="relative top-2 right-8">{user.username}</div>
              <div
                class="relative"
                data-twe-dropdown-ref
                data-twe-dropdown-alignment="end"
              >
                <a class="flex items-center relative top-2 right-4">
                  <img
                    src={
                      user.profilepic ||
                      "https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1-640x640.jpg"
                    }
                    class="h-12 rounded-full"
                    alt=""
                    loading="lazy"
                  />
                </a>
              </div>
              <button
                onClick={logout}
                className="relative middle top-2 none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 material-icons">
                  logout
                </span>
              </button>
            </div>
          </div>



          
















          <div class='flex flex-col gap-3'>
    <div class="relative border border-gray-200 rounded-lg shadow-lg">
      <button onClick='return this.parentNode.remove()'
        class="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    
      <div class="flex items-center p-4">
        <img
          class="object-cover w-12 h-12 rounded-lg"
          src="https://randomuser.me/api/portraits/women/71.jpg"
          alt=""
        />
    
        <div class="ml-3 overflow-hidden">
          <p class="font-medium text-gray-900">Jan Doe</p>
          <p class="max-w-xs text-sm text-gray-500 truncate">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
            laborum?
          </p>
        </div>
      </div>
    </div>
    <div class="relative border border-gray-200 rounded-lg shadow-lg">
      <button onClick='return this.parentNode.remove()'
        class="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    
      <div class="flex items-center p-4">
        <img
          class="object-cover w-12 h-12 rounded-lg"
          src="https://randomuser.me/api/portraits/men/71.jpg"
          alt=""
        />
    
        <div class="ml-3 overflow-hidden">
          <p class="font-medium text-gray-900">John Doe</p>
          <p class="max-w-xs text-sm text-gray-500 truncate">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
            laborum?
          </p>
        </div>
      </div>
    </div>
    <div class="relative border border-gray-200 rounded-lg shadow-lg">
      <button onClick='return this.parentNode.remove()'
        class="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    
      <div class="flex items-center p-4">
        <img
          class="object-cover w-12 h-12 rounded-lg"
          src="https://randomuser.me/api/portraits/men/5.jpg"
          alt=""
        />
    
        <div class="ml-3 overflow-hidden">
          <p class="font-medium text-gray-900">Mike Doe</p>
          <p class="max-w-xs text-sm text-gray-500 truncate">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
            laborum?
          </p>
        </div>
      </div>
    </div>


</div>









        </nav>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
