// routes/Station.route.js
const express = require('express');
const { StationInformations, updateStation, getStation } = require('../Controllers/Station.controller');
const authenticateUser = require('../MiddleWares/AuthUser');  
 
//const check = require('../MiddleWares/isAdmin');

const route = require ("express").Router();
 

route.post('/informations',authenticateUser, StationInformations);
route.post('/updateInformations/:id',authenticateUser, updateStation);
route.get('/getInformations/:id', getStation);

module.exports = route;
