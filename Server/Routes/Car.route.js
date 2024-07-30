const { addCar, getCar,getCarByUser, deleteCar, updateCar, upload } = require("../Controllers/Car.controller")
const authenticateUser = require('../MiddleWares/AuthUser');  
const multer = require('multer');
const route = require ("express").Router();



route.post('/addCar', authenticateUser,upload.single('image'), addCar);
route.get('/getcar/:id', getCar);
route.get('/getcarByUser/:id', getCarByUser);
route.delete('/deleteCar/:id',authenticateUser, deleteCar);
route.post('/updateCar/:id',authenticateUser,upload.single('image'), updateCar);

module.exports = route;