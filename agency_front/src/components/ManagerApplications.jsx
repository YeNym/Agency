import React, { useEffect, useState } from "react";
import { getRequestsByManager, updateStatus } from "../api/accessProperty";
import { getPropertyEnums } from "../api/propertyService";
import PropertyCard from "../components/PropertyCard";

const ManagerApplications = ({ managerId }) => {
    const [requests, setRequests] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestData, enums] = await Promise.all([
                    getRequestsByManager(managerId),
                    getPropertyEnums()
                ]);
                setRequests(requestData);
                console.log(requestData);
                setStatusList(enums.requestStatuses || []);
            } catch (error) {
                console.error("Ошибка при загрузке заявок или статусов:", error);
            }
        };

        fetchData();
    }, [managerId]);

    const handleStatusChange = (requestId, newStatus) => {
        setStatusUpdates((prev) => ({ ...prev, [requestId]: newStatus }));
    };

    const handleStatusUpdate = async (requestId) => {
        const newStatus = statusUpdates[requestId];
        if (!newStatus) return;

        try {
            await updateStatus(requestId, newStatus, managerId);
            alert(`Статус обновлён на ${newStatus}`);
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
            alert("Не удалось обновить статус");
        }
    };

    return (
        <div>
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
                                    onChange={(e) =>
                                        handleStatusChange(request.requestId, e.target.value)
                                    }
                                >
                                    <option value="">-- Выберите статус --</option>
                                    {statusList.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
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

export default ManagerApplications;
