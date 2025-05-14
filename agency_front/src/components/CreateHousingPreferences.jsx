import React, { useEffect, useState } from 'react';
import { createHousingPreferences } from '../api/ClientService';
import { getClientsByManager } from '../api/ClientService';
import "../styles/CreateHousingPreferencesStyle.css"
const CreateHousingPreferences = ({ managerId }) => {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');

    const [formData, setFormData] = useState({
        minArea: '',
        maxArea: '',
        minPrice: '',
        maxPrice: '',
        roomsCount: '',
        hasBalcony: false,
        allowPets: false,
        additionalNotes: '',
        city: '',
        district: '',
        street: ''

    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClientsByManager(managerId);
                setClients(data);
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error);
                setMessage('Ошибка загрузки списка клиентов');
            }
        };

        if (managerId) {
            fetchClients();
        }
    }, [managerId]);

    const handleClientChange = (e) => {
        setSelectedClientId(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedClientId) {
            setMessage('Пожалуйста, выберите клиента');
            return;
        }
        console.log('Выбранный клиент ID:', selectedClientId);
        // Подготовка данных для отправки
        const requestData = {

            minArea: formData.minArea ? parseInt(formData.minArea) : null,
            maxArea: formData.maxArea ? parseInt(formData.maxArea) : null,
            minPrice: formData.minPrice ? parseInt(formData.minPrice) : null,
            maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : null,
            roomsCount: formData.roomsCount ? parseInt(formData.roomsCount) : null,
            hasBalcony: formData.hasBalcony,
            allowPets: formData.allowPets,
            additionalNotes: formData.additionalNotes,
            city: formData.city,
            district: formData.district,
            street: formData.street,
            client: {
                id: selectedClientId
            }



        };
        console.log("Данные, отправляемые на сервер:", requestData);

        try {
            await createHousingPreferences(selectedClientId, requestData);
            setMessage('Предпочтения успешно сохранены!');
            // Очистка формы
            setFormData({
                minArea: '',
                maxArea: '',
                minPrice: '',
                maxPrice: '',
                roomsCount: '',
                hasBalcony: false,
                allowPets: false,
                additionalNotes: '',
                city: '',
                district: '',
                street: ''
            });
        }catch (error) {
            console.error('Ошибка при сохранении предпочтений:', error);
            if (error.response) {
                console.error('Ответ сервера:', error.response.data);
                setMessage(`Ошибка: ${error.response.data.message || 'Неизвестная ошибка'}`);
            } else {
                setMessage('Ошибка при сохранении предпочтений');
            }
        }

    };

    return (
        <div className="housing-preferences-form">
            <h2>Создание жилищных предпочтений</h2>

            <div className="form-group">
                <label>Клиент:</label>
                <select
                    value={selectedClientId}
                    onChange={handleClientChange}
                    required
                >
                    <option value="">-- Выберите клиента --</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.authUser ? `${client.authUser.lastname} ${client.authUser.firstname}` : `Клиент #${client.id}`}
                        </option>
                    ))}
                </select>
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-cont">
                        <div className="form-group">
                            <label>Город:</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Район:</label>
                            <input type="text" name="district" value={formData.district} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-cont">

                    <div className="form-group">
                        <label>Улица:</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Количество комнат:</label>
                        <input type="number" name="roomsCount" value={formData.roomsCount} onChange={handleChange} min="1" />
                    </div>
                    </div>
                    <div className="form-cont">
                        <div className="form-group">
                            <label>Минимальная площадь (м²):</label>
                            <input type="number" name="minArea" value={formData.minArea} onChange={handleChange} min="1" />
                        </div>
                        <div className="form-group">
                            <label>Максимальная площадь (м²):</label>
                            <input type="number" name="maxArea" value={formData.maxArea} onChange={handleChange} min={formData.minArea || "1"} />
                        </div>

                    </div>
                    <div className="form-cont">
                        <div className="form-group">
                            <label>Минимальная цена:</label>
                            <input type="number" name="minPrice" value={formData.minPrice} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group">
                            <label>Максимальная цена:</label>
                            <input type="number" name="maxPrice" value={formData.maxPrice} onChange={handleChange} min={formData.minPrice || "0"} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Дополнительные пожелания:</label>
                        <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows="3" />
                    </div>
                </div>


                <div className="form-row">

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



                <button type="submit" className="submit-button">Сохранить предпочтения</button>
            </form>

            {message && (
                <div className={`message ${message.includes('Ошибка') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default CreateHousingPreferences;