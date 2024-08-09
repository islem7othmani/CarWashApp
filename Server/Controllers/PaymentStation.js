const PaymentStation = require('../Models/PaymentStation'); 

// Add a new payment
const addPayment = async (req, res) => {
    try {
        const { amount, date, station, cardNumber, exp, cvv, name } = req.body;

        // Create a new payment
        const newPayment = new PaymentStation({
            name,
            cardNumber,
            exp,
            cvv,
            amount,
            date,
            station
        });

        // Save the payment to the database
        await newPayment.save();

        res.status(201).json({
            message: "Payment added successfully",
            payment: newPayment
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding payment",
            error: error.message
        });
    }
};

// Get all payments
const getPayments = async (req, res) => {
    try {
        // Log the collections' contents to verify data
        const paymentStations = await PaymentStation.find({});
        console.log('PaymentStations:', paymentStations);

        // Aggregate payments with station details
        const paymentstation = await PaymentStation.aggregate([
            {
                $lookup: {
                    from: "stations", // Ensure this is the correct collection name
                    localField: "station",
                    foreignField: "_id",
                    as: "stations",
                },
            }
        ]);

        console.log('Aggregated Payments:', paymentstation);

        res.status(200).json(paymentstation); 
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving payments",
            error: error.message,
        });
    }
};

module.exports = {
    addPayment,
    getPayments
};
