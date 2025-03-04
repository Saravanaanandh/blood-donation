
import Requests from '../model/DonorRecipient.js'
import User from '../model/User.js'
import ReqBlood from './../model/ReqBlood.js'

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
        res.status(200).json(request)
    }catch(err){
        if(err.name === "CastError"){
            return res.status(400).json({message:"please provide the valid recipient id"})
        }
        res.status(404).json({message:err.name})
    }
}

