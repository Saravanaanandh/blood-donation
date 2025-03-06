import Requests from '../model/DonorRecipient.js'
import Donor from './../model/Donar.js'
import User from './../model/User.js'
import {io} from './../config/socket.js'
export const getAllDonars = async(req, res)=>{
    const {_id:userId} = req.user 

    if(!userId) return res.status(401).json({message:"unauthorized user"}) 
    const donors = await Donor.find({donorId :{$ne: userId, $exists: true},available:true}) 
    if(!donors) return res.status(200).json() 
        
    const donorDetails = await Promise.all(
        donors.map(donor => User.findOne({ _id: donor.donorId }).select('-password'))
    );
    const requestDetails = await Promise.all(
        donors.map(donor => Requests.findOne({donorId:donor.donorId}))
    );  
    io.emit("allDonors",{donors,requestDetails,donorDetails,count:donors.length})
    res.status(200).json({donors,requestDetails,donorDetails,count:donors.length})
}

export const getDonar = async (req, res)=>{
    const {_id:userId} = req.user 
    const {id:donorId} = req.params

    if(!userId || !donorId) return res.status(400).json({message:"unauthorized user"})
    if(!donorId) return res.status(400).json({message:"donar id not valid"})
    
    try{
        const donor = await Donor.findOne({donorId})
        const requestDetail = await Requests.findOne({donorId})
        const donorDetail = await User.findOne({_id:donorId})

        if(!donor) return res.status(200).json({message:"donar not found"})
        io.emit("getDonor",{donor,donorDetail,requestDetail})
        res.status(200).json({donor,donorDetail,requestDetail}) 
    }catch(err){
        if(err.name === "CastError"){
            res.status(400).json({message:"ObjectId not valid"}) 
        }else{
            res.status(400).json({message:err.message})  
        }
    } 
}

export const createDonor = async (req, res)=>{
    const {_id:donorId} = req.user 
    if(!donorId) return res.status(401).json({message:"unauthorized user"})

    try{
        const existingDonor = await Donor.findOne({donorId})
        if(existingDonor){
            const updatedDonor = await Donor.findOneAndUpdate({donorId},{...req.body})
            res.status(201).json(updatedDonor) 
        }else{
            const donor = await Donor.create({...req.body,donorId}) 
            res.status(201).json(donor)  
        }
    }catch(err){
        if(err.name === "ValidationError"){
            return res.status(400).json({message:"please provide the valid details"})
        }
        res.status(500).json({message:err.name})
    }
}