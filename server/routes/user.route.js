import express from 'express'
import { getCars, getUserData, registeredUser, userLogin } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registeredUser)
router.post('/login', userLogin)
router.get('/data', protect, getUserData)
router.get('/cars', getCars)

export default router

