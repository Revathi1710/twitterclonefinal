import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        // Correct: cookies → req.cookies
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Fetch user (without password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        console.error(`protectRoute middleware error:`, error.message);

        // JWT expiration or invalid token error handling
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;
