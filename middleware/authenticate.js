const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to authenticate requests using JWT
const authenticate = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader =
        req.headers["authorization"] || req.headers["Authorization"];
    console.log("Request headers:", req.headers);

    // Check if token is present
    if (!authHeader) {
        return res.status(403).json({
            message: "No token provided. Unauthorized access denied.",
            ver: false,
        });
    }

    // Extract the token from the "Bearer" format
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7, authHeader.length)
        : null;

    // console.log(token);
    
    if (!token) {
        return res.status(403).json({
            message: "Invalid token format. Unauthorized access denied.",
            ver: false,
        });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.TOKEN);
        req.user = decoded; // Attach decoded payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({
            message: "Access denied. Invalid or expired token.",
            ver: false,
        });
    }
};

module.exports = authenticate;
