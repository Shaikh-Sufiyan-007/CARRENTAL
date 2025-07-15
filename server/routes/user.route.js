import express from 'express'
import { getUserData, registeredUser, userLogin } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registeredUser)
router.post('/login', userLogin)
router.get('/data', protect, getUserData)

export default router

