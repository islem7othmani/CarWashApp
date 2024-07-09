// routes/Station.route.js
const express = require('express');
const { StationInformations, updateStation, getStation, getStationsByCity } = require('../Controllers/Station.controller');
const authenticateUser = require('../MiddleWares/AuthUser');  
 
//const check = require('../MiddleWares/isAdmin');

const route = require ("express").Router();
 

route.post('/informations',authenticateUser, StationInformations);
route.post('/updateInformations/:id',authenticateUser, updateStation);
route.get('/getInformations/:id', getStation);
route.get('/getstations/:city', getStationsByCity);

module.exports = route;
