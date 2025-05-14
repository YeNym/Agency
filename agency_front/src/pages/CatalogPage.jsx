import React, { useEffect, useState } from 'react';
import { searchProperties, getAllProperties } from '../api/propertyService';
import PropertyCard from '../components/PropertyCard';
import "../styles/CatalogPage.css"
import {useNavigate} from "react-router-dom";

const CatalogPage = () => {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({
        city: '',
        minRooms: '',
        maxRooms: '',
        minPrice: '',
        maxPrice: '',
        propertyType: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Загрузка всех объектов при монтировании
    useEffect(() => {
        loadAllProperties();
    }, []);

    const loadAllProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllProperties();
            setProperties(Array.isArray(data) ? data : []);
            console.log("Loaded properties:", data);

        } catch (err) {
            console.error(err);
            setError('Ошибка при загрузке объектов');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const nonEmptyParams = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );

            const data = Object.keys(nonEmptyParams).length > 0
                ? await searchProperties(nonEmptyParams)
                : await getAllProperties();

            setProperties(data);
        } catch (err) {
            console.error(err);
            setError('Ошибка при поиске');
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            city: '',
            minRooms: '',
            maxRooms: '',
            minPrice: '',
            maxPrice: '',
            propertyType: ''
        });
        loadAllProperties();
    };

    return (
        <div className="page-container">
                <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>

                <h1>Каталог</h1>

            {/* Форма фильтрации */}
            <div className="filter-form">
                <input type="text" name="city" placeholder="Город"
                       value={filters.city} onChange={handleChange} />
                <input type="number" name="minRooms" placeholder="Мин. комнат"
                       value={filters.minRooms} onChange={handleChange} />
                <input type="number" name="maxRooms" placeholder="Макс. комнат"
                       value={filters.maxRooms} onChange={handleChange} />
                <input type="number" name="minPrice" placeholder="Мин. цена"
                       value={filters.minPrice} onChange={handleChange} />
                <input type="number" name="maxPrice" placeholder="Макс. цена"
                       value={filters.maxPrice} onChange={handleChange} />
                <select name="propertyType" value={filters.propertyType} onChange={handleChange}>
                    <option value="">Тип недвижимости</option>
                    <option value="APARTMENT">Апартаменты</option>
                    <option value="HOUSE">Дом</option>
                    <option value="FLAT">Квартира</option>
                    <option value="INDUSTRIAL">Нежилое</option>

                </select>

                <div className="filter-buttons">
                    <button onClick={handleSearch}>Поиск</button>
                    <button onClick={resetFilters} className="reset-button">Сбросить</button>
                </div>
            </div>

            {/* Результаты */}
            {loading && <p>Загрузка...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && properties.length === 0 && (
                <p>Объекты недвижимости не найдены</p>
            )}

            <div className="property-list">
                {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default CatalogPage;