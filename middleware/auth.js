const isAuthenticated = (req, res, next) => {
    // Check if the user exists in the session
    if (req.session.user === undefined) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized. Please log in using GitHub to access this route." 
        });
    }
    next();
};

module.exports = { isAuthenticated };