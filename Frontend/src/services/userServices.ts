import API from './api';

export const userService = {


    updateProfile: async (body) => {
        const response = await API.patch('/user/updateUsername', body);
        return response.data;
    },

    updateProfilePicture: async (body) => {
        const response = await API.patch('/user/updateProfilePicture', body);
        return response.data;
    },


};