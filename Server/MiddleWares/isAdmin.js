// MiddleWares/isAdmin.js

const jwt = require('jsonwebtoken');
const User = require('../Models/User.model'); // Adjust the path as necessary

module.exports.isAdmin = async (req, res, next) => {
    try {
        // Check if the authorization header is present
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token missing or invalid' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Token verification failed' });
        }

        // Find the user by ID from the token
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden: Admins only' });
        }

        // Attach user to request object and call next middleware
        req.user = user;
        next();

    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
