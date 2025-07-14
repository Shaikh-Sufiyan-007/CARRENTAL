import express from 'express'
import { registeredUser, userLogin } from '../controllers/user.controller.js'

const router = express.Router()

router.post('/register', registeredUser)
router.post('/login', userLogin)

export default router

