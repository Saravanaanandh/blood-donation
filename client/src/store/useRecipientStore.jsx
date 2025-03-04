import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast"; 
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore.jsx";
import { use } from "react";

export const useRecipientStore = create((set,get)=>({
     
    recipients:[],
    requests:[],
    recipientIds:[],
    singleRecipient:{},
    isRequestsFetching:false,
    isSingleRequestFetching:false,
    isSendRequest:false,
    isAcceptReq:false,
    isRejectRequest:false,
    OtpDetail:null, 
    setOtpDetail:(data)=>{
        set({OtpDetail:data})
    },
    isSendingOtp:false,
    isVerifyOtp:false,
    isOtpVerified:false,

    createRecipient:async(data)=>{
        set({isCreatingRecipient:true})
        try{
            const res = await axiosInstance.post('/request/',data) 
            console.log(res.data)
            set({recipientIds:[...get().recipientIds, res.data.recipientId]})
            console.log(get().recipientIds)
            toast.success("Recipient Created successfully!")
        }catch(err){
            console.log(err.response.data.message)
            toast.error(err.name)
        }finally{
            set({isCreatingRecipient:false})
        }
    },

    allRequests:async()=>{
        set({isRequestsFetching:true})
        try{
            const res = await axiosInstance.get('/request/')   
            const recipients = res.data.requests.map((request, index) => ({
                request,
                requestDetail: res.data.requestDetails[index],
                recipientProfile:res.data.recipientProfile[index]
            }));
            set({recipients:recipients}) 
        }catch(err){
            console.log(err.response.data.message)
        }finally{
            set({isRequestsFetching:false}) 
        }
    },
    getRequest:async(id)=>{
        set({isRequestLoading:true})
        try{
            const res = await axiosInstance.get(`/request/${id}`) 
            set({singleRecipient:res.data}) 
            console.log(get().singleRecipient)
            const socket = useAuthStore.getState().socket
            socket.on("newRequest",(requestDetail)=>{
                console.log(requestDetail)
            })
        }catch(err){
            console.log(err.response.data.message)
        }finally{
            set({isRequestLoading:false})
        }
    }, 
    sendRequest:async(donorId)=>{
        set({isSendRequest:true})
        try{
            const res = await axiosInstance.post(`/request/${donorId}`) 
            set({requests:[...get().requests, res.data]})
            toast.success("Request sent Successfully !")
            const socket = useAuthStore.getState().socket
            socket.emit("sendRequest",res.data)

        }catch(err){
            console.log(err)
            toast.error("something went wrong, try again later !")
        }finally{
            set({isSendRequest:true})
        } 
    },
    acceptRequest:async(id)=>{
        set({isAcceptReq:true})
        try{ 
            await axiosInstance.put(`/request/${id}`) 
            toast.success("Request Accepted Successfully !")
        }catch(err){
            console.log(err.response.data.message)
            toast.error("something went wrong !")
        }finally{
            set({isAcceptReq:false})
        }
    },
    confirmRequest:async(id)=>{
        set({isAcceptReq:true})
        try{ 
            await axiosInstance.put(`/request/confirm/${id}`) 
            toast.success("Donor confirmed Successfully !")
        }catch(err){
            console.log(err.response.data.message)
            toast.error("something went wrong !")
        }finally{
            set({isAcceptReq:false})
        }
    },
    rejectRequest:async(id)=>{
        set({isRejectRequest:true})
        try{ 
            await axiosInstance.put(`/request/reject/${id}`) 
            toast.success("Request Rejected !")
        }catch(err){
            console.log(err.response.data.message)
            toast.error("something went wrong !")
        }finally{
            set({isRejectRequest:false})
        }
    },
    sendOtp:async(data)=>{
        set({isSendingOtp:true})
        try{
            const res = await axiosInstance.post('/otp/',data)
            console.log(res.data)
            set({OtpDetail:res.data})
            toast.success("OTP sent to the Email !")
        }catch(err){
            console.log(err)
            toast.error("something went wrong !")
        }finally{
            set({isSendingOtp:false})
        }
    },
    verifyOtp:async(data)=>{
        set({isVerifyOtp:true})
        try{
            console.log(data)
            const res = await axiosInstance.post('/otp/verifyotp',data)
            if(res.data.status === "VERIFIED"){
                set({isOtpVerified:true})
                console.log(res.data)
                toast.success("otp verified") 
            }else if(res.data.status === "EXPIRED"){
                set({isOtpVerified:false})
                set({OtpDetail:null})
                console.log(res.data)
                toast.error("otp Expired! Send again!") 
            }else{
                set({isOtpVerified:false}) 
                console.log(res.data)
                toast.error("otp Incorrect") 
            }
        }catch(err){
            set({isOtpVerified:false})
            console.log(err.response.data.message)
            toast.error("something went wrong !")
        }finally{
            set({isVerifyOtp:false})
        }
    },
}))