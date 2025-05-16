import React, { useEffect, useState } from "react";
import { getPendingRequests, updateStatus } from "../api/accessProperty";
import PropertyCard from "../components/PropertyCard";
import { getPropertyEnums } from "../api/propertyService";
import {useNavigate} from "react-router-dom";

const Applications = () => {
    const [requests, setRequests] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({}); // {requestId: selectedStatus}
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getPendingRequests();
                setRequests(response);
                const enums = await getPropertyEnums();
                setStatusList(enums.requestStatuses || []);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = (requestId, newStatus) => {
        setStatusUpdates(prev => ({
            ...prev,
            [requestId]: newStatus
        }));
    };

    const handleStatusUpdate = async (requestId) => {
        const newStatus = statusUpdates[requestId];
        const managerId = localStorage.getItem("managerId");

        if (!newStatus) {
            alert("Выберите статус");
            return;
        }

        if (!managerId) {
            alert("Менеджер не авторизован");
            return;
        }

        try {
            await updateStatus(requestId, newStatus, managerId);
            alert("Статус обновлён");
            const updated = await getPendingRequests();
            setRequests(updated);
        } catch (error) {
            alert("Ошибка при обновлении статуса");
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }
    if (!requests.length) {
        return (
            <div className="no-applications">
                <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>
                <h2>Пока тут пусто</h2>

            </div>
        );
    }
    return (
        <div>
                <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>

                <h2>Заявки на квартиры</h2>
            <div className="applications-list">
                {requests.map((request) => (
                    <div key={request.requestId} className="application-item">
                        <PropertyCard property={request.property} />
                        <div className="client-info">
                            <h4>Информация о клиенте</h4>
                            <p><strong>Имя:</strong> {request.client.authUser.firstname} {request.client.authUser.lastname}</p>
                            <p><strong>Телефон:</strong> {request.client.phone}</p>

                            <div className="status-update">
                                <label>Новый статус:</label>
                                <select
                                    value={statusUpdates[request.requestId] || ""}
                                    onChange={(e) => handleStatusChange(request.requestId, e.target.value)}
                                >
                                    <option value="">-- Выберите статус --</option>
                                    {statusList.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleStatusUpdate(request.requestId)}>
                                    Изменить статус
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Applications;

