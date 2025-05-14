import React from 'react';
import "../styles/ManagerDashboardStyle.css";

const UserInfo = ({ user, manager }) => {
    return (
        <div className="user-info">
            <div className="user-info-container">
                <div className="avatar-container">
                    <div className="avatar-circle">
                        {user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}
                    </div>
                </div>
                <div className="user-name">
                    <div className="user-name">
                        {user?.firstname} {user?.lastname}
                    </div>
                    <div className="user-role">
                        {user?.role === 'manager' ? 'Менеджер' : user?.role}
                    </div>
                </div>
            </div>
            <div className="dop-info">
                {manager?.department && (
                    <div className="manager-info">
                        Отдел: {manager.department}
                    </div>
                )}
                <div className="manager-info">
                    {user.email}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;