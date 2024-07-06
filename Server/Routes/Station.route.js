// routes/Station.route.js
const express = require('express');
const { StationInformations } = require('../Controllers/Station.controller');
const authenticateUser = require('../MiddleWares/AuthUser');  
 
//const check = require('../MiddleWares/isAdmin');

const route = require ("express").Router();
 

route.post('/informations',authenticateUser, StationInformations);

module.exports = route;
