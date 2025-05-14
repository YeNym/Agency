import api from "./axiosConfig";


export const getManagerByUserId = async (userId) => {
    const response = await api.get(`managers/by-user/${userId}`);
    return response.data;
};

