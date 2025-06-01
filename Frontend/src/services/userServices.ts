import API from './api';

export const userService = {
    getProfile: async () => {
        const response = await API.get('/users/profile');
        return response.data;
    },

    updateProfile: async (body) => {
        const response = await API.patch('/user/updateUsername', body);
        return response.data;
    },

    updateProfilePicture: async (body) => {
        const response = await API.patch('/user/updateProfilePicture', body);
        return response.data;
    },

    getStats: async () => {
        const response = await API.get('/users/stats');
        return response.data;
    }
};