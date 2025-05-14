import React from 'react';
import '../styles/AboutPage.css';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div>
        <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>

    <div className="about-page">
            <div className="about-hero">
                <h1>Ведущая риелторская компания</h1>
                <p>Мы помогаем людям найти жильё своей мечты уже более 10 лет</p>
            </div>

            <div className="about-section">
                <h2>Кто мы</h2>
                <p>
                    Наша компания — это команда опытных профессионалов в сфере недвижимости.
                    Мы работаем на рынке более 10 лет и предоставляем полный спектр услуг:
                    от аренды квартир до сопровождения сделок купли-продажи жилой и коммерческой недвижимости.
                </p>
            </div>

            <div className="about-section highlight">
                <h2>Наши ценности</h2>
                <ul>
                    <li><strong>Честность:</strong> открытые и прозрачные условия для каждого клиента</li>
                    <li><strong>Профессионализм:</strong> только квалифицированные риелторы</li>
                    <li><strong>Индивидуальный подход:</strong> мы учитываем потребности каждого клиента</li>
                </ul>
            </div>

            <div className="about-section">
                <h2>Почему выбирают нас</h2>
                <p>
                    ✅ Более <strong>1000 успешных сделок</strong><br/>
                    ✅ <strong>97%</strong> довольных клиентов<br/>
                    ✅ Широкая база объектов по всей стране<br/>
                    ✅ Поддержка на всех этапах сделки
                </p>
            </div>

            <div className="about-section contact-info">
                <h2>Свяжитесь с нами</h2>
                <p>
                    📍 г. Москва, ул. Примерная, д. 1<br/>
                    📞 +7 (495) 123-45-67<br/>
                    ✉️ info@realestate.ru
                </p>
            </div>
        </div></div>
    );
};

export default AboutPage;
