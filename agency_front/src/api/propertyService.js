import api from './axiosConfig';

export const getAllProperties = async () => {
    const response = await api.get('/properties');
    return response.data;
};

export const createProperty = async (propertyData) => {
    const response = await api.post('/properties', propertyData); // убрали managerId
    return response.data;
};

// Получение enum значений с бэка (если нужно)
export const getPropertyEnums = async () => {
    const response = await api.get('/properties/enums');
    return response.data;
};

export const getPropertiesByManagerId = async (managerId) => {
    const response = await api.get(`/properties/find-by-managers/${managerId}`);
    return response.data;
};

export const searchProperties = async (params) => {
    const response = await api.get('/properties/search', { params });
    return response.data;
};
export const getTravelProperties = async () => {
    const response = await api.get('/properties/travel');
    return response.data;
};

export const getPropertyById = async (id) => {
    const response = await api.get(`/properties/${id}`);
    console.log('Ответ от сервера:', response);
    return response.data;
};

export const updateProperty = async (id, propertyData) => {
    try {
        const response = await api.put(`/properties/${id}`, propertyData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении недвижимости:', error);
        throw error;
    }
};

export const deleteProperty = async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
};