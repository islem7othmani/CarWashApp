import {React,useState,useEffect} from "react";
import Cookies from "js-cookie";

export default function Navbar(msg) {
  if (msg !== "") {
    console.log("it works from navbar", msg);
  }

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
        const response = await fetch(`http://localhost:8000/authentification/User/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure that cookies are sent with the request
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
  
        const userData = await response.json();
        setUser(userData);
        console.log("user data",userData)
        console.log(user)
      } catch (error) {
        setError("Error fetching user data: " + error.message);
      }
    };
  return (
    <>
      {user ? (
      <nav class="flex-no-wrap relative flex w-full items-center justify-between h-12">
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
                  href="/MapComponent"
                  data-twe-nav-link-ref
                >
                  Find Stations
                </a>
              </li>
              <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                <a
                  class="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
                  href="/reservation"
                  data-twe-nav-link-ref
                >
                  Reservation 
                </a>
              </li>
              <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                <a
                  class="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
                  href="#"
                  data-twe-nav-link-ref
                >
                  Projects
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
                  src={user.profilepic || "https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1-640x640.jpg"}
                  class="h-12 rounded-full"
                  alt=""
                  loading="lazy"
                />
              </a>
              <ul
                class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                aria-labelledby="dropdownMenuButton2"
                data-twe-dropdown-menu-ref
              >
                <li>
                  <a
                    class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                    href="#"
                    data-twe-dropdown-item-ref
                  >
                    Action
                  </a>
                </li>
                <li>
                  <a
                    class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                    href="#"
                    data-twe-dropdown-item-ref
                  >
                    Another action
                  </a>
                </li>
                <li>
                  <a
                    class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                    href="#"
                    data-twe-dropdown-item-ref
                  >
                    Something else here
                  </a>
                </li>
              </ul>
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
