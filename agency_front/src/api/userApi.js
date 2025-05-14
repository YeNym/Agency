import api from './axiosConfig';

export const getCurrentUser = async () => {
    const response = await api.get('/user/me');
    console.log(response);
    return response.data;
};