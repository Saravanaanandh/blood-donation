
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    donorId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    recipientId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String, 
        enum:["accepted","rejected","pending","confirmed","finalState"],
        default:"pending", 
    }
},{timestamps:true})

const Requests = mongoose.model('Requests',requestSchema)
export default Requests