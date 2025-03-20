import express from 'express'
import { sendMailToDonor, sendOTP, verifyOTP } from '../controllers/OTPController.js'

const router = express.Router()

router.post('/',sendOTP)
router.post('/verifyotp',verifyOTP)
router.post('/mailtodonor',sendMailToDonor)

export default router