const { reserv,getReservationsByStation,deleteReservation } = require("../Controllers/Reservation.controller")
const authenticateUser = require('../MiddleWares/AuthUser');  

const route = require ("express").Router();


route.post('/reserv', reserv);
route.get('/reservations/:station', getReservationsByStation);
route.get('/delete/:id', deleteReservation);

module.exports = route;