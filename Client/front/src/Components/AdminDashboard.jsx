import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import UserUpdateForm from './UserUpdateForm';  
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);
    const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:8000/payment/payments');
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);

        // Calculate the total amount
        const total = data.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalAmount(total);

        // Process data for charts
        const sales = new Array(12).fill(0); // Assuming 12 months
        const revenue = new Array(12).fill(0);

        data.forEach(payment => {
          const month = new Date(payment.date).getMonth(); // Assuming 'date' field exists in payment
          sales[month] += 1; // Increment sales count for the month
          revenue[month] += payment.amount; // Add payment amount to the month's revenue
        });

        setMonthlySales(sales);
        setMonthlyRevenue(revenue);

      } catch (error) {
        console.error('Error fetching payments:', error.message);
      }
    };

    fetchPayments();
  }, []);


    const [users, setUsers] = useState(false);

   const salesChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Monthly Sales",
        data: monthlySales,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const revenueChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  const [users1, setUsers1] = useState(false);
  const [owners, setOwners] = useState(false);
  const [dash, setDash] = useState(true);
  const [pay, setPay] = useState(false);

  const [payments1, setPayments1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch payments data from the backend
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/paymentS/paymentsstation",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
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

  const showdash = () => {
    setDash(true);
    setUsers1(false);
    setOwners(false);
    setPay(false);
  };
  const showusers = () => {
    setUsers1(true);
    setDash(false);
    setOwners(false);
    setPay(false);
  };
  const showOwners = () => {
    setOwners(true);
    setDash(false);
    setUsers1(false);
    setPay(false);
  };
  const showpays = () => {
    setPay(true);
    setDash(false);
    setUsers1(false);
    setOwners(false);
  };

  const [activeItem, setActiveItem] = useState(null);

  // Event handler to set the active item
  const handleClick = (item) => {
    setActiveItem(item);
  };

  const [color,setColor]= useState("bg-white")

  const blockUser = async (userId, isBlocked, index) => {
    const confirmed = window.confirm(
      "Are you sure you want to block this user?"
    );
    if (confirmed) {
      setColor("bg-red-100")
      // Update color in the state for the specific row
      setPayments((prevPayments) =>
        prevPayments.map((payment, i) =>
          i === index ? { ...payment, isBlocked, color: "bg-red-500" } : payment
        )
      );

      try {
        const response = await fetch(
          `http://localhost:8000/authentification/updateuser/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isBlocked }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Extract the error message from the response
          throw new Error(
            `Failed to update user status: ${
              errorData.message || response.statusText
            }`
          );
        }

        const updatedUser = await response.json();
        console.log("User status updated:", updatedUser);
      } catch (error) {
        console.error("Error updating user status:", error.message);
      }
    }
  };

  const unblockUser = async (userId, index) => {
    const confirmed = window.confirm(
      "Are you sure you want to unblock this user?"
    );
    if (confirmed) {
      setColor("bg-white")
      // Update color in the state for the specific row
      setPayments((prevPayments) =>
        prevPayments.map((payment, i) =>
          i === index
            ? { ...payment, isBlocked: false, color: "bg-white" }
            : payment
        )
      );

      try {
        const response = await fetch(
          `http://localhost:8000/authentification/updateuser/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isBlocked: false }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Extract the error message from the response
          throw new Error(
            `Failed to update user status: ${
              errorData.message || response.statusText
            }`
          );
        }

        const updatedUser = await response.json();
        console.log("User status updated:", updatedUser);
      } catch (error) {
        console.error("Error updating user status:", error.message);
      }
    }
  };










  const [userCount, setUserCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/authentification/allUsers');
        if (!response.ok) throw new Error('Failed to fetch users');
  
        const users = await response.json();
        setUsers(users);
  
        // Calculate the total number of users
        setUserCount(users.length);
  
        // Calculate the number of users with isBlocked = false
        const activeUsers = users.filter(user => !user.isBlocked);
        setActiveUserCount(activeUsers.length);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
  
    fetchUsers();
  }, []);
  



  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8000/authentification/deleteUser/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) throw new Error('Failed to delete user');
  
        alert('User deleted successfully');
  
        // Remove the deleted user from the state
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        console.error('Error deleting user:', err.message);
        alert('Error deleting user');
      }
    }
  };
  


  const [selectedUser, setSelectedUser] = useState(null);  // State for the user to be updated
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleUpdateClick = (user) => {
    setSelectedUser(user);  // Set the user to be updated
    setShowUpdateForm(true);  // Show the update form
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
  };


  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <nav
  aria-label="menu nav"
  className="bg-gray-800 pt-2 md:pt-1 pb-1 px-1 mt-0 h-auto fixed w-full z-20 top-0"
>
  <div className="flex flex-wrap items-center justify-between">
    <div className="flex-shrink-0 md:w-1/3 text-white flex justify-center md:justify-start">
      <a href="#" aria-label="Home">
        <span className="text-xl pl-2">
          <i className="em em-grinning"></i>
        </span>
      </a>
    </div>
  
    <div className="flex w-full md:w-1/3 justify-end order-2 md:order-none">
      <ul className="list-reset flex justify-end items-center">
        <li className="flex-1 md:flex-none md:mr-3">
          <div className="relative inline-block">
            <button className="drop-button text-white py-2 px-2">
              <span className="pr-2">
                <i className="em em-robot_face"></i>
              </span>{" "}
              Welcome, Admin
              <svg
                className="h-3 fill-current inline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</nav>

<div className="flex flex-1 flex-col md:flex-row">
  {/* Sidebar */}
  <nav aria-label="alternative nav">
    <div className="bg-gray-800 shadow-xl h-20 fixed bottom-0 md:bottom-auto md:top-0 md:h-screen w-full md:w-48 z-10 content-center">
      <div className="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
        <ul className="list-reset flex flex-row md:flex-col pt-3 md:py-3 px-1 md:px-2 text-center md:text-left">
          <li className="mr-3 flex-1">
            <a
              href="#"
              onClick={() => {
                handleClick("dashboard");
                showdash();
              }}
              className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
                activeItem === "dashboard"
                  ? "border-pink-500"
                  : "border-gray-800"
              }`}
            >
              <i className="fas fa-tasks pr-0 md:pr-3"></i>
              <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                Dashboard
              </span>
            </a>
          </li>
          <li className="mr-3 flex-1">
            <a
              href="#"
              onClick={() => {
                handleClick("users");
                showusers();
              }}
              className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
                activeItem === "users"
                  ? "border-purple-500"
                  : "border-gray-800"
              }`}
            >
              <i className="fa fa-envelope pr-0 md:pr-3"></i>
              <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                Manage Users
              </span>
            </a>
          </li>
          <li className="mr-3 flex-1">
            <a
              href="#"
              onClick={() => {
                handleClick("payments");
                showpays();
              }}
              className={`block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:text-white border-b-2 ${
                activeItem === "payments"
                  ? "border-red-500"
                  : "border-gray-800"
              }`}
            >
              <i className="fa fa-wallet pr-0 md:pr-3"></i>
              <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                Payments
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  {/* Main Content */}
  {dash && (
    <section className="container mx-auto pt-20 md:pt-0 md:pl-52 relative top-20 ">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5">
          <div className="flex flex-row items-center">
            <div className="flex-shrink pr-4">
              <div className="rounded-full py-3 px-4 bg-yellow-600">
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
            </div>
            <div className="flex-1 text-right md:text-center">
              <h2 className="font-bold uppercase text-gray-600">Total Revenue</h2>
              <p className="font-bold text-3xl">
                {totalAmount} DT
                <span className="text-green-500">
                  <i className="fas fa-caret-up"></i>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-pink-200 to-pink-100 border-b-4 border-pink-500 rounded-lg shadow-xl p-5">
          <div className="flex flex-row items-center">
            <div className="flex-shrink pr-4">
              <div className="rounded-full py-3 px-4 bg-yellow-600">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
            <div className="flex-1 text-right md:text-center">
              <h2 className="font-bold uppercase text-gray-600">Total Users</h2>
              <p className="font-bold text-3xl">
                {userCount}{" "}
                <span className="text-pink-500">
                  <i className="fas fa-exchange-alt"></i>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5">
          <div className="flex flex-row items-center">
            <div className="flex-shrink pr-4">
              <div className="rounded-full py-3 px-4 bg-yellow-600">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
            <div className="flex-1 text-right md:text-center">
              <h2 className="font-bold uppercase text-gray-600">Non Blocked Users</h2>
              <p className="font-bold text-3xl">
                {activeUserCount}{" "}
                <span className="text-yellow-600">
                  <i className="fas fa-caret-up"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <div className="w-full md:w-1/2 border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Line Chart</h2>
          <Line data={salesChartData} />
        </div>

        <div className="w-full md:w-1/2 border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Bar Chart</h2>
          <Bar data={revenueChartData} />
        </div>
      </div>
    </section>
  )}
</div>

      </div>

      {users1 && (
  <div className="overflow-x-auto absolute top-28 w-full md:w-2/3 md:left-56 px-4">
    
    <table className="w-full text-sm text-left text-gray-500 shadow-xl">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Phone
          </th>
          <th scope="col" className="px-6 py-3">
            Email
          </th>
          <th scope="col" className="px-6 py-3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="bg-white border-b">
            <td className="px-6 py-4 font-medium text-gray-900">
              {user.username}
            </td>
            <td className="px-6 py-4">{user.phone}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                onClick={() => handleUpdateClick(user)}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {showUpdateForm && selectedUser && (
      <UserUpdateForm
        user={selectedUser}
        onClose={() => setShowUpdateForm(false)}
        onUpdate={handleUpdate}
      />
    )}
  </div>
)}


    
{pay && (
  <>
    <div className="flex flex-col md:flex-row z-10 absolute top-20 left-4 md:left-56 space-y-6 md:space-y-0 md:space-x-6 w-full md:w-2/3">
      {/* First Table */}
      <div className="w-full">
        <table className="w-full text-sm text-left text-gray-500 shadow-xl overflow-x-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2">
                Name
              </th>
              <th scope="col" className="px-4 py-2">
                Card Number
              </th>
              <th scope="col" className="px-4 py-2">
                Amount
              </th>
              <th scope="col" className="px-4 py-2">
                Date
              </th>
              <th scope="col" className="px-4 py-2">
                Status
              </th>
              <th scope="col" className="px-4 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment._id}
                className={`border-b ${
                  payment.isBlocked ? "bg-red-100" : "bg-white"
                }`}
              >
                <td className="px-4 py-2 font-medium text-gray-900">
                  {payment.name || "Unknown User"}
                </td>
                <td className="px-4 py-2">{payment.cardNumber || "N/A"}</td>
                <td className="px-4 py-2">{payment.amount || "N/A"}</td>
                <td className="px-4 py-2">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td
                  className="px-4 py-2"
                  style={{
                    backgroundColor: payment.userDetails.isBlocked
                      ? "red"
                      : "green",
                    color: "white",
                  }}
                >
                  {payment.userDetails.isBlocked ? "Blocked" : "Unblocked"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() =>
                      unblockUser(payment.userDetails._id, index)
                    }
                  >
                    <span className="text-white">Unblock</span>
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() =>
                      blockUser(payment.userDetails._id, true, index)
                    }
                  >
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
  );
}
