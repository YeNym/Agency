import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { getPropertiesByManagerId } from '../api/propertyService';
import '../styles/PropertyList.css';

const PropertyList = ({ manager }) => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            if (manager?.id) {
                const data = await getPropertiesByManagerId(manager.id);
                // console.log(data);
                setProperties(data);
            }
        };
        fetchProperties();
    }, [manager]);

    return (

        <div className="property-list">

            {properties.length > 0 ? (
                properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))
            ) : (
                <div className="no-properties">Недвижимость не найдена</div>
            )}
        </div>
    );
};

export default PropertyList;
