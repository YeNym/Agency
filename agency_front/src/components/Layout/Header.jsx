import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Добавлен useNavigate
import { ROLES } from '../../constants/roles';
import "../../styles/Header.css";
import {useEffect, useState} from "react";
import {getClientByUserId} from "../../api/ClientService";

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [client, setClient] = useState(null);
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        const fetchClient = async () => {
            if (user?.role === ROLES.CLIENT) {
                try {
                    const clientData = await getClientByUserId(user.id);
                    setClient(clientData);
                } catch (error) {
                    console.error('Ошибка при получении данных клиента:', error);
                }
            }
        };

        fetchClient();
    }, [user]);

    const handleLogout = () => {
        logout(); // Вызываем функцию выхода
        navigate('/login'); // Перенаправляем на страницу авторизации
    };

    return (
        <header className="header">
            <div className="header-container">
                <nav className="header-nav">
                    <span className="header-title">Agency App</span>

                    {isAuthenticated ? (
                        <div className="header-auth-container">
                            {user?.role === ROLES.ADMIN && (
                                <Link to="/admin-dashboard" className="header-button">
                                    Профиль
                                </Link>
                            )}
                            {user?.role === ROLES.MANAGER && (
                                <Link to="/manager-dashboard" className="header-button">
                                    Менеджер
                                </Link>
                            )}
                            {user?.role === ROLES.CLIENT && (
                                <Link to="/client-dashboard" className="header-button">
                                    Клиент
                                </Link>
                            )}

                            <Link to="/about" className="header-button">
                                <span>о компании</span>
                            </Link>

                            {user?.role !== ROLES.CLIENT && (
                                <>
                                    <Link to="/catalog" className="header-button">
                                        <span>каталог</span>
                                    </Link>
                                    <Link to="/application" className="header-button">
                                        <span>заявки</span>
                                    </Link>
                                </>
                            )}

                            {user?.role === ROLES.CLIENT && client?.accessLevel === 'TRAVELER' && (
                                <Link to="/travelers" className="header-button">
                                    <span>путешественники</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="header-link">
                            Вход
                        </Link>
                    )}
                </nav>
                {isAuthenticated && (
                    <button onClick={handleLogout} className="header-button">
                        Выйти
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;