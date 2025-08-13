import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.jsx'
import toast from 'react-hot-toast' 

// const BASE_URL = import.meta.env.MODE === "development"?"http://localhost:5000":"/"
export const useAuthStore = create((set,get)=>({

    authUser:null,
    users:[],  
    isSignUp:false,
    isLogin:false,
    isLogout:false,
    isCheckAuth:true,
    isUserLoading:false,
    isUserAsRecipient: false,
    isUserAsDonor: false,
    
    checkAuth:async()=>{ 
        try{
            const res = await axiosInstance.get('/auth/check-auth')
            const isRecipient = res.data.recipientId ? true : false
            const isDonor = res.data.donorId ? true : false 
            set({authUser:res.data, isUserAsDonor: isDonor, isUserAsRecipient:isRecipient})  
        }catch(err){
            console.log(err.response.data.message) 
            set({authUser:null})
        }finally{
            set({isCheckAuth:false})
        }
    },

    signup:async(data)=>{
        set({isSignUp:true})
        try{ 
            const res = await axiosInstance.post('/auth/signup',data)
            set({authUser:res.data})
            set({users:[...get().users, res.data]})
            toast.success("signed up successfully") 
        }catch(err){ 
            toast.error(err.response.data.message)
        }finally{
            set({isSignUp:false})
        }
    },
    login:async(data)=>{
        set({isLogin:true})
        try{
            const res = await axiosInstance.post('/auth/login',data)
            set({authUser:res.data})
            toast.success("logged in successfully!")  
        }catch(err){
            toast.error(err.response.data.message)
        }finally{
            set({isLogin:false})
        }
    },

    logout:async()=>{
        set({isLogout:true})
        try{
            await axiosInstance.delete('/auth/logout')
            set({authUser:null}) 
        }catch(err){
            toast.error(err.message)
        }finally{
            set({isLogout:false})
        }
    },
    updateProfile:async(data)=>{
        set({isProfileUpdating:true})
        try{ 
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({authUser:res.data})
            toast.success("profile updated")
        }catch(err){
            console.log(err)
            toast.error(err.response.data.message)
        }finally{
            set({isProfileUpdating:false})
        }
    }, 
    getUser:async()=>{
        set({isGetUser:true})
        try{
            const res = await axiosInstance.get('/auth/') 
            const isRecipient = res.data.recipientId ? true : false
            const isDonor = res.data.donorId ? true : false 
            set({authUser:res.data, isUserAsDonor: isDonor, isUserAsRecipient:isRecipient}) 
        }catch(err){
            console.log(err)
        }finally{
            set({isGetUser:false})
        }
    }
}))
