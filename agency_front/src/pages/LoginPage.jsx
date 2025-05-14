import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/LoginForm.css"

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth(); // Добавляем isAuthenticated
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // navigate('/');
        } catch (err) {
            setError('Неверный email или пароль');
        }
    };
// Добавляем отладочный вывод
    useEffect(() => {
        console.log('LoginPage auth state:', isAuthenticated);
    }, [isAuthenticated]);

    return (
        <div className="wrapper">
            <div className="container">
                <h1>Авторизация</h1>
                {error && <div className="error-message">{error}</div>}

                <form className="form" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="log-button" type="submit" id="login-button">Войти</button>
                </form>
            </div>
            <ul className="bg-bubbles">
                {[...Array(10)].map((_, i) => (
                    <li key={i}></li>
                ))}
            </ul>
        </div>
    );
};

export default LoginPage;