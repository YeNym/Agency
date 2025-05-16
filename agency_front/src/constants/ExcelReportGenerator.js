import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { getClientsByManager, getHousingPreferences, getUserByClientId } from '../api/ClientService';

const ExcelReportButton = ({ managerId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsLoading(true);
            const clients = await getClientsByManager(managerId);
            console.log('Clients:', JSON.stringify(clients, null, 2));
            const data = await Promise.all(
                clients.map(async (client) => {
                    const [userData, preferences] = await Promise.all([
                        getClientUser(client.id),
                    ]);

                    return {
                        ...client,
                        ...userData,
                        preferences
                    };
                })
            );
console.log(data)
            const worksheet = utils.json_to_sheet(
                data.map(client => ({
                    'Статус': client.accessLevel || 'Не указан',
                    'ФИО': client.fullName,
                    'Телефон': client.phone ?? 'Не указано', // Берем из клиента
                    'Email': client.authUser?.email ?? 'Не указано', // Берем email из authUser
                    'Паспорт': client.passport ?? 'Не указано', // Берем из клиента

                }))
            );

            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, 'Клиенты');

            // 4. Скачиваем файл
            writeFile(workbook, `clients_report_${new Date().toISOString().slice(0,10)}.xlsx`);

        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось сформировать отчет');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            style={{
                padding: '10px 20px',
                background: isLoading ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            {isLoading ? 'Формируем отчет...' : 'Скачать отчет в Excel'}
        </button>
    );
};

const getClientUser = async (clientId) => {
    try {
        const userData = await getUserByClientId(clientId);

        // Формируем только ФИО
        const fullNameParts = [
            userData.lastname,
            userData.firstname,
            userData.patronymic
        ].filter(Boolean);

        return {
            fullName: fullNameParts.join(' ') || 'Не указано',
            email: userData.email ?? 'Не указано' // Добавлено поле email

        };
    } catch (e) {
        return {
            fullName: 'Не указано',
            email: 'Не указано' // Добавлено поле email

        };
    }
};


export default ExcelReportButton;