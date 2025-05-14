import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getManagerByUserId } from '../api/managerService';
import "../styles/ManagerDashboardStyle.css";
import UserInfo from "../components/UserInfo";
import PropertyList from "../components/PropertyList";
import CreatePropertyForm from "../components/CreatePropertyForm";
import RegisterUser from "../components/RegisterUser";
import ClientList from "../components/ClientList";
import CreateHousingPreferences from "../components/CreateHousingPreferences";
import ManagerApplications from "../components/ManagerApplications";

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [properties, setProperties] = useState([]);

    const fetchManagerData = async () => {
        try {
            const managerData = await getManagerByUserId(user.id);
            setManager(managerData);
            localStorage.setItem("managerId", managerData.id);
            console.log("managerLocalSt",localStorage);
            console.log(managerData);
        } catch (err) {
            setError('Ошибка загрузки данных менеджера');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchManagerData();
        }
    }, [user?.id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="background-container">
            <div className="decorative-image-1"></div>
            <div className="decorative-image-2"></div>

            <div className="content-main">
                <UserInfo user={user} manager={manager} />

                <div className="advertisement-list-container">
                    <div className="advertisement-list">
                        <h1>Список недвижимости</h1>
                        <PropertyList manager={manager} />
                    </div>
                    <div className="form-container">
                        <CreatePropertyForm onSuccess={fetchManagerData} />
                    </div>
                    <div className="form-container">
                        <RegisterUser/>
                    </div>
                    <div className="client-list-container">
                        <ClientList managerId={manager.id} />
                    </div>
                    <div>
                        <CreateHousingPreferences managerId={manager.id}/>
                    </div>
                    <div className="application-list-container">
                        <h2>Заявки клиентов</h2>
                        <div className="ManagerApplications-container">
                            <ManagerApplications managerId={manager.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ManagerDashboard;