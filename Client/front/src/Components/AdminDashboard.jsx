import React, { useState , useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement,BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement,BarElement, Title, Tooltip, Legend);




export default function AdminDashboard() {







  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch('http://localhost:8000/payment/payments')
      .then(response => response.json())
      .then(data => setPayments(data))
      .catch(error => console.error('Error fetching payments:', error));
  }, []);



     const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };








  const data1 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [400, 450, 300, 500, 460, 700, 600],
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };












  const [users,setUsers]=useState(false)
  const [owners,setOwners]=useState(false)
  const [dash,setDash]=useState(true)
  const [pay,setPay]=useState(false)
  
  const [payments1, setPayments1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Fetch payments data from the backend
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:8000/paymentS/paymentsstation', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }

        const data = await response.json();
        setPayments1(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);


  const showdash =()=>{
    setDash(true)
    setUsers(false)
    setOwners(false)
    setPay(false)
  }
  const showusers =()=>{
    setUsers(true)
    setDash(false)
    setOwners(false)
    setPay(false)
  }
  const showOwners =()=>{
    setOwners(true)
    setDash(false)
    setUsers(false)
    setPay(false)
  }
  const showpays =()=>{
    setPay(true)
    setDash(false)
    setUsers(false)
    setOwners(false)
  }

    const [activeItem, setActiveItem] = useState(null);

  // Event handler to set the active item
  const handleClick = (item) => {
    setActiveItem(item);
  };




 

  return (
    <>
  <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav aria-label="menu nav" className="bg-gray-800 pt-2 md:pt-1 pb-1 px-1 mt-0 h-auto fixed w-full z-20 top-0">
        <div className="flex flex-wrap items-center">
          <div className="flex flex-shrink md:w-1/3 justify-center md:justify-start text-white">
            <a href="#" aria-label="Home">
              <span className="text-xl pl-2"><i className="em em-grinning"></i></span>
            </a>
          </div>
          <div className="flex flex-1 md:w-1/3 justify-center md:justify-start text-white px-2">
            <span className="relative w-full">
              <input aria-label="search" type="search" id="search" placeholder="Search" className="w-full bg-gray-900 text-white transition border border-transparent focus:outline-none focus:border-gray-400 rounded py-3 px-2 pl-10 appearance-none leading-normal" />
              <div className="absolute search-icon" style={{ top: '1rem', left: '.8rem' }}>
                <svg className="fill-current pointer-events-none text-white w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
              </div>
            </span>
          </div>
          <div className="flex w-full pt-2 content-center justify-between md:w-1/3 md:justify-end">
            <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
              <li className="flex-1 md:flex-none md:mr-3">
                <a className="inline-block py-2 px-4 text-white no-underline" href="#">Active</a>
              </li>
              <li className="flex-1 md:flex-none md:mr-3">
                <a className="inline-block text-gray-400 no-underline hover:text-gray-200 hover:text-underline py-2 px-4" href="#">Link</a>
              </li>
              <li className="flex-1 md:flex-none md:mr-3">
                <div className="relative inline-block">
                  <button className="drop-button text-white py-2 px-2">
                    <span className="pr-2"><i className="em em-robot_face"></i></span> Hi, User
                    <svg className="h-3 fill-current inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </button>
                  <div id="myDropdown" className="dropdownlist absolute bg-gray-800 text-white right-0 mt-3 p-3 overflow-auto z-30 invisible">
                    <input type="text" className="drop-search p-2 text-gray-600" placeholder="Search.." id="myInput" />
                    <a href="#" className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block"><i className="fa fa-user fa-fw"></i> Profile</a>
                    <a href="#" className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block"><i className="fa fa-cog fa-fw"></i> Settings</a>
                    <div className="border border-gray-800"></div>
                    <a href="#" className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block"><i className="fas fa-sign-out-alt fa-fw"></i> Log Out</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav aria-label="alternative nav">
          <div className="bg-gray-800 shadow-xl h-20 fixed bottom-0 mt-12 md:relative md:h-screen z-10 w-full md:w-48 content-center">
            <div className="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
            <ul className="list-reset flex flex-row md:flex-col pt-3 md:py-3 px-1 md:px-2 text-center md:text-left">
      <li className="mr-3 flex-1">
        <a
          href="#"
          onClick={() => {
            handleClick('dashboard');
            showdash();
          }}
          className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
            activeItem === 'dashboard' ? 'border-pink-500' : 'border-gray-800'
          }`}
        >
          <i className="fas fa-tasks pr-0 md:pr-3"></i>
          <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">Dashboard</span>
        </a>
      </li>
      <li className="mr-3 flex-1">
        <a
          href="#"
          onClick={() => {handleClick('users');showusers()}}
          className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
            activeItem === 'users' ? 'border-purple-500' : 'border-gray-800'
          }`}
        >
          <i className="fa fa-envelope pr-0 md:pr-3"></i>
          <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">Manage Users</span>
        </a>
      </li>
      <li className="mr-3 flex-1">
        <a
          href="#"
          onClick={() => {handleClick('stations');showOwners()}}
          className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
            activeItem === 'stations' ? 'border-blue-600' : 'border-gray-800'
          }`}
        >
          <i className="fas fa-chart-area pr-0 md:pr-3 text-blue-600"></i>
          <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">Manage Stations</span>
        </a>
      </li>
      <li className="mr-3 flex-1">
        <a
          href="#"
          onClick={() =>{ handleClick('payments');showpays()}}
          className={`block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
            activeItem === 'payments' ? 'border-red-500' : 'border-gray-800'
          }`}
        >
          <i className="fa fa-wallet pr-0 md:pr-3"></i>
          <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">Payments</span>
        </a>
      </li>
    </ul>
            </div>
          </div>
        </nav>

     
     {dash &&(
     <section className="container mx-auto pt-20">
     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
       <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5">
         <div className="flex flex-row items-center">
           <div className="flex-shrink pr-4">
           <div className="rounded-full py-3 px-4 bg-yellow-600">
 <FontAwesomeIcon icon={faShoppingCart} />
</div>                </div>
           <div className="flex-1 text-right md:text-center">
             <h2 className="font-bold uppercase text-gray-600">Total Revenue</h2>
             <p className="font-bold text-3xl">$3249 <span className="text-green-500"><i className="fas fa-caret-up"></i></span></p>
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-b from-pink-200 to-pink-100 border-b-4 border-pink-500 rounded-lg shadow-xl p-5">
         <div className="flex flex-row items-center">
           <div className="flex-shrink pr-4">
           <div className="rounded-full py-3 px-4  bg-yellow-600">
 <FontAwesomeIcon icon={faUser} />
</div>                </div>
           <div className="flex-1 text-right md:text-center">
             <h2 className="font-bold uppercase text-gray-600">Total Users</h2>
             <p className="font-bold text-3xl">249 <span className="text-pink-500"><i className="fas fa-exchange-alt"></i></span></p>
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5">
         <div className="flex flex-row items-center">
           <div className="flex-shrink pr-4">
           <div className="rounded-full py-3 px-4  bg-yellow-600">
 <FontAwesomeIcon icon={faUser} />
</div>
           </div>
           <div className="flex-1 text-right md:text-center">
             <h2 className="font-bold uppercase text-gray-600">New Users</h2>
             <p className="font-bold text-3xl">2,749 <span className="text-yellow-600"><i className="fas fa-caret-up"></i></span></p>
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-b from-blue-200 to-blue-100 border-b-4 border-blue-500 rounded-lg shadow-xl p-5">
         <div className="flex flex-row items-center">
           <div className="flex-shrink pr-4">
             <div className="rounded-full p-5 bg-blue-600"><i className="fas fa-server fa-2x fa-inverse"></i></div>
           </div>
           <div className="flex-1 text-right md:text-center">
             <h2 className="font-bold uppercase text-gray-600">Server Uptime</h2>
             <p className="font-bold text-3xl">152 days <span className="text-blue-500"><i className="fas fa-caret-up"></i></span></p>
           </div>
         </div>
       </div>
     </div>
















<div className='flex gap-4'>

<div className='w-1/2 relative top-10 border rounded-lg '>
 <h2>Line Chart</h2>
 <Line data={data} />
</div>

<div className='w-1/2 relative top-10 border rounded-lg '>
 <h2>Bar Chart</h2>
 <Bar data={data} />
</div>
</div>


    
   </section>
     )}
   
      </div>
    </div>




























    {users &&(
  <div className=" overflow-x-auto absolute top-28 w-2/3 left-56">
  <button
   
    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
  >
    Add New User
  </button>
  <table className="w-full text-sm text-left text-gray-500 shadow-xl">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3">Name</th>
        <th scope="col" className="px-6 py-3">Location</th>
        <th scope="col" className="px-6 py-3">Actions</th>
      </tr>
    </thead>
    <tbody>
    
        <tr  className="bg-white border-b">
          <td className="px-6 py-4 font-medium text-gray-900">john</td>
          <td className="px-6 py-4">uk</td>
          <td className="px-6 py-4">
            <button
              
              className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
            >
              Update
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </td>
        </tr>
    
    </tbody>
  </table>
</div>
    )}

  {owners &&(
     <div className=" overflow-x-auto absolute top-28 w-2/3 left-56">
     <button
      
       className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
     >
       Add New Station
     </button>
     <table className="w-full text-sm text-left text-gray-500 shadow-xl">
       <thead className="text-xs text-gray-700 uppercase bg-gray-50">
         <tr>
           <th scope="col" className="px-6 py-3">Name</th>
           <th scope="col" className="px-6 py-3">city</th>
           <th scope="col" className="px-6 py-3">County</th>
           <th scope="col" className="px-6 py-3">Actions</th>
         </tr>
       </thead>
       <tbody>
       
           <tr  className="bg-white border-b">
             <td className="px-6 py-4 font-medium text-gray-900">station shell</td>
             <td className="px-6 py-4">uk</td>
             <td className="px-6 py-4">uk</td>
             <td className="px-6 py-4">
               <button
                 
                 className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
               >
                 Update
               </button>
               <button
                 className="px-4 py-2 bg-red-500 text-white rounded"
               >
                 Delete
               </button>
             </td>
           </tr>
       
       </tbody>
     </table>
   </div>
  )}



  {pay && (
  
  <>
<div className="flex z-10 absolute top-20 left-56 space-x-6">
  {/* First Table */}
  <div className="w-3/5">
    <table className="w-full text-sm text-left text-gray-500 shadow-xl">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
        <th scope="col" className="px-4 py-2">Name</th>
          <th scope="col" className="px-4 py-2">Card Number</th>
          <th scope="col" className="px-4 py-2">Amount</th>
          <th scope="col" className="px-4 py-2">Date</th>
          <th scope="col" className="px-4 py-2">Action</th>

        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment._id} className="bg-white border-b">
            <td className="px-4 py-2 font-medium text-gray-900">
              {payment.name || 'Unknown User'}
            </td>
            <td className="px-4 py-2">
              {payment.cardNumber || 'N/A'}
            </td>
            <td className="px-4 py-2">
              {payment.amount || 'N/A'}
            </td>
            <td className="px-4 py-2">
              {new Date(payment.date).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
              <button className="px-2 py-1 bg-red-500 text-white rounded">
                Block User
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Second Table */}
  <div className="w-3/5">
    <table className="w-full text-sm text-left text-gray-500 shadow-xl">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-4 py-2">Name</th>
          <th scope="col" className="px-4 py-2">Card Number</th>
          <th scope="col" className="px-4 py-2">Amount</th>
          <th scope="col" className="px-4 py-2">Date</th>
          <th scope="col" className="px-4 py-2">Action</th>

        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment._id} className="bg-white border-b">
            <td className="px-4 py-2 font-medium text-gray-900">
              {payment.name || 'Unknown'}
            </td>
            <td className="px-4 py-2">
              {payment.cardNumber || 'N/A'}
            </td>
            <td className="px-4 py-2">
              ${payment.amount || 'N/A'}
            </td>
            <td className="px-4 py-2">
              {new Date(payment.date).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
            <button className="px-2 py-1 bg-red-500 text-white rounded">
                Block User
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


  </>
  )}

    </>
  )
}
