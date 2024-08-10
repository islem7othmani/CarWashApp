const { register, login, verifyEmail, forgotPassword, resetPassword, getUser, getUserById,updateUserStatus } = require("../Controllers/User.controller");
//const { isAdmin } = require('../MiddleWares/isAdmin');  

const route = require("express").Router();
  
route.post("/register", register);
route.post("/login", login);
route.post("/verified/:activationCode", verifyEmail);
route.post("/forgetpassword", forgotPassword);
route.post("/resetpassword", resetPassword);
route.get("/User/:email", getUser);
route.get("/userId/:id", getUserById);
route.put("/updateuser/:id", updateUserStatus);
//route.get("/admin", isAdmin);

module.exports = route;
