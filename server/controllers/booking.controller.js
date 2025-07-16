import Booking from "../models/Booking.model.js"
import Car from "../models/Car.model.js";


// fuction to Check Availability of Car for the given Date
const checkAvalability = async(car, pickupDate, returnDate) => {
    const booking = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        pickupDate: {$gte: pickupDate},
    })

    return booking.length === 0;
}

//API to Check Availability of Cars for the given Date and location

export const checkAvailabilityOfCar = async(req, res) => {
    try {
        const {location, pickupDate, returnDate} = req.body;

        const cars = await Car.find({location, isAvaliable: true});

        const availableCarsPromises = cars.map(async(car) => {
            const isAvailable = await checkAvalability(car._id, pickupDate, returnDate);
            return {...car._doc, isAvaliable: isAvailable};
        })

        let availableCars = await Promise.all(availableCarsPromises)
        availableCars = availableCars.filter(car => car.isAvaliable === true);

        res.status(200).json({success: true, message: "Availability fetched successfully", availableCars});

    } catch (error) {
        console.log("Error in checkAvailabilityOfCar", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const createBooking = async(req, res) => {
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvalability(car, pickupDate, returnDate);
        if(!isAvailable) {
            return res.status(400).json({success: false, message: "Car is not available for the given date"});
        }

        const carData = await Car.findById(car);

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

        res.status(200).json({success: true, message: "Booking created successfully"});
    } catch (error) {
        console.log("Error in createBooking", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}