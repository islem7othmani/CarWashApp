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
  const reservationsPerPage = 10;
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [reservationById, setReservationById] = useState("");
  const stationId = Cookies.get("stationId");

 
  useEffect(() => {
    if (!stationId) {
      setError("Station ID not found in cookies.");
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/reservation/reservations/${stationId}`);
        const reservationsData = response.data;

        // Fetch user details for each reservation
        const reservationsWithUserDetails = await Promise.all(
          reservationsData.map(async (reservation) => {
            const userResponse = await axios.get(`http://localhost:8000/authentification/userId/${reservation.user}`);
            return {
              ...reservation,
              userDetails: userResponse.data,
            };
          })
        );

        // Sort reservations by createdAt in descending order
        reservationsWithUserDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReservations(reservationsWithUserDetails);

        // Update refused reservations set
        const newRefusedReservations = new Set(
          reservationsWithUserDetails
            .filter(reservation => checkDuplicate(reservation))
            .map(reservation => reservation._id)
        );
        setRefusedReservations(newRefusedReservations);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchReservations();

    // Set interval to fetch reservations every minute
    const interval = setInterval(fetchReservations, 60000); // 60000ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [stationId]);

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

  const handleRefuseClick = (reservationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to refuse this reservation?"
    );
    if (confirmed) {
      deleteReservation(reservationId);
    }
  };

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
      if (result.success) {
        setReservations(prevReservations =>
          prevReservations.filter(reservation => reservation._id !== reservationId)
        );
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  // Pagination logic
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  reservations.reverse()
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
console.log("rggg",reservations.reverse())
 // Function to get current time

// Function to get the current time
function getCurrentTime() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // JavaScript months are 0-based
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes()
  };
}

// Function to convert month name to number
function monthNameToNumber(monthName) {
  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };
  return monthMap[monthName] || 0; // Default to 0 if monthName is invalid
}
  useEffect(() => {
    // Function to check reservations
    function checkReservations() {
      const curr = getCurrentTime();
      
      if (reservations.length > 0) {
        reservations.forEach((reservation) => {
          if (
            reservation.year === undefined ||
            reservation.month === undefined ||
            reservation.day === undefined ||
            reservation.hour === undefined ||
            reservation.min === undefined
          ) {
            console.error('Invalid reservation data:', reservation);
            return;
          }

          const reservationYear = Number(reservation.year);
          const reservationDay = Number(reservation.day);
          const reservationHour = Number(reservation.hour);
          const reservationMinute = Number(reservation.min);
          const currentYear = Number(curr.year);
          const currentMonth = Number(curr.month);
          const currentDay = Number(curr.day);
          const currentHour = Number(curr.hour);
          const currentMinute = Number(curr.minute);
          const newMonth = monthNameToNumber(reservation.month);

          if (currentYear === reservationYear && currentMonth === newMonth && currentDay === reservationDay) {
            const currentMinutesSinceMidnight = currentHour * 60 + currentMinute;
            const reservationMinutesSinceMidnight = reservationHour * 60 + reservationMinute;
            const timeDifferenceMin = reservationMinutesSinceMidnight - currentMinutesSinceMidnight;

            if (timeDifferenceMin > 0 && timeDifferenceMin <= 15) {
              console.log('Reservation within 15 minutes:', reservation.user);
              socket.emit('sendReminder', reservation.user);
            }
          } else {
            console.log('Reservation is on a different day:', reservation.day, reservation.month, reservation.year);
            console.log('Current date is:', curr.day, curr.month, curr.year);
          }
        });
      }
    }

    // Set interval to check reservations every minute
    const interval = setInterval(checkReservations, 60000); // 60000ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [reservations]);

  if (loading) {
    return <div class="border-gray-300 absolute left-2/4 top-56 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                <th style={{ border: "1px solid black", padding: "8px" }}>User</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Car Size</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Type of Lavage</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Date</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Time</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Station</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>City</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>State</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Postal Code</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => {
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
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {`${reservation.day}-${reservation.month}-${reservation.year}`}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {`${reservation.hour}:${reservation.min}`}
                    </td>
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
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {!isRefused && (
                        <button
                          className="px-6 py-2 min-w-[120px] text-center text-violet-600 border border-violet-600 rounded hover:bg-violet-600 hover:text-white active:bg-indigo-500 focus:outline-none focus:ring"
                          onClick={() => handleRefuseClick(reservation._id)}
                        >
                          Refuse
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center p-4">
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
