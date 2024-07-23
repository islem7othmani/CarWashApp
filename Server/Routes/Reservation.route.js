const { reserv,getReservationsByStation,deleteReservation,getReservationsById,getReservationsByUserId } = require("../Controllers/Reservation.controller")
const authenticateUser = require('../MiddleWares/AuthUser');  

const route = require ("express").Router();


route.post('/reserv', reserv);
route.get('/reservations/:station', getReservationsByStation);
route.get('/reservationById/:id', getReservationsById);
route.get('/reservationByUser/:id', getReservationsByUserId);
route.delete('/delete/:id', deleteReservation);

module.exports = route;