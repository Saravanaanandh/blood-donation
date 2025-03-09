import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.jsx";

export const useDonorStore = create((set,get)=>({

    isCreatingDonor:false,
    isDonorFetching:false,
    isDonorLoading:false,
    singleDonor:{},
    donors:[],
    requestSent:[],


    createDonor:async(data)=>{
        set({isCreatingDonor:true})
        try{
            const res = await axiosInstance.post('/donate/',data)
            set({donors:[...get().donors, res.data]})
            toast.success("thanks donor!")
        }catch(err){ 
            toast.error(err.response.data.message)
        }finally{
            set({isCreatingDonor:false})
        }
    },
    allDonors:async()=>{
        set({isDonorFetching:true})
        try{
            const res = await axiosInstance.get('/donate/') 
            const socket = useAuthStore.getState().socket
            socket.off("allDonors")
            socket.off("updateProfile")
            socket.on("updateProfile",async(updatedDetail)=>{
                const authUser = useAuthStore.getState().authUser 
                if(authUser._id === updatedDetail._id){
                    set({authUser:updatedDetail}) 
                } 
                await axiosInstance.get('/donate/') 
            })  
            socket.on("allDonors",(donorsInfo)=>{
                // const donors = [donors] 
                const donorList = donorsInfo.donors.map((donor, index) => ({
                    donor,
                    donorDetail: donorsInfo.donorDetails[index],
                    requestDetail:donorsInfo.requestDetails[index]
                }));
                set({donors:donorList})  
            })
        }catch(err){
            console.log(err.response.data.message)
        }finally{
            set({isDonorFetching:false}) 
        }
    },
    UnsubscribeToAlldonors:()=>{
        const socket = useAuthStore.getState().socket
        socket.off("allDonors")
    },
    getDonor:async(id)=>{
        set({isDonorLoading:true})
        try{
            const res = await axiosInstance.get(`/donate/${id}`) 
            const socket = useAuthStore.getState().socket
            socket.off("updateProfile")
            socket.off("getDonor")
            socket.on("getDonor",(data)=>{
                set({singleDonor:data})  
            })
            socket.on("updateProfile",async(updatedDetail)=>{
                const authUser = useAuthStore.getState().authUser 
                if(authUser._id === updatedDetail._id){
                    set({authUser:updatedDetail}) 
                } 
                await axiosInstance.get(`/donate/${id}`) 
            })  
        }catch(err){
            console.log(err.response.data.message)
        }finally{
            set({isDonorLoading:false})
        }
    },
}))