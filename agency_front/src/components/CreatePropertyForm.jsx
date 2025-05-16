import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, getPropertyEnums } from '../api/propertyService';
import { getClientsByManager } from '../api/ClientService';
import '../styles/CreatePropertyForm.css';

const CreatePropertyForm = ({ onSuccess }) => {
    const navigate = useNavigate();
    const [selectedClientId, setSelectedClientId] = useState('');
    const [clients, setClients] = useState([]);
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            setImages(prevImages => [...prevImages, ...files]);
        }
    };
    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const [formData, setFormData] = useState({
        address: {
            city: '',
            district: '',
            street: '',
            building: ''
        },
        rooms: '',
        price: '',
        floor: '',
        propertyLevel: '',
        description: '',
        owner: '',
        propertyType: '',
        status: 'AVAILABLE',
        hasBalcony: false,
        allowPets: false
    });

    const [enumValues, setEnumValues] = useState({
        propertyTypes: [],
        propertyLevels: [],
        statuses: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const data = await getPropertyEnums();
                setEnumValues({
                    propertyTypes: data.propertyTypes || [],
                    propertyLevels: data.propertyLevels || [],
                    statuses: data.statuses || []
                });
            } catch (err) {
                console.error('Ошибка загрузки enum значений:', err);
            }
        };

        const fetchClients = async () => {
            try {
                const managerId = localStorage.getItem('managerId');
                if (!managerId) {
                    console.error('Manager ID not found!');
                    return;
                }
                const data = await getClientsByManager(managerId);
                setClients(data || []);
            } catch (err) {
                console.error('Ошибка загрузки клиентов:', err);
            }
        };

        fetchEnums();
        fetchClients();
    }, []);

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);
        setFormData(prev => ({
            ...prev,
            owner: clientId
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();

            // Формируем объект для отправки (с нужными типами полей)
            const payload = {
                ...formData,
                rooms: parseInt(formData.rooms),
                price: parseFloat(formData.price),
                floor: parseInt(formData.floor),
                owner: { id: parseInt(formData.owner) }
            };

            // Добавляем JSON-строку с данными недвижимости
            formDataToSend.append("propertyData", JSON.stringify(payload));

            // Добавляем все выбранные изображения
            images.forEach((file) => {
                formDataToSend.append("file", file); // ключ "file" должен совпадать с тем, что ожидает сервер
            });

            // Отправляем данные на сервер
            await createProperty(formDataToSend);

            // После успешной отправки — очищаем форму
            setFormData({
                address: {
                    city: '',
                    district: '',
                    street: '',
                    building: ''
                },
                rooms: '',
                price: '',
                floor: '',
                propertyLevel: '',
                description: '',
                owner: '',
                propertyType: '',
                status: 'AVAILABLE',
                hasBalcony: false,
                allowPets: false
            });
            setSelectedClientId('');
            setImages([]);

            // Вызов коллбэка успешного завершения, если есть
            if (onSuccess) await onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при создании недвижимости');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="create-property-container">
            <h2>Добавить новую недвижимость</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="property-form">
                <div className="form-columns">
                    <div className="form-column">
                        <h3>Общие данные</h3>

                        <label>
                            Тип недвижимости:
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                                <option value="">Выберите тип</option>
                                {enumValues.propertyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>Клиент:</span>
                            <select value={selectedClientId} onChange={handleClientChange} required>
                                <option value="">-- Выберите клиента --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.authUser ? `${client.authUser.lastname} ${client.authUser.firstname}` : `Клиент #${client.id}`}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Количество комнат:
                            <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} min="1" required />
                        </label>

                        <label>
                            Цена:
                            <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="100" required />
                        </label>

                        <label>
                            Этаж:
                            <input type="number" name="floor" value={formData.floor} onChange={handleChange} required />
                        </label>

                        <label>
                            Уровень:
                            <select name="propertyLevel" value={formData.propertyLevel} onChange={handleChange}>
                                <option value="">Выберите уровень</option>
                                {enumValues.propertyLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Статус:
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                {enumValues.statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Описание:
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
                        </label>
                    </div>

                    <div className="form-column">
                        <h3>Адрес</h3>

                        <label>
                            Город:
                            <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} required />
                        </label>

                        <label>
                            Район:
                            <input type="text" name="address.district" value={formData.address.district} onChange={handleChange} required />
                        </label>

                        <label>
                            Улица:
                            <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} required />
                        </label>

                        <label>
                            Номер дома:
                            <input type="text" name="address.building" value={formData.address.building} onChange={handleChange} required />
                        </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="hasBalcony"
                                    checked={formData.hasBalcony}
                                    onChange={handleChange}
                                />
                                <span className="custom-checkbox"></span>
                                Наличие балкона
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="allowPets"
                                    checked={formData.allowPets}
                                    onChange={handleChange}
                                />
                                <span className="custom-checkbox"></span>
                                Разрешены животные
                            </label>

                    </div>
                    <label>
                        Изображения:
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </label>

                    {/* Превью выбранных фото */}
                    <div className="image-preview-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {images.map((file, index) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img src={url} alt={`preview-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: 'red',
                                            border: 'none',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                </div>

                <div className="submit-container">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Создание...' : 'Создать недвижимость'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePropertyForm;
