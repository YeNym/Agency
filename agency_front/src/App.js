import {Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import LoginPage from './pages/LoginPage';
import ManagerDashboard from './pages/ManagerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Layout/Header';
import "./styles/App.css"
import AboutPage from "./pages/AboutPage";
import CatalogPage from "./pages/CatalogPage";
import TravelersPage from "./pages/TravelersPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import Applications from "./pages/Applications";
import EditPropertyPage from "./pages/EditPropertyPage";
function App() {
    return (
        <AuthProvider>
            <div className="app-layout">
                <Header />
                <main className="content">
                    <Routes>
                        {/* Страница входа */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Приватные маршруты */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                            <Route path="/client-dashboard" element={<ClientDashboard />} />
                        </Route>

                        {/* Открытые страницы */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/travelers" element={<TravelersPage />} />
                        <Route path="/property/:id" element={<PropertyDetailPage />} />
                        <Route path="/application" element={<Applications/>} />

                        <Route path="/properties/:id/edit" element={<EditPropertyPage />} />

                        {/* Редирект на страницу входа, если не указано другое */}
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;