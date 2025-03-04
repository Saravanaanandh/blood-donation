import nodemailer from 'nodemailer'
import OTP from '../model/OTP.js'
import bcrypt from 'bcryptjs'
import User from './../model/User.js'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_ACCOUNT,
        pass:process.env.PASSWORD,
    }
})
function get90thDayFromDate(date) {
    let givenDate = new Date(date); 
    givenDate.setDate(givenDate.getDate() + 90);  
    return givenDate.toISOString().split('T')[0];  
}
export const sendOTP = async(req, res)=>{
    const {_id:userId} = req.user
    const {email} = req.body
    const generatedOTP = `${Math.floor(100000 + Math.random()*900000)}`
    console.log("otp : "+generatedOTP)
    try{
        const mailOptions = {
            from:process.env.USER_ACCOUNT,
            to:email,
            subject:"verify with OTP",
            html:`<div><h1>Gces Blood Line</h1><p>Your OTP is: ${generatedOTP}. It is valid for 5 minutes.</p></div>`,
            // text: `Your OTP is: ${generatedOTP}. It is valid for 5 minutes.`
        }
        await transporter.sendMail(mailOptions)

        const salt = await bcrypt.genSalt(10)
        const hashedOtp = await bcrypt.hash(generatedOTP, salt)
        console.log(hashedOtp)
        const otp = await OTP.create({
            userId:userId,
            otp:hashedOtp,
            createdAt:Date.now(),
            expiresAt:Date.now()+300000
        })
        console.log(otp)
        res.status(200).json({
            otp,
            status:"pending",
            message:"verify otp sent to your email"
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message:"Please try again later",
            error:err
        })
        console.log(err)
    }
}

export const verifyOTP = async(req, res)=>{
    const {_id:userId} = req.user
    const {otp} = req.body

    if(!userId) return res.status(401).json({message: "Unauthorized User"})
    if(!otp) return res.status(400).json({message: "please enter otp"})
    try{
        const users = await OTP.find({userId}).sort('-createdAt')
        if(users.length<=0) {return res.status(400).json({message:"please send otp and verify !"})}
        else{
            console.log(users)
            const expires = users[0].expiresAt
            if(Date.now() < expires){
                const isVerified = await bcrypt.compare(otp, users[0].otp)
                if(isVerified){
                    const lastDonationDate = new Date(Date.now()).toISOString().split('T')[0];
                    const nextDonationDate = get90thDayFromDate(lastDonationDate);
                    console.log(lastDonationDate)
                    console.log(nextDonationDate)
                    const user = await User.findOneAndUpdate({_id:userId}, {$inc :{donation: 1},available:false,lastDonated:lastDonationDate,nextDonationDate:nextDonationDate},{new: true, runValidators: true})
                    res.status(200).json({
                        status:"VERIFIED",
                        message:"otp verified"
                    })
                    console.log(user)
                    console.log("otp verified")
                    await OTP.deleteMany({userId})
                }else{
                    res.status(200).json({
                        status:"PENDING",
                        message:"otp Incorrect"
                    })
                    console.log("otp is not match please enter valid otp")
                } 
            }else{
                res.status(200).json({
                    status:"EXPIRED",
                    message:"otp expired"
                })
                await OTP.deleteMany({userId})
                console.log("otp expired")
            } 
        }
    }catch(err){
        console.log(err)
    }
}