import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import Cookies from 'js-cookie'; // Make sure to install this package if not already

const ReservationCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [isDisabled, setIsDisabled] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    carSize: '',
    typeLavage: '',
    date: new Date(),
    hour: '',
    min: ''
  });

  const disabledDateTimes = [
    new Date(2024, 6, 15, 3, 0), // July 15, 2024, at 3:00 AM
    new Date(2024, 6, 26, 0, 0), // July 26, 2024, at 12:00 AM
    new Date(2024, 6, 29, 0, 0), // July 29, 2024, at 12:00 AM
    new Date(2024, 6, 15, 18, 0) // July 15, 2024, at 6:00 PM
  ];

  const isDateTimeDisabled = (selectedDate) => {
    return disabledDateTimes.some(disabledDateTime =>
      selectedDate.getFullYear() === disabledDateTime.getFullYear() &&
      selectedDate.getMonth() === disabledDateTime.getMonth() &&
      selectedDate.getDate() === disabledDateTime.getDate() &&
      selectedDate.getHours() === disabledDateTime.getHours() &&
      selectedDate.getMinutes() === disabledDateTime.getMinutes()
    );
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setIsDisabled(isDateTimeDisabled(newDate));
    setReservationDetails(prevDetails => ({
      ...prevDetails,
      date: newDate,
      hour: newDate.getHours(),
      min: newDate.getMinutes()
    }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const car = Cookies.get("carselected");
    const userId = 'exampleUserId'; // Replace with actual user ID
    const statId = 'exampleStationId'; // Replace with actual station ID

    const reservationData = {
      carId: car,
      user: userId,
      station: statId,  // Assuming statId holds the selected station ID
      carSize: reservationDetails.carSize,
      typeLavage: reservationDetails.typeLavage,
      day: reservationDetails.date.getDate(),
      month: reservationDetails.date.toLocaleString('default', { month: 'long' }),
      year: reservationDetails.date.getFullYear(),
      hour: reservationDetails.hour,
      min: reservationDetails.min
    };

    console.log("Reservation data to send:", reservationData); // Log reservation data

    try {
      const response = await fetch("http://localhost:8000/reservation/reserv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response text for more information
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Reservation created:", responseData);

      // Reset reservation form
      setReservationDetails({
        carSize: '',
        typeLavage: '',
        date: new Date(),
        hour: '',
        min: ''
      });

      alert("Reservation created successfully!");
      // Assuming socket is available
      // socket.emit('sendNotification2', {
      //   message: 'reservation',
      //   stationId: statId  // Emit the station ID along with the notification
      // });
      // console.log("Sending notification to station:", statId);

    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("Error creating reservation: " + error.message);
    }
  };

  return (
    <div>
      <h1>Reservation Calendar</h1>
      <DateTimePicker
        onChange={handleDateChange}
        value={date}
        disableClock={false}
        format="y-MM-dd h:mm a"
        clearIcon={null}
        disableCalendar={false}
      />
      {isDisabled ? (
        <p style={{ color: 'red' }}>This time slot is unavailable</p>
      ) : (
        <p>Selected date and time: {date.toString()}</p>
      )}
      <form onSubmit={handleReservationSubmit}>
        <input
          type="text"
          placeholder="Car Size"
          value={reservationDetails.carSize}
          onChange={(e) => setReservationDetails(prevDetails => ({ ...prevDetails, carSize: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Type of Lavage"
          value={reservationDetails.typeLavage}
          onChange={(e) => setReservationDetails(prevDetails => ({ ...prevDetails, typeLavage: e.target.value }))}
        />
        <button type="submit" disabled={isDisabled}>Submit Reservation</button>
      </form>
    </div>
  );
};

export default ReservationCalendar;
