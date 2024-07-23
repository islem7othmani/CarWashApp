import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import io from 'socket.io-client';


const socket = io('http://localhost:5000'); 

export default function Navbar(msg) {
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification]=useState(false);
  
  const [notification2, setNotification2] = useState('');
  const [showNotification2, setShowNotification2]=useState(false);

  const [reservationById, setReservationById]= useState('')



//const us= user


  



  
  const [email, setEmail] = useState("");
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




  const [user, setUser] = useState('');
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



 // console.log(user._id);

 
 const fetchReservationsById = async (message2) => {
  try {
      console.log("Fetching reservations for:", message2); // Log before fetch
      

      const response = await fetch(`http://localhost:8000/reservation/reservationById/${message2}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Error: ${response.status} ${response.statusText} - ${errorDetails}`);
      }

      const data = await response.json();
      console.log("Fetched reservations:", data); // Log fetched data
      setReservationById(data);
  } catch (error) {
      console.error('Failed to fetch reservations:', error);
  }
};



useEffect(() => {
  socket.on("receiveNotification", (message) => {
    setNotification(message);
    setShowNotification(true);
  });
  socket.on("receiveNotification3", async (message2) => {
    console.log("Received notification 3:", message2);
    await fetchReservationsById(message2);
  });

  return () => {
    socket.off("receiveNotification");
    socket.off("receiveNotification3");
  };
}, []);

useEffect(() => {
  if (reservationById && user && reservationById.user === user._id) {
    setNotification2(reservationById);
    setShowNotification2(true);
  }
}, [reservationById, user]);


console.log("iferjlqekjgrlkjrg",user)
console.log("iferjlqekjgrlkjrg",reservationById.user)
console.log("iferjlqekjgrlkjrg",user._id)




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
                    class="text-black/60 truserIdansition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
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

                <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    class="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
                    href={`/MyReservation/${user._id}`}
                    data-twe-nav-link-ref
                  >
                    My Reservations
                  </a>
                </li>
              
              </ul>
            </div>

            <div className="relative flex items-center justify-between">
            {showNotification2 && (
      <>
      <div className="text-white bg-red-500 rounded-full absolute -left-4 bottom-4 z-50 h-4 w-4 flex items-center  justify-center">
        <span>2</span>
      </div>











</>







    )}
  <div
    className="relative top-2 right-8"
    data-twe-dropdown-ref
    data-twe-dropdown-alignment="end"
  >
    {showNotification && (
      <div className="text-white bg-red-500 rounded-full absolute left-2 h-6 w-6 flex items-center justify-center">
        <span>2</span>
      </div>










    )}
   
    <a
      className="me-4 flex items-center text-neutral-600 dark:text-white"
      href="#"
      id="dropdownMenuButton1"
      role="button"
      data-twe-dropdown-toggle-ref
      aria-expanded="false"
    >
      <span className="[&>svg]:w-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span className="absolute -mt-4 ms-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">
        1
      </span>
    </a>
  </div>
  <div className="relative top-2 right-8">{user.username}</div>
  <div
    className="relative"
    data-twe-dropdown-ref
    data-twe-dropdown-alignment="end"
  >
    <a className="flex items-center relative top-2 right-4">
      <img
        src={
          user.profilepic ||
          "https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1-640x640.jpg"
        }
        className="h-12 rounded-full"
        alt=""
        loading="lazy"
      />
    </a>
  </div>
  <button
    onClick={logout}
    className="relative top-2 font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid"
  >
    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 material-icons">
      logout
    </span>
  </button>
</div>

          </div>



          

























        </nav>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
