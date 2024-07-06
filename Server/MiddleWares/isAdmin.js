// middlewares/isAdmin.js
const check = (req, res, next) => {
    console.log("Verified User:", req.verifiedUser);

    if (req.verifiedUser) {
        console.log("Verified User:", req.verifiedUser);
        if (req.verifiedUser.isAdmin) {
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied, admin only.' });
        }
    } else {
        console.log("No verified user found in request.");
        return res.status(403).json({ message: 'Access denied, admin only.' });
    }
};

module.exports = check;
