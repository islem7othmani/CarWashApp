const { addCar, getCar,getCarByUser, deleteCar, updateStory } = require("../Controllers/Car.controller")
const authenticateUser = require('../MiddleWares/AuthUser');  

const route = require ("express").Router();


route.post('/addCar', authenticateUser, addCar);
route.get('/getcar/:id', getCar);
route.get('/getcarByUser/:id', getCarByUser);
route.delete('/deleteCar/:id',authenticateUser, deleteCar);
route.post('/updateStory/:id',authenticateUser, updateStory);

module.exports = route;