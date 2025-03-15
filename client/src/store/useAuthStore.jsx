import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.jsx'
import toast from 'react-hot-toast'
import {io} from 'socket.io-client' 

const BASE_URL = import.meta.env.MODE === "development"?"http://localhost:5000":"/"
export const useAuthStore = create((set,get)=>({

    authUser:null,
    users:[], 
    onlineUsers:[],
    socket:null,
    isSignUp:false,
    isLogin:false,
    isLogout:false,
    isCheckAuth:true,
    isUserLoading:false,
    
    checkAuth:async()=>{ 
        try{
            const res = await axiosInstance.get('/auth/check-auth')
            set({authUser:res?.data}) 
            get().connected()
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
            get().connected()
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
            get().connected()
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
            console.log(data)
            await axiosInstance.put('/auth/update-profile', data)
            const socket = useAuthStore.getState().socket
            socket.off("updateProfile")
            socket.on("updateProfile",(updatedDetail)=>{
                if(get().authUser._id === updatedDetail._id){
                    set({authUser:updatedDetail}) 
                    toast.success("profile Updated") 
                }
            })
            socket.on("completedRequest",async(requestDetail)=>{
                await axiosInstance.put('/auth/update-profile', data)
            })
        }catch(err){
            console.log(err)
            toast.error(err.response.data.message)
        }finally{
            set({isProfileUpdating:false})
        }
    },
    UnsubscribeToProfileUpdate:()=>{
        const socket = useAuthStore.getState().socket
        socket.off("updateProfile")
    },

    connected:()=>{
        const {authUser} = get()

        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId:get().authUser._id 
            }
        })

        socket.connect()
        set({socket:socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnected:()=>{
        if(get().socket?.connected){
            get().socket.disconnect()
        }
    }

    
}))
