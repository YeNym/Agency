import React, { useState } from 'react';
import "../../styles/ImageSlider.css"


const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const nextSlide = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    return (
        <div className="slider">
            <button className="slider-button left" onClick={prevSlide}>‹</button>
            <img
                src={`http://localhost:8080/uploads/${images[currentIndex]}`}
                alt={`Slide ${currentIndex + 1}`}
                className="slider-image"
            />
            <button className="slider-button right" onClick={nextSlide}>›</button>
        </div>
    );
};

export default ImageSlider;
