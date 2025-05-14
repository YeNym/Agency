// components/TravelPropertiesList.jsx
import React, { useEffect, useState } from 'react';
import { getTravelProperties } from '../api/propertyService';
import PropertyCard from '../components/PropertyCard';
import '../styles/PropertyList.css';

const TravelersPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTravelProperties = async () => {
            try {
                const data = await getTravelProperties();
                setProperties(data);
            } catch (err) {
                console.error('Error fetching travel properties:', err);
                setError('Failed to load travel properties');
            } finally {
                setLoading(false);
            }
        };

        fetchTravelProperties();
    }, []);

    if (loading) return <div className="loading">Loading travel properties...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="travel-properties-container">
            <h2 >Обмен квартирами</h2>
            <div className="property-list">
                {properties.length > 0 ? (
                    properties.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                        />
                    ))
                ) : (
                    <p>No travel properties available</p>
                )}
            </div>
        </div>
    );
};

export default TravelersPage;