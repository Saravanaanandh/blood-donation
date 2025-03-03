import nodemailer from 'nodemailer'
import OTP from '../model/OTP.js'
import bcrypt from 'bcryptjs'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_ACCOUNT,
        pass:process.env.PASSWORD,
    }
})

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
            expiresAt:Date.now()+30000
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
        if(users.length<=0) return res.status(400).json({message:"please send otp and verify !"})
        else{
            const expires = users[0].expiresAt
            if(Date.now() > expires){
                const isVerified = await bcrypt.compare(otp, users[0].otp)
                if(isVerified){
                    res.status(200).json({message:"otp verified"})
                    console.log("otp verified")
                    await OTP.deleteMany({userId})
                }else{
                    res.status(200).json({message:"otp incorrect"})
                    console.log("otp is not match please enter valid otp")
                } 
            }else{
                await OTP.deleteMany({userId})
                console.log("otp invalid")
            } 
        }
    }catch(err){
        console.log(err)
    }
}