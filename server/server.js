import dotenv from 'dotenv'
import express from 'express'
import {connectDB} from './config/dbConn.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import bloodReqRouter from './routes/reqBlood.route.js'
import donorRouter from './routes/donor.route.js'
import otpRouter from './routes/otp.route.js'
import recipientRouter from './routes/recipient.route.js'
import { verifyJWT } from './middleware/auth.middleware.js'
import cors from 'cors'
import path from 'path'
import {app, server} from './config/socket.js'

dotenv.config() 
const PORT = process.env.PORT || 5000

app.use(cors({
    origin:["http://192.168.47.231:5173","http://192.168.143.231:5173","https://blood-donation-o7z9.onrender.com","http://localhost:5173","https://bloodline.gces1.duckdns.org"], 
    methods: "GET,POST,PATCH,PUT,DELETE",
    allowedHeaders: ["Content-Type"],
    credentials:true
}))

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true })); 
app.use(cookieParser())

const __dirname = path.resolve()
 
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/request',verifyJWT,bloodReqRouter)
app.use('/api/v1/recipient',verifyJWT,recipientRouter)
app.use('/api/v1/donate',verifyJWT,donorRouter)
app.use('/api/v1/otp',verifyJWT, otpRouter)


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'./../client/dist')))

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,"../client","dist","index.html"))
    })
}
server.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`)
    connectDB()
})