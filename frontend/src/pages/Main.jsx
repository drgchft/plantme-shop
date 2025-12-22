import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

const Main = () => {
  const features = [
    { icon: '🌿', title: 'Широкий ассортимент', desc: 'Более 100 видов растений' },
    { icon: '🚚', title: 'Быстрая доставка', desc: 'Доставка за 1-3 дня' },
    { icon: '🏷️', title: 'Доступные цены', desc: 'Растения от 500 рублей' },
    { icon: '📞', title: 'Поддержка', desc: 'Консультации по уходу' },
  ];

  return (
    <div className="main-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Растения для вашего дома и души</h1>
          <p>Найдите идеального зеленого друга среди нашего разнообразия комнатных растений</p>
          <Link to="/catalog">
            <button className="btn btn-primary btn-large">
              Перейти в каталог
            </button>
          </Link>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">🌵🌱🌿</div>
        </div>
      </section>

      <section className="features">
        <h2>Почему выбирают PlantMe?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="categories">
        <h2>Популярные категории</h2>
        <div className="categories-grid">
          {['Сукуленты', 'Кактусы', 'Цветущие', 'Декоративно-лиственные'].map((cat, idx) => (
            <Link to={`/catalog?category=${cat}`} key={idx} className="category-card">
              <div className="category-image">
                <div className="image-placeholder">{['🌵', '🌵', '🌸', '🍃'][idx]}</div>
              </div>
              <h3>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Main;