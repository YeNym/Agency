import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/PropertyCard.css';
import { Link, useLocation } from 'react-router-dom';
import {getPropertyEnums} from "../api/propertyService";
import {updateStatus} from "../api/accessProperty";

const PropertyCard = ({ property }) => {
    const location = useLocation();

    return (
        <div className="property-card">
            <Link to={`/property/${property.id}`}>
                <div className="property-image">
                    <div className="image-placeholder">
                        {property.propertyType?.charAt(0) || 'P'}
                    </div>
                </div>
                <div className="property-details">
                    <h3 className="property-type">
                        {property.propertyType || 'Тип не указан'}
                    </h3>
                    <p className="property-description">
                        {property.description || 'Описание отсутствует'}
                    </p>
                    <div className="property-price">
                        {property.price ? `${property.price} ₽` : 'Цена не указана'}
                    </div>
                </div>
            </Link>


        </div>
    );
};

PropertyCard.propTypes = {
    property: PropTypes.shape({
        id: PropTypes.number.isRequired,
        price: PropTypes.number,
        propertyType: PropTypes.string,
        description: PropTypes.string,
    }).isRequired
};

export default PropertyCard;
