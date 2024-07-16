const { reserv } = require("../Controllers/Reservation.controller")
const authenticateUser = require('../MiddleWares/AuthUser');  

const route = require ("express").Router();


route.post('/reserv', reserv);

module.exports = route;