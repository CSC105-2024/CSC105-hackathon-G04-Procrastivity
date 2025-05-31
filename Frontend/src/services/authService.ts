import API from './api';
import Cookies from 'cookies';

export const authService = {
    login: async (username, password) => {
        const response = await API.post('/auth/login', { username, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await API.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await API.post('/auth/logout');
        return response.data;
    },

    refreshToken: async () => {
        const response = await API.get('/auth/refresh');
        return response.data;
    }
}