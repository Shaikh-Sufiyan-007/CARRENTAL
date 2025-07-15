import express from 'express'
import { addCar, changeRoleToOwner } from '../controllers/owner.controller.js'
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router()

router.post('/change-role', protect, changeRoleToOwner)
router.post('/add-car', upload.single('image'), protect, addCar)

export default router;