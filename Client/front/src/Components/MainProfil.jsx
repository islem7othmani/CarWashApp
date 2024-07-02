import {React,useState,useEffect} from "react";
import Cookies from "js-cookie";

export default function MainProfil() {
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

    <div className='relative top-6 '>
        <img src="https://i.pinimg.com/564x/6b/9d/75/6b9d75569b9b2f49967153b03afdac47.jpg" alt="" className='w-screen h-60' />
    </div>

<div className='flex justify-center  '>
   <div className='h-96 w-64 rounded-xl shadow-xl relative -top-10 bg-wite z-50  -left-12'>
   {user ? (
    <div className='bg-white pt-4  rounded-xl'>
     
    
        <div class=" ">
  <div class="relative left-20 ml-2 ">
  <img class="w-20 h-20 rounded-full absolute" src={user.profilepic || "https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1-640x640.jpg"} alt="" />
  <div class="w-20 h-20 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
    <img class="hidden group-hover:block w-6" src="https://www.svgrepo.com/show/33565/upload.svg" alt="" />
  </div>
  
</div>

</div>













<div className="relative top-20">
<h1 className='flex justify-center pt-2 font-bold text-xl pb-6'>{user.username}</h1>
</div>


        

        <div className='font-medium text-lg relative top-20'>
        <p className='flex justify-center'>{user.email}</p>
        <p className='flex justify-center'>{user.phone}</p>
      
        </div>
    </div>
     ) : (
        <p>Loading...</p>
      )}
    </div>




<div className='grid grid-cols-3 space-x-4 space-y-1'>

    <div class="h-96 relative top-12 w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#" className='flex justify-center pt-4'>
        <img class="rounded-t-lg h-36 rounded-xl" src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960" alt="" />
    </a>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
        </a>
        
        <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
</div>




<div class="h-96 relative top-12 w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#" className='flex justify-center pt-4'>
        <img class="rounded-t-lg h-36 rounded-xl" src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960" alt="" />
    </a>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
        </a>
        
        <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
</div>




<div class="h-96 relative top-12 w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#" className='flex justify-center pt-4'>
        <img class="rounded-t-lg h-36 rounded-xl" src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960" alt="" />
    </a>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
        </a>
        
        <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
</div>




<div class="h-96 relative top-12 w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#" className='flex justify-center pt-4'>
        <img class="rounded-t-lg h-36 rounded-xl" src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960" alt="" />
    </a>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
        </a>
        
        <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
</div>

</div>
    </div>
    </>
  )
}
