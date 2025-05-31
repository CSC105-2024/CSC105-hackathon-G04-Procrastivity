import API from './api';

export const userService = {
    getProfile: async () => {
        const response = await API.get('/users/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await API.put('/users/profile', userData);
        return response.data;
    },

    updateProfilePicture: async (profilePicture) => {
        const response = await API.patch('/users/profile-picture', {
            profilePicture
        });
        return response.data;
    },

    getStats: async () => {
        const response = await API.get('/users/stats');
        return response.data;
    }
};