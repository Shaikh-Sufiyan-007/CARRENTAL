import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.model.js";

// Generate JWT token
const GenerateToken = (userId) => {
    const payload = userId;    
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}

export const registeredUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        
        if(!name || !email || !password || password.length < 8) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = GenerateToken(user._id.toString());

        return res.status(201).json({ success: true, message: "User registered successfully", token });
        
    } catch (error) {
        console.log("Error in registeredUser", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password || password.length < 8) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = GenerateToken(user._id.toString());
        return res.status(200).json({ success: true, message: "User logged in successfully", token });
    } catch (error) {
        console.log("Error in userLogin", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getUserData = async (req, res) => {
    try {
        const {user} = req;
        res.status(200).json({ success: true, message: "User data fetched successfully", user });
    } catch (error) {
        console.log("Error in getUserData", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//Get All Cars for frontend

export const getCars = async(req, res) => {
    try {
        const cars = await Car.find({isAvaliable: true})
        res.status(200).json({ success: true, message: "Cars fetched successfully", cars });
    } catch (error) {
        console.log("Error in getCars", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}