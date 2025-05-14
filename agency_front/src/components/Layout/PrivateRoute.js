import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Загрузка...</div>; // Пока не определено — не рендерим
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
