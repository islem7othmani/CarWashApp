const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY);
        req.verifiedUser = verified;  
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;