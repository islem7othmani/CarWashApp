import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const MyReserv = () => {
  const { userId } = useParams(); // Assume userId is passed as a route parameter
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(5);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/reservation/reservationByUser/${userId}`
        );
        setReservations(response.data); // Set the response data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching reservations:", err);
      }
    };

    fetchReservations();
  }, [userId]);

  // Pagination logic
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="w-screen ml-12 relative top-10">
        <h2 className="font-semibold text-xl text-blue-600 pb-4">Your Reservations</h2>
        {error && <div className="text-red-500">{error}</div>}
        {reservations.length === 0 ? (
          <div>No reservations found for this user.</div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-11/12">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Car Name</th>
                  <th scope="col" className="px-6 py-3">Model</th>
                  <th scope="col" className="px-6 py-3">Version</th>
                  <th scope="col" className="px-6 py-3">Marque</th>
                  <th scope="col" className="px-6 py-3">Image</th>
                </tr>
              </thead>
              <tbody>
                {currentReservations.map((reservation) => (
                  <tr key={reservation._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {reservation.carSize || "N/A"}
                    </td>
                    <td className="px-6 py-4">{reservation.typeLavage || "N/A"}</td>
                    <td className="px-6 py-4">
                      {reservation.day || "N/A"}-{reservation.month || "N/A"}-{reservation.year || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {reservation.hour || "N/A"}:{reservation.min || "N/A"}
                    </td>
                    <td className="px-6 py-4">{reservation.stationDetails?.nameStation || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pagination flex justify-center p-4 relative top-12">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border rounded bg-white text-violet-600"
          >
            Previous
          </button>
        )}
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
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border rounded bg-white text-violet-600"
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default MyReserv;
