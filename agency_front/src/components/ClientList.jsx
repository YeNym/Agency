import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    getClientsByManager,
    getHousingPreferences,
    updateClient,
    deleteClient,
    updatePreferences
} from '../api/ClientService';
import { getRequestsByManager } from '../api/accessProperty';
import { getPropertyEnums } from '../api/propertyService';
import "../styles/ClientList.css";
import PreferenceEditModal from "./Layout/PreferenceEditModal";

const ClientList = ({ managerId }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [editingClient, setEditingClient] = useState(null);
    const [statusList, setStatusList] = useState([]);
    const [editingPref, setEditingPref] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preferencesData, setPreferencesData] = useState(null);

    const handleEditClick = (preference) => {
        setPreferencesData(prev => ({
            ...preference,
            clientId: expandedClientId // или client.id, если доступно
        }));
        setIsModalOpen(true);
    };


    //

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientData = await getClientsByManager(managerId);
                const enriched = clientData.map(c => ({ ...c, preferences: null, loadingPreferences: false }));
                setClients(enriched);
            } catch (err) {
                setError('Ошибка при загрузке клиентов');
            } finally {
                setLoading(false);
            }
        };

        if (managerId) fetchClients();
    }, [managerId]);

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const [_, enums] = await Promise.all([
                    getRequestsByManager(managerId),
                    getPropertyEnums()
                ]);
                setStatusList(enums.accessLevel || []);
            } catch (err) {
                console.error('Ошибка при загрузке статусов:', err);
            }
        };

        fetchEnums();
    }, [managerId]);

    const handleDeleteClient = async (clientId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
            return;
        }

        try {
            await deleteClient(clientId);
            setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
        } catch (error) {
            console.error('Ошибка при удалении клиента:', error);
            if (error.response) {
                // Ошибка от сервера
                console.error('Ошибка с сервером:', error.response.data);
                alert('Не удалось удалить клиента. Ошибка сервера.');
            } else if (error.request) {
                // Ошибка с запросом
                console.error('Ошибка с запросом:', error.request);
                alert('Не удалось удалить клиента. Ошибка с запросом.');
            } else {
                // Другие ошибки
                console.error('Ошибка:', error.message);
                alert('Не удалось удалить клиента. Попробуйте позже.');
            }
        }
    };



    const loadPreferences = useCallback(async (clientId) => {
        setClients(prev =>
            prev.map(c => c.id === clientId ? { ...c, loadingPreferences: true } : c)
        );
        try {
            const prefs = await getHousingPreferences(clientId);
            setClients(prev =>
                prev.map(c => c.id === clientId ? { ...c, preferences: prefs, loadingPreferences: false } : c)
            );
        } catch {
            setClients(prev =>
                prev.map(c => c.id === clientId ? { ...c, preferences: [], loadingPreferences: false } : c)
            );
        }
    }, []);

    const togglePreferences = (clientId) => {
        if (expandedClientId === clientId) {
            setExpandedClientId(null);
        } else {
            setExpandedClientId(clientId);
            const client = clients.find(c => c.id === clientId);
            if (!client.preferences) loadPreferences(clientId);
        }
    };


    const handleEditField = (fieldPath, value) => {
        const updated = { ...editingClient };
        if (fieldPath.startsWith("authUser.")) {
            updated.authUser = { ...updated.authUser, [fieldPath.split(".")[1]]: value };
        } else {
            updated[fieldPath] = value;
        }
        setEditingClient(updated);
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();

        const dto = {
            accessLevel: editingClient.accessLevel,
            phone: editingClient.phone,
            passport: editingClient.passport,
            email: editingClient.authUser.email,
            firstname: editingClient.authUser.firstname,
            lastname: editingClient.authUser.lastname,
            password: editingClient.authUser.password,
        };

        try {
            const updated = await updateClient(editingClient.id, dto);
            setClients(prev =>
                prev.map(c =>
                    c.id === updated.id ? { ...updated, preferences: c.preferences } : c
                )
            );
            setEditingClient(null);
        } catch (err) {
            alert('Ошибка при обновлении клиента');
        }
    };

    if (loading) return <div className="loading">Загрузка клиентов...</div>;
    if (error) return <div className="error">{error}</div>;

    return (

        <div className="clients-preferences-table">
            <h2 className="client-preferenses">Клиенты и их предпочтения</h2>
            <table>
                <thead>
                <tr>
                    <th>Информация</th>
                    <th>Предпочтения</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {clients.map(client => (
                    <React.Fragment key={client.id}>
                        <tr className="client-row" onClick={() => togglePreferences(client.id)}>
                            <td>
                                <div><strong>Имя:</strong> {client.authUser.firstname}</div>
                                <div><strong>Фамилия:</strong> {client.authUser.lastname}</div>
                                <div><strong>Email:</strong> {client.authUser.email}</div>
                                <div><strong>Телефон:</strong> {client.phone}</div>
                                <div><strong>Паспорт:</strong> {client.passport || 'не указан'}</div>
                                <div><strong>Доступ:</strong> {client.accessLevel}</div>
                            </td>
                            <td>
                                {client.loadingPreferences
                                    ? 'Загрузка...'
                                    : client.preferences
                                        ? `Предпочтений: ${client.preferences.length}`
                                        : 'Нажмите для загрузки'}
                            </td>
                            <td>
                                <button className="edit-button" onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingClient({ ...client });
                                }}>
                                    ✏️ Редактировать
                                </button>
                                <button className="delite-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClient(client.id);
                                    }}
                                    style={{ marginLeft: '10px', color: 'white' }}
                                >
                                    🗑️ Удалить
                                </button>


                            </td>
                        </tr>

                        {expandedClientId === client.id && client.preferences && (
                            <tr className="preferences-details">
                                <td colSpan="3">

                                    {client.preferences.length > 0 ? client.preferences.map((pref, index) => (
                                        <div key={index} className="preference-item">
                                            <h4>Предпочтение #{index + 1}</h4>
                                            <div><strong>Город:</strong> {pref.city || 'не указан'}</div>
                                            <div><strong>Район:</strong> {pref.district || 'не указан'}</div>
                                            <div><strong>Улица:</strong> {pref.street || 'не указана'}</div>
                                            <div><strong>Площадь:</strong> {pref.minArea || '?'} - {pref.maxArea || '?'} м²</div>
                                            <div><strong>Цена:</strong> {pref.minPrice || '?'} - {pref.maxPrice || '?'}</div>
                                            <div><strong>Комнат:</strong> {pref.roomsCount || 'не указано'}</div>
                                            <div><strong>Балкон:</strong> {pref.hasBalcony ? 'да' : 'нет'}</div>
                                            <div><strong>Животные:</strong> {pref.allowPets ? 'разрешены' : 'нет'}</div>
                                            <div><strong>Примечания:</strong> {pref.additionalNotes || 'нет'}</div>
                                            <button
                                                onClick={() => handleEditClick(pref)}
                                                style={{ marginTop: '10px' }}
                                            >
                                                ✏️ Редактировать предпочтение
                                            </button>

                                            {isModalOpen && preferencesData && (
                                                <PreferenceEditModal
                                                    preference={preferencesData}
                                                    onClose={() => setIsModalOpen(false)}
                                                    onSave={async (updatedPref) => {
                                                        try {
                                                            console.log("Отправляемое предпочтение:", updatedPref);
                                                            console.log("clientId:", preferencesData.clientId);
                                                            console.log("prefId:", preferencesData.id);
                                                            await updatePreferences(preferencesData.clientId, preferencesData.id, updatedPref);
                                                            await loadPreferences(preferencesData.clientId);
                                                            setIsModalOpen(false);
                                                        } catch (e) {
                                                            alert('Ошибка при сохранении предпочтения');
                                                        }
                                                    }}
                                                />
                                            )}

                                        </div>
                                    )) : <div>Нет данных</div>}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>

            {editingClient && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Редактирование клиента</h3>
                        <form onSubmit={handleUpdateClient}>
                            <label>Имя:
                                <input
                                    type="text"
                                    value={editingClient.authUser.firstname}
                                    onChange={(e) => handleEditField("authUser.firstname", e.target.value)}
                                />
                            </label>
                            <label>Фамилия:
                                <input
                                    type="text"
                                    value={editingClient.authUser.lastname}
                                    onChange={(e) => handleEditField("authUser.lastname", e.target.value)}
                                />
                            </label>
                            <label>Email:
                                <input
                                    type="email"
                                    value={editingClient.authUser.email}
                                    onChange={(e) => handleEditField("authUser.email", e.target.value)}
                                />
                            </label>
                            <label>Пароль:
                                <input
                                    type="password"
                                    value={editingClient.authUser.password || ''}
                                    onChange={(e) => handleEditField("authUser.password", e.target.value)}
                                />
                            </label>
                            <label>Уровень доступа:
                                <select
                                    value={editingClient.accessLevel || ""}
                                    onChange={(e) => handleEditField("accessLevel", e.target.value)}
                                >
                                    <option value="">-- выбрать --</option>
                                    {statusList.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </label>
                            <label>Телефон:
                                <input
                                    type="text"
                                    value={editingClient.phone || ""}
                                    onChange={(e) =>
                                        setEditingClient({
                                            ...editingClient,
                                            phone: e.target.value
                                        })
                                    }
                                />
                            </label>

                            <label>Паспорт:
                                <input
                                    type="text"
                                    value={editingClient.passport || ""}
                                    onChange={(e) =>
                                        setEditingClient({
                                            ...editingClient,
                                            passport: e.target.value
                                        })
                                    }
                                />
                            </label>


                            <div className="modal-buttons">
                                <button type="submit">💾 Сохранить</button>
                                <button type="button" onClick={() => setEditingClient(null)}>✖ Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div>
            </div>

        </div>
    );
};

export default ClientList;
