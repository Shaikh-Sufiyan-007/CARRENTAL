import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async(req, res, next) => {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET_KEY);
        if(!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        console.log("Error in protect middleware", error.message);
        return res.status(500).json({ success: false, message: "Not authorized" });
    }
}