import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import Modal from '../components/Modal';
import '../styles/registration.css';

const Registration = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'U',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreePersonal: false,
    agreeOffer: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Маска для телефона
  const applyPhoneMask = (value) => {
    const numbers = value.replace(/[^\d+]/g, '');
    
    if (!numbers.startsWith('+7') && !numbers.startsWith('7') && !numbers.startsWith('8')) {
      return value;
    }
    
    const digits = numbers.replace(/\D/g, '');
    let formatted = '+7 ';
    const cleanDigits = digits.startsWith('7') ? digits.substring(1) : 
                       digits.startsWith('8') ? digits.substring(1) : 
                       digits;
    
    if (cleanDigits.length > 0) {
      formatted += `(${cleanDigits.substring(0, 3)}`;
    }
    
    if (cleanDigits.length >= 4) {
      formatted += `) ${cleanDigits.substring(3, 6)}`;
    }
    
    if (cleanDigits.length >= 7) {
      formatted += `-${cleanDigits.substring(6, 8)}`;
    }
    
    if (cleanDigits.length >= 9) {
      formatted += `-${cleanDigits.substring(8, 10)}`;
    }
    
    return formatted;
  };

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Обработка телефона с маской
    if (name === 'phone') {
      const maskedValue = applyPhoneMask(value);
      setFormData(prev => ({ ...prev, [name]: maskedValue }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очистка ошибки
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Выбор пола
  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    // Валидация логина
    if (!formData.username.trim()) {
      newErrors.username = 'Обязательное поле';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Только латиница, цифры и _';
    }
    
    // Валидация никнейма
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Обязательное поле';
    } else if (formData.nickname.length > 50) {
      newErrors.nickname = 'Максимум 50 символов';
    }
    
    // Валидация имени
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Обязательное поле';
    } else if (!/^[а-яА-ЯёЁ\s-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Только кириллица';
    }
    
    // Валидация фамилии
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Обязательное поле';
    } else if (!/^[а-яА-ЯёЁ\s-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Только кириллица';
    }
    
    // Валидация отчества
    if (formData.middleName && !/^[а-яА-ЯёЁ\s-]+$/.test(formData.middleName)) {
      newErrors.middleName = 'Только кириллица';
    }
    
    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Обязательное поле';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный email адрес';
    }
    
    // Валидация телефона
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Обязательное поле';
    } else if (phoneDigits.length < 11) {
      newErrors.phone = 'Введите полный номер телефона';
    }
    
    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Обязательное поле';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    
    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    // Валидация согласий
    if (!formData.agreePersonal) newErrors.agreePersonal = 'Необходимо согласие';
    if (!formData.agreeOffer) newErrors.agreeOffer = 'Необходимо согласие';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'Необходимо согласие';
    
    return newErrors;
  };

  // Открыть документ
  const openDocument = (title) => {
    setModalTitle(title);
    setModalContent(`<div class="document-content">
      <h4>${title}</h4>
      <p>Это текст документа "${title}". Здесь будут указаны все условия, правила и положения, которые пользователь должен принять при регистрации.</p>
      
      <h5>Основные положения:</h5>
      <ul>
        <li>Пользователь соглашается с условиями использования сервиса</li>
        <li>Подтверждает достоверность предоставленных данных</li>
        <li>Дает согласие на обработку персональных данных</li>
        <li>Принимает правила конфиденциальности</li>
      </ul>
      
      <h5>Важная информация:</h5>
      <p>Все данные защищены в соответствии с законодательством РФ. Мы не передаем ваши данные третьим лицам без вашего согласия.</p>
      
      <p><strong>Дата вступления в силу:</strong> 01 января 2024 года</p>
      <p><strong>Последнее обновление:</strong> 01 января 2024 года</p>
    </div>`);
    setShowModal(true);
  };

  // Отправить форму
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Подготовка данных для API
      const requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile: {
          nickname: formData.nickname,
          first_name: formData.firstName,
          last_name: formData.lastName,
          middle_name: formData.middleName,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
        }
      };
      
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Регистрация успешна
        setModalTitle('Регистрация успешна!');
        setModalContent('Ваш аккаунт успешно создан. Теперь вы можете войти в систему.');
        setShowModal(true);
        
        // Перенаправляем на страницу входа через 2 секунды
        setTimeout(() => {
          navigate('/login', { state: { registered: true } });
        }, 2000);
        
      } else {
        setModalTitle('Ошибка регистрации');
        setModalContent(data.errors || data.message || 'Произошла ошибка при регистрации');
        setShowModal(true);
      }
    } catch (error) {
      setModalTitle('Ошибка соединения');
      setModalContent('Не удалось подключиться к серверу. Проверьте подключение к интернету и убедитесь, что сервер запущен.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Варианты пола
  const genderOptions = [
    { value: 'M', label: 'Мужской', icon: '👨' },
    { value: 'F', label: 'Женский', icon: '👩' },
    { value: 'U', label: 'Не указан', icon: '🙂' },
  ];

  return (
    <div className="registration-page">
      <div className="container">
        
        {/* Информационная панель (сверху) */}
        <div className="registration-info">
          <div className="info-card">
            <div className="info-icon">🌿</div>
            <h2>Почему стоит присоединиться к PlantMe?</h2>
            <p className="info-description">
              Станьте частью нашего растущего сообщества любителей растений. 
              Откройте для себя мир домашнего садоводства и получите эксклюзивные преимущества.
            </p>
            <div className="info-features">
              <div className="feature">
                <div className="feature-icon">🌱</div>
                <div className="feature-content">
                  <h4>Персональные рекомендации</h4>
                  <p>Получите индивидуальные советы по уходу за вашими растениями</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🏷️</div>
                <div className="feature-content">
                  <h4>Специальные предложения</h4>
                  <p>Скидки и акции только для зарегистрированных пользователей</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">👥</div>
                <div className="feature-content">
                  <h4>Сообщество единомышленников</h4>
                  <p>Общайтесь, делитесь опытом и находите новых друзей</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Форма регистрации (широкая, по центру) */}
        <div className="registration-form-wrapper">
          <div className="form-header">
            <div className="form-icon">📝</div>
            <h1>Создание аккаунта</h1>
            <p className="form-subtitle">Заполните форму ниже, чтобы присоединиться к сообществу</p>
          </div>
          
          <form onSubmit={handleSubmit} className="registration-form">
            
            {/* Логин и никнейм */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username" className="label-required">
                  Логин
                </label>
                <div className="input-with-icon">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="john_doe"
                    className={errors.username ? 'error' : ''}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.username}
                  </div>
                )}
                <p className="form-hint">Только латиница, цифры и _, минимум 3 символа</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="nickname" className="label-required">
                  Никнейм
                </label>
                <div className="input-with-icon">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="Отображаемое имя"
                    className={errors.nickname ? 'error' : ''}
                    disabled={isLoading}
                  />
                </div>
                {errors.nickname && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.nickname}
                  </div>
                )}
                <p className="form-hint">Будет виден другим пользователям</p>
              </div>
            </div>
            
            {/* Имя и фамилия */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="label-required">
                  Имя
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Иван"
                  className={errors.firstName ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.firstName}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="label-required">
                  Фамилия
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Иванов"
                  className={errors.lastName ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.lastName}
                  </div>
                )}
              </div>
            </div>
            
            {/* Отчество */}
            <div className="form-group">
              <label htmlFor="middleName">
                Отчество
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Иванович (необязательно)"
                className={errors.middleName ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.middleName && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.middleName}
                </div>
              )}
            </div>
            
            {/* Пол - улучшенный интерфейс выбора */}
            <div className="form-group">
              <label className="label-required">Пол</label>
              <div className="gender-options-grid">
                {genderOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`gender-option-card ${formData.gender === option.value ? 'selected' : ''}`}
                    onClick={() => handleGenderSelect(option.value)}
                  >
                    <div className="gender-option-content">
                      <div className="gender-icon">{option.icon}</div>
                      <div className="gender-label">{option.label}</div>
                      {formData.gender === option.value && (
                        <div className="gender-check">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Email и телефон */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="label-required">
                  Email
                </label>
                <div className="input-with-icon">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ivan@example.com"
                    className={errors.email ? 'error' : ''}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.email}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="label-required">
                  Телефон
                </label>
                <div className="input-with-icon">
                  <Phone size={20} className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    className={errors.phone ? 'error' : ''}
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.phone}
                  </div>
                )}
                <p className="form-hint">Формат: +7 (XXX) XXX-XX-XX</p>
              </div>
            </div>
            
            {/* Пароли - один под другим */}
            <div className="password-fields">
              <div className="form-group">
                <label htmlFor="password" className="label-required">
                  Пароль
                </label>
                <div className="input-with-icon">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Минимум 6 символов"
                    className={errors.password ? 'error' : ''}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.password}
                  </div>
                )}
                <p className="form-hint">Используйте комбинацию букв, цифр и специальных символов</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="label-required">
                  Подтверждение пароля
                </label>
                <div className="input-with-icon">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Повторите пароль"
                    className={errors.confirmPassword ? 'error' : ''}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">
                    <AlertCircle size={14} /> {errors.confirmPassword}
                  </div>
                )}
                <p className="form-hint">Введите пароль еще раз для подтверждения</p>
              </div>
            </div>
            
            {/* Согласия */}
            <div className="agreements-section">
              <h3>Соглашения</h3>
              <div className={`form-checkbox ${errors.agreePersonal ? 'error' : ''}`}>
                <input
                  type="checkbox"
                  id="agreePersonal"
                  name="agreePersonal"
                  checked={formData.agreePersonal}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="agreePersonal">
                  Соглашаюсь на{' '}
                  <button 
                    type="button" 
                    className="doc-link"
                    onClick={() => openDocument('Обработка персональных данных')}
                    disabled={isLoading}
                  >
                    обработку персональных данных
                  </button>
                </label>
              </div>
              {errors.agreePersonal && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.agreePersonal}
                </div>
              )}
              
              <div className={`form-checkbox ${errors.agreeOffer ? 'error' : ''}`}>
                <input
                  type="checkbox"
                  id="agreeOffer"
                  name="agreeOffer"
                  checked={formData.agreeOffer}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="agreeOffer">
                  Принимаю условия{' '}
                  <button 
                    type="button" 
                    className="doc-link"
                    onClick={() => openDocument('Договор оферты')}
                    disabled={isLoading}
                  >
                    договора оферты
                  </button>
                </label>
              </div>
              {errors.agreeOffer && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.agreeOffer}
                </div>
              )}
              
              <div className={`form-checkbox ${errors.agreePrivacy ? 'error' : ''}`}>
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="agreePrivacy">
                  Ознакомлен с{' '}
                  <button 
                    type="button" 
                    className="doc-link"
                    onClick={() => openDocument('Политика конфиденциальности')}
                    disabled={isLoading}
                  >
                    политикой конфиденциальности
                  </button>
                </label>
              </div>
              {errors.agreePrivacy && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.agreePrivacy}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-register ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            
            <div className="login-link">
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Модальное окно для документов */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <div dangerouslySetInnerHTML={{ __html: modalContent }} />
      </Modal>
    </div>
  );
};

export default Registration;
