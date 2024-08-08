const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/Payment.controller');

// Route to add a new payment
router.post('/addpayment', paymentController.addPayment);

// Route to get all payments
router.get('/payments', paymentController.getPayments);

module.exports = router;
