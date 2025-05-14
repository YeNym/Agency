import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getClientByUserId } from '../api/ClientService';
import UserInfo from "../components/UserInfo";
import "../styles/ManagerDashboardStyle.css"
import AccessiblePropertiesList from "../components/AccessiblePropertiesList";

const ClientDashboard = () => {
    const { user } = useAuth();
    const [clientData, setClientData] = useState(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                if (user?.id) {
                    const data = await getClientByUserId(user.id);
                    setClientData(data);
                    console.log(data);
                    localStorage.setItem('clientId', data.id); // Сохраняем ID клиента
                    console.log("id", data.id);

                    console.log("accessLevel", data.accessLevel);
                }
            } catch (error) {
                console.error("Ошибка при получении данных клиента:", error);
            }
        };

        fetchClientData();
    }, [user]);

    return (
        <div className="background-container">
            <div className="decorative-image-1"></div>
            <div className="decorative-image-2"></div>
            <div className="content-main">

            <UserInfo user={user} manager={clientData} />

            {clientData?.id && (
                <div className="accessible_properties">
                    <h3>Доступные квартиры</h3>
                    <AccessiblePropertiesList clientId={clientData.id} />
                </div>
            )}




            {/*{clientData && (*/}
            {/*    <span>*/}
            {/*        Уровень доступа: {clientData.accessLevel}*/}
            {/*    </span>*/}
            {/*)}*/}
        </div>
        </div>
    );
};

export default ClientDashboard;
