import React, { useState, useEffect } from 'react';
import { register } from '../api/authApi';
import { getPropertyEnums } from '../api/propertyService';
import { useAuth } from '../context/AuthContext';
import "../styles/RegisterUser.css";

const RegisterUser = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        patronymic: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        passport: '',
        accessLevel: '',
        department: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [allowedRoles, setAllowedRoles] = useState(['CLIENT']);
    const [accessLevels, setAccessLevels] = useState([]);
    const [isLoadingEnums, setIsLoadingEnums] = useState(true);

    useEffect(() => {
        const loadEnums = async () => {
            try {
                const enums = await getPropertyEnums();
                const levels = enums.accessLevels || [
                    { value: 'BASIC', label: 'Базовый' },
                    { value: 'TRAVELER', label: 'Путешественник' }
                ];

                setAccessLevels(levels);
                setFormData(prev => ({
                    ...prev,
                    accessLevel: levels[0]?.value || ''
                }));
            } catch (err) {
                console.error('Ошибка загрузки уровней доступа:', err);
                setError('Не удалось загрузить доступные уровни доступа');
            } finally {
                setIsLoadingEnums(false);
            }
        };

        const determineAllowedRoles = () => {
            if (!user) return;

            const userRoles = user.role || [];

            if (userRoles.includes('ADMIN')) {
                setAllowedRoles(['MANAGER', 'ADMIN']);
                // Не устанавливаем роль по умолчанию
            } else if (userRoles.includes('MANAGER')) {
                setAllowedRoles(['CLIENT']);
                setFormData(prev => ({ ...prev, role: 'CLIENT' }));
            } else if (userRoles.includes('CLIENT')) {
                setAllowedRoles(['CLIENT']);
            }
        };

        loadEnums();
        determineAllowedRoles();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role && !(user?.role?.includes('MANAGER'))) {
            setError('Пожалуйста, выберите роль');
            return;
        }
        // Проверка прав доступа
        const userRoles = user?.role || [];
        if (!user || userRoles.includes('CLIENT')) {
            setError('У вас нет прав для создания пользователей');
            return;
        }

        // Проверка для менеджеров (могут создавать только клиентов)
        if (userRoles.includes('MANAGER') && formData.role !== 'CLIENT') {
            setError('Менеджеры могут создавать только клиентов');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register(formData);
            // Очистка формы после успешной регистрации
            setFormData({
                firstname: '',
                lastname: '',
                patronymic: '',
                email: '',
                password: '',
                role: user?.role?.includes('MANAGER') ? 'CLIENT' : '', // Для менеджера снова ставим CLIENT
                phone: '',
                passport: '',
                accessLevel: accessLevels[0]?.value || '',
                department: ''
            });
            alert('Пользователь успешно зарегистрирован!');
        } catch (err) {
            let errorMessage = 'Ошибка регистрации';

            if (err.response) {
                // Если сервер вернул JSON { message: "..." }
                if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
                // Если сервер вернул просто строку
                else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            } else {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    // Если пользователь не авторизован или это клиент
    const userRoles = user?.role || [];
    if (!user || userRoles.includes('CLIENT')) {
        return (
            <div className="register-container">
                <h2>Регистрация пользователя</h2>
                <div className="error-message">У вас нет прав для создания пользователей</div>
            </div>
        );
    }

    return (
        <div className="register-container">
            <h2>Регистрация пользователя</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Отчество:</label>
                    <input
                        type="text"
                        name="patronymic"
                        value={formData.patronymic}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@example.com"
                        autoComplete="new-email"  // или "off"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-email"  // или "off"
                        minLength="6"
                    />
                </div>

                {formData.role === 'CLIENT' && (

                <div className="form-group">
                    <label>Телефон:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="\+7|8)[0-9]{10}$"
                        placeholder="+79512345678"
                    />
                </div>
                )}

                {formData.role === 'CLIENT' && (
                    <div className="form-group">
                    <label>Паспорт:</label>
                    <input
                        type="text"
                        name="passport"
                        value={formData.passport}
                        onChange={handleChange}
                        required
                        pattern="^[0-9]{4}\s[0-9]{6}$"
                        placeholder="1234 567890"
                    />
                </div>
                )}

                <div className="form-group">
                    <label>Роль:</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        disabled={allowedRoles.length === 1}
                    >
                        <option value="">-- Выберите роль --</option>
                        {allowedRoles.map(role => (
                            <option key={role} value={role}>
                                {role === 'CLIENT' && 'Клиент'}
                                {role === 'MANAGER' && 'Менеджер'}
                                {role === 'ADMIN' && 'Администратор'}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.role === 'MANAGER' && (
                    <div className="form-group">
                        <label>Отдел:</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required={formData.role === 'MANAGER'}
                        />
                    </div>
                )}
                {formData.role === 'CLIENT' && (
                <div className="form-group">
                    <label>Уровень доступа:</label>
                    {isLoadingEnums ? (
                        <div>Загрузка уровней доступа...</div>
                    ) : (
                        <select
                            name="accessLevel"
                            value={formData.accessLevel}
                            onChange={handleChange}
                            required
                        >
                            {accessLevels.map(level => (
                                <option key={level.value} value={level.value}>
                                    {level.label || level.value}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                )}
                <button
                    type="submit"
                    disabled={loading || isLoadingEnums}
                    className="submit-button"
                >
                    {loading ? 'Регистрация...' : 'Зарегистрировать'}
                </button>
            </form>
        </div>
    );
};

export default RegisterUser;