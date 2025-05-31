import axios from 'axios';

// @ts-ignore
const API = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export default API;