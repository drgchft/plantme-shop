import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Leaf, Truck, Shield, Phone, Mail, MapPin, Clock, Heart, MessageSquare, Target, Award, Globe, Users as UsersIcon } from 'lucide-react';
import '../styles/about.css';

const About = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Форма отправлена:', contactForm);
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const teamMembers = [
    { 
      id: 1, 
      name: 'Анна Иванова', 
      role: 'Основатель, биолог', 
      avatar: '👩‍🔬', 
      bio: '15 лет в ботанике, автор книг по уходу за растениями. Создала PlantMe чтобы делиться любовью к растениям с каждым.',
      experience: '15+ лет'
    },
    { 
      id: 2, 
      name: 'Михаил Петров', 
      role: 'Дизайнер оранжерей', 
      avatar: '👨‍🎨', 
      bio: 'Создаёт уникальные растительные композиции и помогает клиентам подбирать идеальные растения для их интерьеров.',
      experience: '8+ лет'
    },
    { 
      id: 3, 
      name: 'Елена Сидорова', 
      role: 'Консультант по уходу', 
      avatar: '👩‍🌾', 
      bio: 'Помогает подобрать растения и уход для каждого клиента. Автор блога о комнатных растениях с 10 000+ подписчиков.',
      experience: '12+ лет'
    },
    { 
      id: 4, 
      name: 'Алексей Козлов', 
      role: 'Логистика и доставка', 
      avatar: '👨‍💼', 
      bio: 'Обеспечивает безопасную доставку растений по всей России. Разработал уникальную систему упаковки для растений.',
      experience: '7+ лет'
    },
  ];

  const values = [
    { 
      icon: <Leaf size={32} />, 
      title: 'Экологичность', 
      description: 'Используем только экологичные материалы для упаковки и выращивания растений. Поддерживаем местных производителей.'
    },
    { 
      icon: <Heart size={32} />, 
      title: 'Любовь к растениям', 
      description: 'Каждое растение получает индивидуальный уход перед отправкой. Мы заботимся о них как о собственных.'
    },
    { 
      icon: <Shield size={32} />, 
      title: 'Гарантия качества', 
      description: '30 дней на возврат и бесплатную замену растения при необходимости. Все растения проходят строгий контроль.'
    },
    { 
      icon: <UsersIcon size={32} />, 
      title: 'Сообщество', 
      description: 'Создаём площадку для обмена опытом между любителями растений. Проводим мастер-классы и встречи.'
    },
    { 
      icon: <Target size={32} />, 
      title: 'Инновации', 
      description: 'Внедряем современные технологии в уходе за растениями. Разрабатываем умные системы полива и ухода.'
    },
    { 
      icon: <Award size={32} />, 
      title: 'Профессионализм', 
      description: 'Наша команда состоит из сертифицированных специалистов с многолетним опытом работы с растениями.'
    },
  ];

  const stats = [
    { id: 1, icon: '🌿', number: '5000+', label: 'Довольных клиентов' },
    { id: 2, icon: '🏪', number: '5', label: 'Лет на рынке' },
    { id: 3, icon: '🚚', number: '15 000+', label: 'Доставленных растений' },
    { id: 4, icon: '🌱', number: '100+', label: 'Видов растений' },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>О PlantMe — вашем магазине растений</h1>
            <p className="about-hero-description">
              Мы создаём зелёные уголки в домах и офисах уже более 5 лет. 
              Наша миссия — сделать заботу о растениях простой и приятной для каждого.
            </p>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="about-story-content">
            <h2>Наша история</h2>
            <div className="about-story-text">
              <p>
                Всё началось в 2019 году, когда основательница Анна Иванова, профессиональный биолог, 
                заметила, как сложно людям найти качественные растения и получить грамотные советы по уходу. 
                Её маленькая домашняя оранжерея на балконе превратилась в первую теплицу, а затем — в полноценный магазин.
              </p>
              <p>
                Сегодня PlantMe — это не просто магазин растений, а сообщество единомышленников. 
                Мы объединяем профессионалов ботаники, дизайнеров интерьеров и просто любителей растений. 
                Каждое растение, которое покидает нашу теплицу, проходит тщательный отбор и получает 
                индивидуальный уход перед отправкой к новому хозяину.
              </p>
              <p>
                Мы верим, что растения делают жизнь лучше. Они очищают воздух, создают уют, 
                снижают стресс и приносят радость. Наша цель — помочь каждому найти своего 
                зелёного друга и научиться заботиться о нём с любовью.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map(stat => (
              <div key={stat.id} className="about-stat-card">
                <div className="about-stat-card-icon">{stat.icon}</div>
                <div className="about-stat-card-number">{stat.number}</div>
                <div className="about-stat-card-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <div className="container">
          <div className="about-section-header">
            <h2>Наша команда</h2>
            <p className="about-section-description">
              Профессионалы, которые с любовью заботятся о каждом растении и помогают вам создавать зелёные оазисы
            </p>
          </div>
          
          <div className="about-team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="about-team-member">
                <div className="about-member-image">
                  {member.avatar}
                </div>
                <div className="about-member-info">
                  <h3 className="about-member-name">{member.name}</h3>
                  <div className="about-member-role">{member.role}</div>
                  <p className="about-member-bio">{member.bio}</p>
                  <div className="about-member-experience">
                    <strong>Опыт:</strong> {member.experience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <div className="about-section-header">
            <h2>Наши ценности</h2>
            <p className="about-section-description">
              Принципы, которые лежат в основе всего, что мы делаем
            </p>
          </div>
          
          <div className="about-values-grid">
            {values.map((value, index) => (
              <div key={index} className="about-value-card">
                <div className="about-value-icon">
                  {value.icon}
                </div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contact-section">
        <div className="container">
          <div className="about-section-header">
            <h2>Свяжитесь с нами</h2>
            <p className="about-section-description">
              Есть вопросы или предложения? Мы всегда рады помочь и выслушать вас
            </p>
          </div>
          
          <div className="about-contact-content">
            <div className="about-contact-info">
              <h3>Контактная информация</h3>
              <ul className="about-contact-list">
                <li className="about-contact-item">
                  <div className="about-contact-icon">
                    <Phone size={24} />
                  </div>
                  <div className="about-contact-details">
                    <h4>Телефон</h4>
                    <p>+7 (999) 123-45-67</p>
                    <p>Ежедневно с 9:00 до 21:00</p>
                  </div>
                </li>
                <li className="about-contact-item">
                  <div className="about-contact-icon">
                    <Mail size={24} />
                  </div>
                  <div className="about-contact-details">
                    <h4>Email</h4>
                    <p>info@plantme.ru</p>
                    <p>Отвечаем в течение 24 часов</p>
                  </div>
                </li>
                <li className="about-contact-item">
                  <div className="about-contact-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="about-contact-details">
                    <h4>Адрес</h4>
                    <p>г. Москва, ул. Цветочная, 15</p>
                    <p>Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-18:00</p>
                  </div>
                </li>
                <li className="about-contact-item">
                  <div className="about-contact-icon">
                    <Clock size={24} />
                  </div>
                  <div className="about-contact-details">
                    <h4>Время работы магазина</h4>
                    <p>Понедельник - Пятница: 10:00 - 20:00</p>
                    <p>Суббота - Воскресенье: 11:00 - 18:00</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="about-contact-form-container">
              <h3>Напишите нам</h3>
              <form className="about-contact-form" onSubmit={handleSubmit}>
                <div className="about-form-group">
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Иван Иванов"
                  />
                </div>
                
                <div className="about-form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@mail.ru"
                  />
                </div>
                
                <div className="about-form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
                
                <div className="about-form-group">
                  <label htmlFor="message">Сообщение *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Расскажите, чем мы можем вам помочь..."
                  />
                </div>
                
                <button type="submit" className="btn btn-primary about-btn-large">
                  <MessageSquare size={20} />
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-content">
            <h2>Присоединяйтесь к нашему зеленому сообществу</h2>
            <p className="about-cta-description">
              Подписывайтесь на наши соцсети, участвуйте в мастер-классах 
              и получайте полезные советы по уходу за растениями
            </p>
            <div className="about-cta-buttons">
              <Link to="/catalog" className="btn btn-light about-btn-large">
                Перейти в каталог
              </Link>
              <Link to="/registration" className="btn btn-outline-light about-btn-large">
                Зарегистрироваться
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;