import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../api/propertyService';
import "../styles/EditPropertyPage.css"

const EditPropertyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            navigate(`/properties/${id}`);
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


                <label>Уровень:
                    <input type="text" name="propertyLevel" value={property.propertyLevel || ''} onChange={handleChange} required />
                </label>
                <label>Описание:
                    <textarea name="description" value={property.description || ''} onChange={handleChange} required />
                </label>
                <label>Тип:
                    <input type="text" name="propertyType" value={property.propertyType || ''} onChange={handleChange} required />
                </label>
                <label>Статус:
                    <input type="text" name="status" value={property.status || ''} onChange={handleChange} required />
                </label>
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
                        name="allowPets"
                        checked={property.hasBalcony || false}
                        onChange={handleChange}
                    />
                    <span className="custom-checkbox"></span>
                    Балкон
                </label>



                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default EditPropertyPage;
