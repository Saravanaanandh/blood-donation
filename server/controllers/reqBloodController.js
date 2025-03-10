
import Requests from '../model/DonorRecipient.js'
import User from '../model/User.js'
import ReqBlood from './../model/ReqBlood.js'
import {io, getUserId} from './../config/socket.js'
import nodemailer from 'nodemailer'
export const createRecipients = async (req, res)=>{
    const {_id:recipientId} = req.user

    if(!recipientId) return res.status(401).json({message:"unauthorized user"})

    try{
        const existingRecipient = await ReqBlood.findOne({recipientId})
        if(existingRecipient){
            const updatedRecipient = await ReqBlood.findOneAndUpdate({recipientId},{...req.body})
            res.status(201).json(updatedRecipient) 
        }else{
            const recipient = await ReqBlood.create({...req.body,recipientId})
            const user = await User.findByIdAndUpdate(recipientId,{recipientId:recipientId}) 
            res.status(201).json(recipient)  
        }
    }catch(err){
        if(err.name === "ValidationError"){
            return res.status(400).json({message:"please provide the valid details"})
        }
        res.status(500).json({message:err.name})
    }
}

export const sendRequest = async(req, res)=>{
    const {_id:recipientId} = req.user
    const {id:donorId} = req.params 
    try{
        const request = await Requests.create({recipientId, donorId})
        const donorSocketId = getUserId(donorId)
        const recipient = await User.findOne({_id:recipientId})
        const recipientDetail = await ReqBlood.findOne({recipientId})
        const donor = await User.findOne({_id:donorId})
        if(donorSocketId){
            io.to(donorSocketId).emit("newRequest",{request})
        }
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.USER_ACCOUNT,
                pass:process.env.PASSWORD,
            }
        })
        const mailOptions = {
    from: process.env.USER_ACCOUNT,
    to: donor.email,
    subject:`🩸 Urgent Blood Donation Request from ${recipient.username}`,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
             <h1 style="color: #d32f2f; text-align: center;">🩸 GCES Blood Line</h1>
             <p>Hello <strong>${donor.username}</strong>,</p>
             <p>You have received a <strong>Blood Donation Request</strong> from <strong>${recipient.username}</strong>.</p>
             <p><strong>Your small act of kindness can save a precious life! 💖</strong></p>
             <p style="display:flex; flex-direction:column; gap:10px;"><strong>Additional Message from Requester :</strong><span>${recipientDetail.note}</span></p>
             <p style="text-align: center; margin-top: 20px;">
               <a href="https://blood-donation-o7z9.onrender.com/" 
                  style="background-color: #d32f2f; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Request
               </a>
             </p>
             <p>Thank you for being a Life-Saver! 💉🩸</p>
           </div>`,
    text: `Hello ${donor.username},\n\nYou have received a Blood Donation Request from ${recipient.username}. 
    Your contribution can save a precious life.\n\n
    Please check the request here: https://blood-donation-o7z9.onrender.com/\n\n
    Thank you for your kindness.💉🩸`
}
        await transporter.sendMail(mailOptions)
        res.status(200).json(request)
    }catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({message:"please provide the valid recipient id"})
        }
        res.status(404).json({message:err.name})
    }
}


export const getAllRequests = async (req, res)=>{
    const {_id:donorId} = req.user

    const requests = await Requests.find({donorId})
    if(!requests) return res.status(200).json({message:"no requests"}) 
    
    const requestDetails = await Promise.all(
        requests.map(request => ReqBlood.findOne({recipientId:request.recipientId}))
    ); 
    const recipientProfile = await Promise.all(
        requests.map(request => User.findOne({_id:request.recipientId}))
    );
    io.emit("allRequests",{requests,requestDetails,recipientProfile,count:requests.length})   
    res.status(200).json({requests,requestDetails,recipientProfile,count:requests.length})
}

export const getRequest = async (req, res)=>{
    const {_id:donorId} = req.user
    const {id:recipientId} = req.params
    if(!recipientId) return res.status(400).json({message:"no recipient selected"})

    try{
        const requestDetail = await Requests.findOne({recipientId,donorId})
        const recipient = await ReqBlood.findOne({recipientId})
        if(!recipient) return res.status(404).json({message:"recipient not found"}) 
        const recipientProfile = await User.findOne({_id:recipientId})
        io.emit("getRequest",{recipient,requestDetail,recipientProfile})
        res.status(200).json({recipient,requestDetail,recipientProfile}) 
    }catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({message:"please provide the valid recipient id"})
        }
        res.status(404).json({message:err.name})
    }
}

export const acceptReq = async (req, res)=>{
    const {_id:donorId} = req.user
    const {id:recipientId} = req.params

    try{
        const request = await Requests.findOneAndUpdate({donorId, recipientId},{status:"accepted"},{new:true})
        if(!request) return res.status(404).json({message:"request not found"})
            
        const recipientSocketId = getUserId(recipientId)
        if(recipientSocketId){
            io.to(recipientSocketId).emit("acceptRequest",{request})
        }
        res.status(200).json(request)
    }catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({message:"please provide the valid recipient id"})
        }
        res.status(404).json({message:err.name})
    }
}

export const confirmReq = async (req, res)=>{
    const {_id:recipientId} = req.user
    const {id:donorId} = req.params

    try{
        const request = await Requests.findOneAndUpdate({donorId, recipientId},{status:"confirmed"},{new:true}) 
        if(!request) return res.status(404).json({message:"request not found"})  

        const donorSocketId = getUserId(donorId)
        if(donorSocketId){
            io.to(donorSocketId).emit("confirmedRequest",{request})
        } 
        res.status(200).json(request)
    }catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({message:"please provide the valid recipient id"})
        }
        res.status(404).json({message:err.name})
    }
}

export const rejectReq = async (req, res)=>{
    const {_id:donorId} = req.user
    const {id:recipientId} = req.params

    try{
        const request = await Requests.findOneAndUpdate({donorId, recipientId},{status:"rejected"},{new:true})
        if(!request) return res.status(404).json({message:"request not found"})
        
        const recipientSocketId = getUserId(recipientId)
        const donorSocketId = getUserId(donorId)
        if(recipientSocketId || donorSocketId){
            io.to(recipientSocketId,donorSocketId).emit("rejectRequest",{request})
        } 
        res.status(200).json(request)
    }catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({message:"please provide the valid recipient id"})
        }
        res.status(404).json({message:err.name})
    }
}

