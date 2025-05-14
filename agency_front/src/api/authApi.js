import api from './axiosConfig';

export const login = async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const refreshToken = async (token) => {
    const response = await api.post('/auth/refresh', { token });
    return response.data;
};
