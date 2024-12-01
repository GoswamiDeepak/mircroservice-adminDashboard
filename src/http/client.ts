import axios from "axios";
import { userAuthStore } from "../store";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json',
        Accept: 'application/json'
    }
})
// const refreshToken = () => api.get('/api/refresh')

const refreshToken = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,{}, {
        withCredentials: true,
    })
}

api.interceptors.response.use((response)=>response, async(error)=> {
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._isRetry) {
       try {
        originalRequest._isRetry = true; //to prevent infinite loop of api call
        const headers = {...originalRequest.headers}
         await refreshToken()
         return api.request({...originalRequest, headers})
       } catch (error) {
        console.log('token refresh error',error)
        userAuthStore.getState().logout();
        return Promise.reject(error);
       }
    }
    return Promise.reject(error);
})