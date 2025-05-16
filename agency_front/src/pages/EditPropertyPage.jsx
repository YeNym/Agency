import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getPropertyById, getPropertyEnums, updateProperty} from '../api/propertyService';
import "../styles/EditPropertyPage.css"
import {getClientsByManager} from "../api/ClientService";

const EditPropertyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enumValues, setEnumValues] = useState({
        propertyTypes: [],
        propertyLevels: [],
        statuses: []
    });
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

        fetchEnums();
    }, []);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await getPropertyById(id);
                setProperty(data);
            } catch (err) {
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setProperty((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setProperty((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Отправляемые данные:', property); // ✅ ЛОГ

        try {
            await updateProperty(id, property);
            alert('Недвижимость успешно обновлена');
            navigate(`/manager-dashboard`);
        } catch (err) {
            alert('Ошибка при сохранении');
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-property-page">
            <h2>Редактирование недвижимости</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-columns">
                <label>Район:
                    <input type="text" name="address.district" value={property.address?.district || ''} onChange={handleChange} />
                </label>
                <label>Город:
                    <input type="text" name="address.city" value={property.address?.city || ''} onChange={handleChange} />
                </label>

                <label>Цена:
                    <input type="number" name="price" value={property.price || 0} onChange={handleChange} required />
                </label>
                <label>Комнат:
                    <input type="number" name="rooms" value={property.rooms || 0} onChange={handleChange} required />
                </label>
                <label>Этаж:
                    <input type="number" name="floor" value={property.floor || 0} onChange={handleChange} required />
                </label>


                <label>
                    Уровень:
                    <select name="propertyLevel" value={property.propertyLevel} onChange={handleChange}>
                        <option value="">Выберите уровень</option>
                        {enumValues.propertyLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </label>

                </div>
                <div className="form-columns">
                <label>Описание:
                    <textarea name="description" value={property.description || ''} onChange={handleChange} required />
                </label>
                <label>
                    Тип недвижимости:
                    <select name="propertyType" value={property.propertyType} onChange={handleChange} required>
                        <option value="">Выберите тип</option>
                        {enumValues.propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Статус:
                    <select name="status" value={property.status} onChange={handleChange} required>
                        {enumValues.statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </label>
                </div>
                <div className="checkbox-label-conainer">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hasBalcony"
                            checked={property.allowPets || false}
                            onChange={handleChange}
                        />
                        <span className="custom-checkbox"></span>
                        Животные
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hasBalcony"
                            checked={property.hasBalcony || false}
                            onChange={handleChange}
                        />
                        <span className="custom-checkbox"></span>
                        Балкон
                    </label>
                </div>


                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default EditPropertyPage;
