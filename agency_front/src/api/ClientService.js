import api from "./axiosConfig";

export const getClientsByManager = async (managerId) => {
    const response = await api.get(`/clients/by-manager/${managerId}`);
    return response.data;
};
export const createHousingPreferences = async (clientId, preferencesData) => {
    const response = await api.post(`/clients/${clientId}/preferences/create`, preferencesData);
    return response.data;
};

export const getHousingPreferences = async (clientId) => {
    const response = await api.get(`/clients/${clientId}/preferences`);
    return response.data;
};

export const getClientByUserId = async (userId) => {
    const response = await api.get(`/clients/client-search/${userId}`);
    return response.data;
}
export const getClientById = async (clientId) => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
}

export const updateClient = async (clientId, clientData) => {
    const response = await api.put(`/clients/${clientId}`, clientData);
    return response.data;
};


export const deleteClient = async (clientId) => {
    try {
        const response = await api.delete(`/clients/${clientId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении клиента:', error);
        throw error;
    }
};

export const updatePreferences = async (clientId, prefId, preferencesData) => {
    try {
        const response = await api.put(`/clients/${clientId}/preferences/${prefId}`, preferencesData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении предпочтений:', error);
        throw error;
    }
};