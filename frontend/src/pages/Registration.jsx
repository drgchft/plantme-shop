import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
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

  // Варианты пола
  const genderOptions = [
    { value: 'M', label: 'Мужской', icon: '♂' },
    { value: 'F', label: 'Женский', icon: '♀' },
    { value: 'U', label: 'Не указан', icon: '○' },
  ];

  // Проверка силы пароля
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const strength = Object.values(requirements).filter(Boolean).length;
    const messages = [
      'Очень слабый',
      'Слабый',
      'Средний',
      'Хороший',
      'Отличный',
      'Отличный'
    ];

    return {
      strength: strength,
      level: messages[strength],
      requirements: requirements,
      color: strength <= 1 ? '#e74c3c' : 
             strength <= 2 ? '#f39c12' : 
             strength <= 3 ? '#f1c40f' : 
             strength <= 4 ? '#2ecc71' : '#27ae60'
    };
  };

  // Маска для телефона
  const applyPhoneMask = (value) => {
    const numbers = value.replace(/[^\d+]/g, '');
    
    if (!numbers.startsWith('+7') && !numbers.startsWith('7') && !numbers.startsWith('8')) {
      return numbers;
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
    
    if (name === 'phone') {
      const maskedValue = applyPhoneMask(value);
      setFormData(prev => ({ ...prev, [name]: maskedValue }));
      
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
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
    
    if (!formData.username) newErrors.username = 'Обязательное поле';
    else if (formData.username.length < 3) newErrors.username = 'Минимум 3 символа';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Только латиница, цифры и _';
    
    if (!formData.nickname) newErrors.nickname = 'Обязательное поле';
    
    if (!formData.firstName) newErrors.firstName = 'Обязательное поле';
    if (!formData.lastName) newErrors.lastName = 'Обязательное поле';
    
    if (!formData.email) newErrors.email = 'Обязательное поле';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Неверный email';
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone) newErrors.phone = 'Обязательное поле';
    else if (phoneDigits.length < 11) newErrors.phone = 'Введите полный номер телефона (+7 XXX XXX-XX-XX)';
    
    if (!formData.password) newErrors.password = 'Обязательное поле';
    else if (formData.password.length < 6) newErrors.password = 'Минимум 6 символов';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Подтвердите пароль';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    
    if (!formData.agreePersonal) newErrors.agreePersonal = 'Необходимо согласие';
    if (!formData.agreeOffer) newErrors.agreeOffer = 'Необходимо согласие';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'Необходимо согласие';
    
    return newErrors;
  };

  // Открыть документ
  const openDocument = (title) => {
    setModalTitle(title);
    setModalContent(`<div style="padding: 20px; line-height: 1.6;">
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
        if (onLogin) {
          onLogin(data.user, data.token);
        }
        navigate('/');
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

  const passwordStrength = checkPasswordStrength(formData.password);

  return (
    <div className="registration-page">
      <div className="registration-form">
        <div className="form-title">
          <h2>Регистрация</h2>
          <p>Создайте аккаунт в PlantMe</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Логин и никнейм */}
          <div className="form-row">
            <div className="form-field">
              <label>Логин *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john_doe"
                required
              />
              <small>Только латиница, цифры и _, минимум 3 символа</small>
              {errors.username && <div className="error-text">{errors.username}</div>}
            </div>
            
            <div className="form-field">
              <label>Никнейм *</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Отображаемое имя"
                required
              />
              <small>Будет виден другим пользователям</small>
              {errors.nickname && <div className="error-text">{errors.nickname}</div>}
            </div>
          </div>
          
          {/* Имя и фамилия */}
          <div className="form-row">
            <div className="form-field">
              <label>Имя *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Иван"
                required
              />
              {errors.firstName && <div className="error-text">{errors.firstName}</div>}
            </div>
            
            <div className="form-field">
              <label>Фамилия *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Иванов"
                required
              />
              {errors.lastName && <div className="error-text">{errors.lastName}</div>}
            </div>
          </div>
          
          {/* Отчество */}
          <div className="form-field">
            <label>Отчество</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Иванович (необязательно)"
            />
          </div>
          
          {/* Пол - НОВЫЙ ИНТЕРФЕЙС ВЫБОРА */}
          <div className="gender-section">
            <label className="gender-label">Пол *</label>
            <div className="gender-options-container">
              {genderOptions.map((option) => (
                <div
                  key={option.value}
                  className={`gender-card ${formData.gender === option.value ? 'selected' : ''}`}
                  onClick={() => handleGenderSelect(option.value)}
                >
                  <div className="gender-card-content">
                    <div className="gender-icon">
                      {option.icon}
                    </div>
                    <div className="gender-name">
                      {option.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Email и телефон */}
          <div className="form-row">
            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ivan@example.com"
                required
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
            
            <div className="form-field">
              <label>Телефон *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (XXX) XXX-XX-XX"
                required
              />
              <small>Введите номер в любом формате, маска применится автоматически</small>
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>
          </div>
          
          {/* Пароли - улучшенный интерфейс */}
          <div className="password-section">
            {/* Пароль */}
            <div className="password-field">
              <label>Пароль *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Минимум 6 символов"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Индикатор силы пароля */}
              {formData.password && (
                <div className="password-strength">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: passwordStrength.color
                  }}>
                    <div>Сила пароля: <strong>{passwordStrength.level}</strong></div>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      background: '#eee',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        height: '100%',
                        background: passwordStrength.color,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>
            
            {/* Подтверждение пароля */}
            <div className="password-field">
              <label>Подтверждение пароля *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Повторите пароль"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>
            
            {/* Требования к паролю */}
            <div className="password-requirements">
              <h5>Требования к паролю:</h5>
              <ul>
                <li className={formData.password.length >= 6 ? 'valid' : ''}>
                  Минимум 6 символов
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы одна заглавная буква
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы одна строчная буква
                </li>
                <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы одна цифра
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы один специальный символ
                </li>
              </ul>
            </div>
          </div>
          
          {/* Согласия */}
          <div style={{ marginTop: '10px', textAlign: 'left' }}>
            <div className="checkbox-field">
              <input
                type="checkbox"
                id="agreePersonal"
                name="agreePersonal"
                checked={formData.agreePersonal}
                onChange={handleChange}
              />
              <label htmlFor="agreePersonal">
                Соглашаюсь на{' '}
                <button 
                  type="button" 
                  className="checkbox-link"
                  onClick={() => openDocument('Обработка персональных данных')}
                >
                  обработку персональных данных
                </button>
              </label>
            </div>
            {errors.agreePersonal && <div className="error-text" style={{ marginLeft: '24px' }}>{errors.agreePersonal}</div>}
            
            <div className="checkbox-field">
              <input
                type="checkbox"
                id="agreeOffer"
                name="agreeOffer"
                checked={formData.agreeOffer}
                onChange={handleChange}
              />
              <label htmlFor="agreeOffer">
                Принимаю условия{' '}
                <button 
                  type="button" 
                  className="checkbox-link"
                  onClick={() => openDocument('Договор оферты')}
                >
                  договора оферты
                </button>
              </label>
            </div>
            {errors.agreeOffer && <div className="error-text" style={{ marginLeft: '24px' }}>{errors.agreeOffer}</div>}
            
            <div className="checkbox-field">
              <input
                type="checkbox"
                id="agreePrivacy"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
              />
              <label htmlFor="agreePrivacy">
                Ознакомлен с{' '}
                <button 
                  type="button" 
                  className="checkbox-link"
                  onClick={() => openDocument('Политика конфиденциальности')}
                >
                  политикой конфиденциальности
                </button>
              </label>
            </div>
            {errors.agreePrivacy && <div className="error-text" style={{ marginLeft: '24px' }}>{errors.agreePrivacy}</div>}
          </div>
          
          {/* Кнопка отправки */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          {/* Ссылка на вход */}
          <div className="login-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </form>
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