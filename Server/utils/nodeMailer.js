const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: { 
		user: "islemothmani159@gmail.com", 
		pass: "dbvmnxnxxkoghehi",
	},
});
module.exports.sendConfirmationEmail = (email, activationCode) => {
	transporter.sendMail({
		from: "islemothmani159@gmail.com",
		to: email,
		subject: "Confirm your account",
		html: `<h1>Confirmation Email</h1>
		<p>Hello,</p>
		<p>To verify your account, click on this URL:</p>
		<a href="http://localhost:3000/confirm/${activationCode}">Click here</a>`
	}).catch((err) => console.log(err));
};


module.exports.sendForgetPWEmail = (email, activationCode) => {
	transporter.sendMail({
		from: "islemothmani159@gmail.com",
		to: email,
		subject: "Forger Password",
		html: `<h1>Reset Password Email</h1>
		<p>Hello,</p>
		<p>To change your password, click on this URL:</p>
		<a href="http://localhost:3000/reset/${activationCode}">Click here</a>`
	}).catch((err) => console.log(err));
};
