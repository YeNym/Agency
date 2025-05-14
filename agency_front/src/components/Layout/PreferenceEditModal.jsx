import React, { useState, useEffect } from 'react';

const PreferenceEditModal = ({ preference, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...preference });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Редактирование предпочтения</h3>
                <form onSubmit={handleSubmit}>
                    <label>Город:
                        <input type="text" name="city" value={formData.city || ''} onChange={handleChange} />
                    </label>
                    <label>Район:
                        <input type="text" name="district" value={formData.district || ''} onChange={handleChange} />
                    </label>
                    <label>Улица:
                        <input type="text" name="street" value={formData.street || ''} onChange={handleChange} />
                    </label>
                    <label>Мин. площадь:
                        <input type="number" name="minArea" value={formData.minArea || ''} onChange={handleChange} />
                    </label>
                    <label>Макс. площадь:
                        <input type="number" name="maxArea" value={formData.maxArea || ''} onChange={handleChange} />
                    </label>
                    <label>Мин. цена:
                        <input type="number" name="minPrice" value={formData.minPrice || ''} onChange={handleChange} />
                    </label>
                    <label>Макс. цена:
                        <input type="number" name="maxPrice" value={formData.maxPrice || ''} onChange={handleChange} />
                    </label>
                    <label>Кол-во комнат:
                        <input type="number" name="roomsCount" value={formData.roomsCount || ''} onChange={handleChange} />
                    </label>
                    <div className="checkbox-container">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hasBalcony"
                            checked={formData.hasBalcony}
                            onChange={handleChange}
                        />
                        <span className="custom-checkbox"></span>
                        Балкон
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
                    <label>Примечания:
                        <textarea name="additionalNotes" value={formData.additionalNotes || ''} onChange={handleChange} />
                    </label>

                    <div className="modal-buttons">
                        <button type="submit">💾 Сохранить</button>
                        <button type="button" onClick={onClose}>✖ Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreferenceEditModal;
