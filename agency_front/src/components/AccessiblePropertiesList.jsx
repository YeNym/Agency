import React, { useEffect, useState } from 'react';
import { getClientPropertyAccess } from '../api/accessProperty'; // путь к твоей функции
import PropertyCard from './PropertyCard';
import SkeletonPropertyCard from "./Layout/SkeletonPropertyCard"; // путь к компоненту
import '../styles/PropertyList.css';

const AccessiblePropertiesList = ({ clientId }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const accessList = await getClientPropertyAccess(clientId);
                setProperties(accessList);
            } catch (err) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [clientId]);

    if (loading) {
        return (
            <div className="properties-list">
                {Array(3).fill(0).map((_, i) => (
                    <SkeletonPropertyCard key={i} />
                ))}
            </div>
        );
    }
    if (error) return <div>{error}</div>;
    if (properties.length === 0) return <div>Нет доступных квартир.</div>;

    return (
        <div className="property-list">
            {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
};

export default AccessiblePropertiesList;
