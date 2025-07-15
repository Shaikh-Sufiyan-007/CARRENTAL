import express from 'express'
import { changeRoleToOwner } from '../controllers/owner.controller.js'
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/change-role', protect, changeRoleToOwner)

export default router;