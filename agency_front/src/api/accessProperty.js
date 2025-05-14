import api from "./axiosConfig";

export const grantAccessToProperty = async (managerId, clientId, propertyId) => {
    const response = await api.post(`/access/grant`, null, {
        params: {
            managerId,
            clientId,
            propertyId
        }
    });
    return response.data;
};

export const getClientPropertyAccess = async (clientId) => {
    console.log("Загружаю доступные квартиры для клиента:", clientId);
    const response = await api.get(`/access/client-properties`, {
        params: { clientId }
    });
    console.log("Ответ от сервера:", response.data);
    return response.data;
};


export const createTravelRequest = async (clientId, propertyId) => {
    if (!clientId || !propertyId) {
        throw new Error('clientId или propertyId отсутствует');
    }

    const response = await api.post('/travel-requests/create', {
        clientId,
        propertyId,
    });

    return response.data;
};

export const getPendingRequests = async () => {
    try {
        const response = await api.get("/travel-requests/pending");
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении заявок со статусом PENDING:", error);
        throw error;
    }
};

export const updateStatus = async (requestId, newStatus, managerId) => {
    const payload = {
        requestId,
        newStatus,
        managerId
    };

    try {
        const response = await api.put('/travel-requests/status', payload);
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении статуса:", error.response ? error.response.data : error.message);
        throw error;
    }
};


export const getRequestsByManager = async (managerId) => {
    const response = await api.get(`/travel-requests/non-pending/manager/${managerId}`);
    return response.data;
};
