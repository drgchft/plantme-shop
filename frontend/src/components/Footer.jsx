import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PlantMe 🌱</h3>
            <p>Магазин домашних растений для вашего уюта</p>
            <p>Доставляем растения по всей России</p>
          </div>
          
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/about-us">О нас</Link></li>
              <li><Link to="/login">Войти</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Контакты</h4>
            <ul>
              <li>📞 +7 (999) 123-45-67</li>
              <li>📧 info@plantme.ru</li>
              <li>📍 Москва, ул. Цветочная, 15</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Документы</h4>
            <ul>
              <li><Link to="/privacy">Политика конфиденциальности</Link></li>
              <li><Link to="/offer">Договор оферты</Link></li>
              <li><Link to="/agreement">Согласие на обработку данных</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {currentYear} PlantMe. Все права защищены.</p>
          <p>Сайт создан в учебных целях</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;