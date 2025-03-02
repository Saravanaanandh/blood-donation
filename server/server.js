import dotenv from 'dotenv'
import express from 'express'
import {connectDB} from './config/dbConn.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import bloodReqRouter from './routes/reqBlood.route.js'
import donorRouter from './routes/donor.route.js'
import { verifyJWT } from './middleware/auth.middleware.js'
import cors from 'cors'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin:["http://127.0.0.1:5500","http://localhost:5173","http://192.168.190.231:5173/","http://192.168.190.231:5173"], 
    methods: "GET,POST,PATCH,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials:true
}))

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true })); 
app.use(cookieParser())

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'./../client/dist')))

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,"../client","dist","index.html"))
    })
}

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/request',verifyJWT,bloodReqRouter)
app.use('/api/v1/donate',verifyJWT,donorRouter)


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'./../client/dist')))

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,"../client","dist","index.html"))
    })
}
app.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`)
    connectDB()
})