import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";

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
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
        }finally{
            set({isCreatingDonor:false})
        }
    },
    allDonors:async()=>{
        set({isDonorFetching:true})
        try{
            const res = await axiosInstance.get('/donate/')  
            const donorList = res.data.donors.map((donor, index) => ({
                donor,
                donorDetail: res.data.donorDetails[index],
                requestDetail:res.data.requestDetails[index]
            }));
            set({donors:donorList}) 
        }catch(err){
            console.log(err.response.data.message)
        }finally{
            set({isDonorFetching:false}) 
        }
    },
    getDonor:async(id)=>{
        set({isDonorLoading:true})
        try{
            const res = await axiosInstance.get(`/donate/${id}`)
            set({singleDonor:res.data}) 
        }catch(err){
            console.log(err.response.data.message)
        }finally{
            set({isDonorLoading:false})
        }
    },
}))