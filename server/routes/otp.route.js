import express from 'express'
import { sendOTP, verifyOTP } from '../controllers/OTPController.js'

const router = express.Router()

router.post('/',sendOTP)
router.post('/verifyotp',verifyOTP)

export default router