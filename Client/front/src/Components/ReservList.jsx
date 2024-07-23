import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ReservList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refusedReservations, setRefusedReservations] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);
  const stationId = Cookies.get("stationId");
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [reservationById, setReservationById]= useState('')

  useEffect(() => {
    if (!stationId) {
      setError("Station ID not found in cookies.");
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/reservation/reservations/${stationId}`
        );
        const reservationsData = response.data;

        // Fetch user details for each reservation
        const reservationsWithUserDetails = await Promise.all(
          reservationsData.map(async (reservation) => {
            const userResponse = await axios.get(
              `http://localhost:8000/authentification/userId/${reservation.user}`
            );
            return {
              ...reservation,
              userDetails: userResponse.data,
            };
          })
        );

        // Sort reservations by createdAt in ascending order and then reverse to get latest first
        reservationsWithUserDetails.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        reservationsWithUserDetails.reverse(); // Reverse the array to display latest first

        setReservations(reservationsWithUserDetails);

        // Find and log reservations with the same date and time
        const dateTimeMap = new Map();

        reservationsWithUserDetails.forEach((reservation) => {
          const dateTimeKey = `${reservation.day}-${reservation.month}-${reservation.year} ${reservation.hour}:${reservation.min}`;

          if (!dateTimeMap.has(dateTimeKey)) {
            dateTimeMap.set(dateTimeKey, []);
          }
          dateTimeMap.get(dateTimeKey).push(reservation);
        });

        // Log user IDs for reservations that are refused or duplicates
        dateTimeMap.forEach((reservationsAtSameTime) => {
          if (reservationsAtSameTime.length > 1) {
            reservationsAtSameTime.forEach((reservation) => {
              if (
                refusedReservations.has(reservation._id) ||
                checkDuplicate(reservation)
              ) {
                console.log(
                  `Reservation ID: ${reservation._id}, User ID: ${reservation.user}`
                );
              }
            });
          }
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [stationId, refusedReservations]);

  // Function to check if a reservation is a duplicate
  const checkDuplicate = (reservation) => {
    return reservations.some(
      (res) =>
        res._id !== reservation._id &&
        res.day === reservation.day &&
        res.month === reservation.month &&
        res.year === reservation.year &&
        res.hour === reservation.hour &&
        res.min === reservation.min
    );
  };

  const [message, setMessage] = useState('');
  const handleRefuseClick = (reservationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to refuse this reservation?"
    );
    if (confirmed) {
      setRefusedReservations((prev) => new Set(prev).add(reservationId));
      
      socket.emit('sendNotification3', message);
      setMessage(reservationId);
      console.log("sended notif 3.",message)

      deleteReservation(reservationId)
    }


  };

  // Pagination logic
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const deleteReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/reservation/delete/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Delete result:", result);
      if (result.success) {
        window.location.reload(); // This will reload the page
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="absolute left-80">
      <h2 className="font-semibold text-xl text-blue-600 pb-4">
        Reservations for Station
      </h2>
      {reservations.length === 0 ? (
        <div>No reservations found for this station.</div>
      ) : (
        <>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  User
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Car Size
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Type of Lavage
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Time
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Station
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  City
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  State
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Postal Code
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation, index) => {
                const isDuplicate = checkDuplicate(reservation);
                const isRefused = refusedReservations.has(reservation._id);

                return (
                  <tr key={reservation._id}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.userDetails.username || "Unknown"}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.carSize}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.typeLavage}
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    >{`${reservation.day}-${reservation.month}-${reservation.year}`}</td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    >{`${reservation.hour}:${reservation.min}`}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.stationDetails.nameStation}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.stationDetails.city}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.stationDetails.state}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {reservation.stationDetails.CodePostal}
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                      className="space-x-2"
                    >
                      {!isRefused && (
                        <>
                          
                          <button
                            className="px-6 py-2 min-w-[120px] text-center text-violet-600 border border-violet-600 rounded hover:bg-violet-600 hover:text-white active:bg-indigo-500 focus:outline-none focus:ring"
                            onClick={() => {
                              handleRefuseClick(reservation._id);
                            }}
                          >
                            Refuse
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination" class="flex justify-center p-4 ">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1
                    ? "bg-violet-600 text-white"
                    : "bg-white text-violet-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReservList;
