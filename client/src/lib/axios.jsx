import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://gcesbloodline.onrender.com/api/v1', 
    withCredentials:true
})