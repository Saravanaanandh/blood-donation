import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";

export const useRecipientStore = create((set,get)=>({

    recipients:[],
    requests:[],
    singleRecipient:{},
    isRequestsFetching:false,
    isSingleRequestFetching:false,
    isSendRequest:false,
    isAcceptReq:false,
    isRejectRequest:false,

    createRecipient:async(data)=>{
        set({isCreatingRecipient:true})
        try{
            await axiosInstance.post('/request/',data) 
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
            const recipient = res.data.requests.map((request, index) => ({
                request,
                requestDetail: res.data.requestDetails[index],
                recipientProfile:res.data.recipientProfile[index]
            }));
            set({recipients:recipient}) 
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
    }
}))