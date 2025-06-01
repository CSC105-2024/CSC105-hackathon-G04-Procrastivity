import API from './api';

export const authService = {
    login: async (username, password) => {
        const response = await API.post('/auth/login', { username, password });
        return response.data;
    },

    logout: async () => {
        const response = await API.post('/auth/logout');
        return response.data;
    },

}