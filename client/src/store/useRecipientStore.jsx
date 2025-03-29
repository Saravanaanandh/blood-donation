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

    allRequests: async () => {
        set({ isRequestsFetching: true });
        try {
            const socket = useAuthStore.getState().socket;
            
            // Unsubscribe before adding new listeners
            ["newRequest", "allRequests", "acceptRequest", "confirmedRequest", "rejectRequest", "completedRequest"]
                .forEach(event => socket.off(event));
    
            const res = await axiosInstance.get('/request/');
            
            socket.on("allRequests", (requestDetail) => { 
                const recipients = requestDetail.requests.map((request, index) => ({
                    request,
                    requestDetail: res.data.requestDetails[index],
                    recipientProfile: res.data.recipientProfile[index]
                }));
    
                set({ 
                    recipients: recipients,
                    requests: requestDetail.requests // Keep the request state updated
                });  
            });
    
            ["newRequest", "acceptRequest", "confirmedRequest", "rejectRequest", "completedRequest"].forEach(event => {
                socket.on(event, async () => {
                    const updatedRes = await axiosInstance.get('/request/');
                    set({ requests: updatedRes.data });
                    location.reload()
                });
            });
    
        } catch (err) {
            console.log(err.response?.data?.message || err);
        } finally {
            set({ isRequestsFetching: false });
        }
    },
    
    getRequest: async (id) => {
        set({ isRequestLoading: true });
        try {
            const socket = useAuthStore.getState().socket;
    
            ["acceptRequest", "confirmedRequest", "rejectRequest", "completedRequest", "updateProfile", "getRequest"]
                .forEach(event => socket.off(event));
    
            const res = await axiosInstance.get(`/request/${id}`);
    
            socket.on("updateProfile", async (updatedDetail) => {
                const authUser = useAuthStore.getState().authUser;
                if (authUser._id === updatedDetail._id) {
                    set({ authUser: updatedDetail });
                }
                await axiosInstance.get(`/request/${id}`);
            });
    
            ["newRequest", "acceptRequest", "confirmedRequest", "rejectRequest", "completedRequest"].forEach(event => {
                socket.on(event, async () => {
                    const updatedRes = await axiosInstance.get(`/request/${id}`);
                    set({ singleRecipient: updatedRes.data });
                });
            });
    
            socket.on("getRequest", (data) => { 
                set({ singleRecipient: data });  
            });
    
        } catch (err) {
            console.log(err);
        } finally {
            set({ isRequestLoading: false });
        }
    },
    
    sendRequest: async (donorId) => {
        set({ isSendRequest: true });
        try {
            const socket = useAuthStore.getState().socket;
            socket.off("newRequest");
            const res = await axiosInstance.post(`/request/${donorId}`);
    
            socket.on("newRequest", async (request) => { 
                set({ requests: [...get().requests, request]})
                toast.success("Request sent Successfully!")
            });
    
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong, try again later!");
        } finally {
            set({ isSendRequest: false });
        }
    },
    
    UnsubscribeToGetRequest: () => {
        const socket = useAuthStore.getState().socket;
        ["acceptRequest", "rejectRequest", "confirmedRequest", "completedRequest"].forEach(event => socket.off(event));
    },
    
    UnsubscribeTogetAllRequest: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newRequest");
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
            const socket = useAuthStore.getState().socket
            socket.off("completedRequest")
            const res = await axiosInstance.post('/otp/verifyotp',data)
            socket.on("completedRequest",(otpDetails)=>{  
                set({isOtpVerified:false})
                if(otpDetails.status === "VERIFIED"){
                    set({isOtpVerified:true}) 
                    toast.success("otp verified") 
                }else if(otpDetails.status === "PENDING"){
                    set({isOtpVerified:false})  
                    toast.error("otp Incorrect") 
                }else{
                    set({isOtpVerified:false})
                    set({OtpDetail:null}) 
                    toast.error("otp Expired! Send again!") 
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