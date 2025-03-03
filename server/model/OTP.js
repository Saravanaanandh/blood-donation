import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    otp:String,
    createdAt:Date,
    expiresAt:Date
})

const OTP = mongoose.model('OTP',OTPSchema)
export default OTP