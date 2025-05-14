import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import * as userApi from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { ROLES, ROLE_REDIRECTS } from '../constants/roles';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Добавляем состояние для данных пользователя
    const [loading, setLoading] = useState(true); // Для отслеживания загрузки
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const { token, refreshToken } = await authApi.login(email, password);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            const userData = await userApi.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);

            // Редирект только здесь
            const redirectPath = ROLE_REDIRECTS[userData.role] || '/';
            console.log(`Redirecting ${userData.role} to ${redirectPath}`);
            navigate(redirectPath, { replace: true });

            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };


    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await userApi.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const register = async (userData) => {
        await authApi.register(userData);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};