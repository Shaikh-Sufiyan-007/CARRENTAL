import express from 'express'
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability } from '../controllers/owner.controller.js'
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router()

router.post('/change-role', protect, changeRoleToOwner)
router.post('/add-car', upload.single('image'), protect, addCar)
router.get('/cars', protect, getOwnerCars)
router.post('/toggle-car', protect, toggleCarAvailability)
router.post('/delete-car', protect, deleteCar)
router.get('/dashboard', protect, getDashboardData)

export default router;