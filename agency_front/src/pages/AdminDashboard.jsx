import { Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import UserInfo from "../components/UserInfo";
import RegisterUser from "../components/RegisterUser";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/userApi";  // Импортируем функцию getCurrentUser

const AdminDashboard = () => {
    const { user } = useAuth();  // Получаем данные текущего пользователя из контекста (если нужно)
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const data = await getCurrentUser();  // Вызов функции получения данных о текущем пользователе
                setAdmin(data);  // Сохраняем данные пользователя в состояние
                setLoading(false);  // Завершаем загрузку
            } catch (err) {
                setError('Ошибка при загрузке данных пользователя');  // Обработка ошибки
                setLoading(false);  // Завершаем загрузку в случае ошибки
            }
        };

        fetchAdminData();  // Запускаем функцию получения данных
    }, []);  // Пустой массив зависимостей, чтобы запрос выполнялся только при монтировании компонента

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="background-container">
            <div className="decorative-image-1"></div>
            <div className="decorative-image-2"></div>

            <div className="content-main">
                {/* Отображаем информацию о текущем пользователе */}
                {admin && <UserInfo user={admin} />}

                <div className="advertisement-list-container">
                    <div className="form-container">
                        <RegisterUser />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
