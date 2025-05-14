import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../api/propertyService';
import {getClientById, getClientsByManager} from '../api/ClientService'; // Импортируем функцию API
import { useAuth } from '../context/AuthContext';
import {createTravelRequest, grantAccessToProperty} from "../api/accessProperty";
import { Link } from 'react-router-dom';
import "../styles/PropertyDetailPage.css"
import { useNavigate } from 'react-router-dom';
import { deleteProperty } from '../api/propertyService'; // Импортируй delete


const PropertyDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth(); // Получаем текущего пользователя
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [clients, setClients] = useState([]); // Список клиентов
    const [selectedClientId, setSelectedClientId] = useState('');
    const [clientData, setClientData] = useState(null);

    const isManager = user?.role === 'MANAGER';

    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmed = window.confirm("Вы уверены, что хотите удалить это помещение?");
        if (!confirmed) return;

        try {
            await deleteProperty(property.id);
            alert('Помещение успешно удалено');
            navigate('/properties'); // Перенаправление, подкорректируй под свой роутинг
        } catch (error) {
            alert('Ошибка при удалении помещения');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await getPropertyById(id);
                setProperty(data);
            } catch (err) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    useEffect(() => {
        if (isManager && user?.id) {
            const fetchClients = async () => {
                try {
                    const data = await getClientsByManager(user.id);
                    setClients(data);
                } catch (err) {
                    console.error('Ошибка при получении клиентов:', err);
                }
            };
            fetchClients();
        }
    }, [isManager, user]);

    useEffect(() => {
        const fetchClientData = async () => {
            const clientId = localStorage.getItem('clientId');
            if (clientId) {
                try {
                    const data = await getClientById(clientId);
                    setClientData(data);
                } catch (err) {
                    console.error('Ошибка при получении данных клиента:', err);
                }
            }
        };

        fetchClientData();
    }, []);


    const handleClientChange = (e) => {
        setSelectedClientId(e.target.value);
    };

    const handleAssign = async () => {
        if (!selectedClientId || !property?.id || !user?.id) return;
        const managerId = user.id;

        try {
            // Вызываем grantAccessToProperty с параметрами managerId, clientId и propertyId
            await grantAccessToProperty(managerId, selectedClientId, property.id);
            alert('Доступ успешно выдан клиенту!');
        } catch (error) {
            alert('Ошибка при выдаче доступа');
        }
    };


    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>

            <div className="property-detail-page">

            <h1>Детали недвижимости</h1>
            {property ? (
                <div>
                    <h2>{property.title}</h2>
                    <p>Город: {property.city}</p>
                    <p>Район: {property.district}</p>
                    <p>Улица: {property.street}</p>
                    <p>Цена: {property.price}</p>
                    <p>Количество комнат: {property.rooms}</p>
                    <p>Этаж: {property.floor}</p>
                    <p>Балкон: {property.hasBalcony ? 'Да' : 'Нет'}</p>
                    <p>Тип: {property.propertyType}</p>
                    <p>Животные: {property.allowPets ? 'Разрешены' : 'Запрещены'}</p>

                    {isManager && (
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Клиент:</label>
                            <select
                                value={selectedClientId}
                                onChange={handleClientChange}
                                required
                            >
                                <option value="">-- Выберите клиента --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.authUser
                                            ? `${client.authUser.lastname} ${client.authUser.firstname}`
                                            : `Клиент #${client.id}`}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAssign} disabled={!selectedClientId}>
                                Присвоить
                            </button>
                        </div>
                    )}

                    {!isManager && clientData?.accessLevel === 'TRAVELER' && property?.propertyLevel === 'TRAVEL' && (
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={async () => {
                                try {
                                    await createTravelRequest(clientData.id, property.id);
                                    alert('Запрос успешно отправлен');
                                } catch (e) {
                                    alert('Ошибка при отправке запроса');
                                }
                            }}>
                                Отправить запрос
                            </button>
                        </div>
                    )}
                    {isManager && (
                        <Link to={`/properties/${id}/edit`}>
                            <button>Редактировать</button>
                        </Link>
                    )}
                    {isManager && (
                        <button className="delete-button" onClick={handleDelete}>
                            Удалить помещение
                        </button>
                    )}


                </div>
            ) : (
                <p>Информация о недвижимости не найдена</p>
            )}
        </div>
        </div>
    );
};

export default PropertyDetailPage;
