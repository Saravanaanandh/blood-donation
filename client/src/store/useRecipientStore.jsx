import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";  
import { useAuthStore } from "./useAuthStore.jsx"; 

export const useRecipientStore = create((set,get)=>({
     
    recipients:[],
    requests:[],
    recipientId:null,
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
            set({recipientId: res.data}) 
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
            const socket = useAuthStore.getState().socket
            socket.off("newRequest")
            socket.off("allRequests")
            socket.off("acceptRequest")
            socket.off("confirmedRequest")
            socket.off("rejectRequest")
            socket.off("completedRequest")
            socket.on("allRequests",(requestDetail)=>{ 
                const recipients = requestDetail.requests.map((request, index) => ({
                    request,
                    requestDetail: res.data.requestDetails[index],
                    recipientProfile:res.data.recipientProfile[index]
                }));
                set({recipients:recipients}) 
            })
            socket.on("newRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get('/request/') 
            })
            socket.on("acceptRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get('/request/') 
            })
            socket.on("confirmedRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get('/request/') 
            })
            socket.on("rejectRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get('/request/') 
            })
            socket.on("completedRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get('/request/') 
            })
            
            // const recipients = res.data.requests.map((request, index) => ({
            //     request,
            //     requestDetail: res.data.requestDetails[index],
            //     recipientProfile:res.data.recipientProfile[index]
            // }));
            // set({recipients:recipients}) 
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
            const socket = useAuthStore.getState().socket 
            socket.off("acceptRequest")
            socket.off("confirmedRequest")
            socket.off("rejectRequest")
            socket.off("completedRequest") 
            socket.off("updateProfile")
            socket.off("getRequest")
            socket.on("getRequest",(data)=>{ 
                set({singleRecipient:data})  
            })
            socket.on("updateProfile",async(updatedDetail)=>{
                const authUser = useAuthStore.getState().authUser 
                if(authUser._id === updatedDetail._id){
                    set({authUser:updatedDetail}) 
                } 
                await axiosInstance.get(`/request/${id}`) 
            })   
            socket.on("newRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get(`/request/${id}`) 
            })
            socket.on("acceptRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get(`/request/${id}`) 
            })
            socket.on("confirmedRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get(`/request/${id}`) 
            })
            socket.on("rejectRequest",async(request)=>{ 
                if(request.donorId !== useAuthStore.getState().authUser._id | request.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get(`/request/${id}`) 
            })
            socket.on("completedRequest",async(requestDetail)=>{ 
                if(requestDetail.request?.donorId !== useAuthStore.getState().authUser._id & requestDetail.request?.recipientId !== useAuthStore.getState().authUser._id) return;
                await axiosInstance.get(`/request/${id}`) 
            })
            
        }catch(err){
            console.log(err) 
        }finally{
            set({isRequestLoading:false})
        }
    }, 
    UnsubscribeToGetRequest:()=>{
        const socket = useAuthStore.getState().socket
        socket.off("acceptRequest")
        socket.off("rejectRequest")
        socket.off("confirmedRequest")
        socket.off("completedRequest")
    },
    sendRequest:async(donorId)=>{
        set({isSendRequest:true})
        try{
            const res = await axiosInstance.post(`/request/${donorId}`)  
            const socket = useAuthStore.getState().socket
            socket.off("newRequest")
            socket.on("newRequest",(request)=>{ 
                set({requests:[...get().requests, request]})
                toast.success("Request sent Successfully !")
            })
            // const socket = useAuthStore.getState().socket
            // socket.emit("sendRequest",res.data)

        }catch(err){
            console.log(err)
            toast.error("something went wrong, try again later !")
        }finally{
            set({isSendRequest:true})
        } 
    },
    UnsubscribeTogetAllRequest:()=>{
        const socket = useAuthStore.getState().socket
        socket.off("newRequest")
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
            set({OtpDetail:res.data.otp})
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
            const res = await axiosInstance.post('/otp/verifyotp',data)
            const socket = useAuthStore.getState().socket
            socket.off("completedRequest")
            socket.on("completedRequest",(otpDetails)=>{  
                set({isOtpVerified:false})
                if(otpDetails.status === "VERIFIED"){
                    set({isOtpVerified:true}) 
                    toast.success("otp verified") 
                }else if(otpDetails.status === "EXPIRED"){
                    set({isOtpVerified:false})
                    set({OtpDetail:null}) 
                    toast.error("otp Expired! Send again!") 
                }else{
                    set({isOtpVerified:false})  
                    toast.error("otp Incorrect") 
                }
            })
        }catch(err){
            set({isOtpVerified:false})
            console.log(err.response.data.message)
            toast.error("something went wrong !")
        }finally{
            set({isVerifyOtp:false})
        }
    },
}))