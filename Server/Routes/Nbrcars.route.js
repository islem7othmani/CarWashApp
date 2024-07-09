// routes/Station.route.js
const express = require('express');
const { addNbCars, getNbr,getNbrByStation } = require('../Controllers/NbrCars.controller');
const authenticateUser = require('../MiddleWares/AuthUser');  
 
//const check = require('../MiddleWares/isAdmin');

const route = require ("express").Router();
 

route.post('/addNbrCars',authenticateUser, addNbCars);
route.get('/getnbr/:id', getNbr);
route.get('/getnbrByStation/:station', getNbrByStation);


module.exports = route;
