// routes/Station.route.js
const express = require('express');
const { StationInformations, updateStation, getStation, getStationsByCity,getStationsByGerent, getStationsByEmail } = require('../Controllers/Station.controller');
const authenticateUser = require('../MiddleWares/AuthUser');  
 
//const check = require('../MiddleWares/isAdmin');

const route = require ("express").Router();
 

route.post('/informations',authenticateUser, StationInformations);
route.post('/updateInformations/:id', updateStation);
route.get('/getInformations/:gerent', getStationsByGerent);
route.get('/getstation/:id', getStation);
route.get('/getstations/:city', getStationsByCity);
route.get('/getstationsByEmail/:email', getStationsByEmail);



module.exports = route;
