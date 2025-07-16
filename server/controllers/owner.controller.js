import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.model.js";
import User from "../models/User.model.js";
import fs from "fs";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(_id, { role: "owner" });
    res
      .status(200)
      .json({ success: true, message: "Now you can list cars", updatedUser });
  } catch (error) {
    console.log("Error in changeRoleToOwner", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API to List cars

export const addCar = async (req, res) => {
  try {
    const {_id} = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // For URL Generation, works for both images and videos
    var optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        {width: '1280'}, // width resizing
        {quality: 'auto'}, //Add compression
        {format: 'webp'} // convert to modern format
    ],
    });

    const image = optimizedImageURL;
    await Car.create({...car, owner: _id, image});

    res.status(201).json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.log("Error in addCar", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const {_id} = req.user;
    const cars = await Car.find({owner: _id})
    res.status(200).json({ success: true, message: "Cars fetched successfully", cars });
  } catch (error) {
    console.log("Error in getOwnerCars", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const toggleCarAvailability = async (req, res) => {
  try {
    const {_id} = req.user;
    const {carId} = req.body;
    const car = await Car.findById(carId);

    if(car.owner.toString() !== _id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized", car });
    }

    car.isAvaliable = !car.isAvaliable;
    await car.save();

    res.status(200).json({ success: true, message: "Car availability toggled successfully", car });
  } catch (error) {
    console.log("Error in toggleCarAvailability", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const deleteCar = async (req, res) => {
  try {
    const {_id} = req.user;
    const {carId} = req.body;
    const car = await Car.findById(carId);

    if(car.owner.toString() !== _id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized", car });
    }

    car.owner = null;
    car.isAvaliable = false;

    await car.save();

    res.status(200).json({ success: true, message: "Car deleted successfully", car });
  } catch (error) {
    console.log("Error in deleteCar", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const getDashboardData = async (req, res) => {
  try {
    const {_id, role} = req.user;

    if(role !== "owner") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({owner: _id})
  } catch (error) {
    console.log("Error in getDashboardData", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}