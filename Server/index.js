const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
 
const app = express();


/*
// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
*/
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your client application's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: 'Content-Type,Authorization',  // Specify which headers are allowed
};

app.use(cors(corsOptions));  // Use the CORS middleware with the defined options
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const io = new Server({
  cors:{
    origin: "http://localhost:3000"
  }
});

const userRoutes = require('./Routes/User.route');
app.use('/authentification', userRoutes);

const carRoutes = require('./Routes/Car.route');
app.use('/car', carRoutes);

const stationRoutes = require('./Routes/Station.route');
app.use('/station', stationRoutes);

const nbrcarsRoutes = require('./Routes/Nbrcars.route');
app.use('/nbrc', nbrcarsRoutes);

const reservationRoutes = require('./Routes/Reservation.route');
app.use('/reservation', reservationRoutes);

const paymentRoutes = require('./Routes/Payment.route');
app.use('/payment', paymentRoutes);

const paymentSRoutes = require('./Routes/PaymentStationRoute');
app.use('/paymentS', paymentSRoutes);

mongoose.connect("mongodb+srv://webcamp36:34rkG6lJTQrdzaVx@cluster0.5hmqsyi.mongodb.net/");
mongoose.connection.on("connected", () => {
  console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
  console.log("DB failed with err - ", err);
});

let users = {};


// Handle new connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendNotification2', (message) => {
    io.emit('receiveNotificationNavbar', message); //gerent get new reservation.
  });

  socket.on('sendNotification', (message) => {
    io.emit('receiveNotification', message); //user get new station
  });

  socket.on('sendNotification3', (message) => {
    io.emit('receiveNotification3', message); //user get new station
  });

  socket.on('sendReminder', (message) => {
    io.emit('getReminder', message); //reminder
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
io.listen(5000)


app.use(bodyParser.json());

  
const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
