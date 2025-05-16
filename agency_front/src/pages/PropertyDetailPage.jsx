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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageSlider from "../components/Layout/ImageSlider";

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
            navigate('/manager-dashboard'); // Перенаправление, подкорректируй под свой роутинг
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
                console.log('Image path:', data.imagePaths);

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
        <div className="propertyDetailPage">
            <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>

            <div className="details-container">
                <div className="property-header">
                    <h1>{property?.title}</h1>
                    {isManager && (
                        <div className="button-group">
                            <Link to={`/properties/${id}/edit`}>
                                <button className="btn-primary">Редактировать</button>
                            </Link>
                            <button className="btn-primary btn-danger" onClick={handleDelete}>
                                Удалить
                            </button>
                        </div>
                    )}
                </div>

                <div className="image-slider-container">
                    {Array.isArray(property.imagePaths) && property.imagePaths.length > 0 && (
                        <ImageSlider images={property.imagePaths} />
                    )}
                </div>

                <div className="property-info-grid">

                    <div className="property-info-section">
                        <h3>Основная информация</h3>
                        <div className="info-item">
                            <span className="info-label">Город:</span>
                            <span className="info-value">{property.address.city}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Район:</span>
                            <span className="info-value">{property.address.district}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Улица:</span>
                            <span className="info-value">{property.address.street}</span>
                        </div>
                    </div>

                    <div className="property-info-section">
                        <h3>Характеристики</h3>
                        <div className="info-item">
                            <span className="info-label">Цена:</span>
                            <span className="info-value">{property.price} ₽</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Комнат:</span>
                            <span className="info-value">{property.rooms}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Этаж:</span>
                            <span className="info-value">{property.floor}</span>
                        </div>
                    </div>

                    <div className="property-info-section">
                        <h3>Дополнительно</h3>
                        <div className="info-item">
                            <span className="info-label">Балкон:</span>
                            <span className="info-value">{property.hasBalcony ? 'Да' : 'Нет'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Тип:</span>
                            <span className="info-value">{property.propertyType}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Животные:</span>
                            <span className="info-value">{property.allowPets ? 'Разрешены' : 'Запрещены'}</span>
                        </div>
                    </div>
                </div>

                {(isManager || clientData?.accessLevel === 'TRAVELER') && (
                    <div className="actions-section">
                        {isManager && (
                            <>
                                <select
                                    className="select-client"
                                    value={selectedClientId}
                                    onChange={handleClientChange}
                                >
                                    <option value="">Выберите клиента</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.authUser
                                                ? `${client.authUser.lastname} ${client.authUser.firstname}`
                                                : `Клиент #${client.id}`}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="btn-primary"
                                    onClick={handleAssign}
                                    disabled={!selectedClientId}
                                >
                                    Присвоить клиенту
                                </button>
                            </>
                        )}

                        {!isManager && clientData?.accessLevel === 'TRAVELER' && property?.propertyLevel === 'TRAVEL' && (
                            <button
                                className="btn-primary"
                                onClick={async () => {
                                    try {
                                        await createTravelRequest(clientData.id, property.id);
                                        alert('Запрос успешно отправлен');
                                    } catch (e) {
                                        alert('Ошибка при отправке запроса');
                                    }
                                }}
                            >
                                Отправить запрос на просмотр
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDetailPage;
