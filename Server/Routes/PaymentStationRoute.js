const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/PaymentStation');

// Route to add a new payment
router.post('/addpaymentstation', paymentController.addPayment);

// Route to get all payments
router.get('/paymentsstation', paymentController.getPayments);

module.exports = router;
