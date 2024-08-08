const Payment = require('../Models/Payment'); 

// Add a new payment
const addPayment = async (req, res) => {
    try {
        const { amount, date, user } = req.body;

        // Create a new payment
        const newPayment = new Payment({
            amount,
            date,
            user
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

const getPayments = async (req, res) => {
    try {
        // Aggregate payments with user details
        const payments = await Payment.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { 
                $unwind: "$userDetails" // Don't use preserveNullAndEmptyArrays for testing
            }
        ]);
        console.log(payments);

        res.status(200).json(payments); 
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
