import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import '../styles/login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Для восстановления пароля
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Проверяем, если нас перенаправили с регистрации
  React.useEffect(() => {
    if (location.state?.registered) {
      setModalTitle('Регистрация успешна!');
      setModalContent('Ваш аккаунт успешно создан. Теперь вы можете войти.');
      setShowModal(true);
    }
  }, [location.state]);

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очистка ошибки
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Валидация формы входа
  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Введите логин или email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    return newErrors;
  };

  // Валидация email для восстановления
  const validateEmail = (email) => {
    if (!email.trim()) return 'Введите email адрес';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Введите корректный email адрес';
    return '';
  };

  // Отправить форму входа
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Здесь будет реальный запрос к API
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Сохраняем данные
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Вызываем колбэк onLogin
        if (onLogin) {
          onLogin(data.user, data.token);
        }
        
        // Перенаправляем на главную или сохранённый путь
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
        
      } else {
        setModalTitle('Ошибка входа');
        setModalContent(data.error || data.message || 'Неверный логин или пароль');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setModalTitle('Ошибка соединения');
      setModalContent('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Восстановление пароля
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(resetEmail);
    if (emailError) {
      setModalTitle('Ошибка');
      setModalContent(emailError);
      setShowModal(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Имитация отправки запроса
      const response = await fetch('http://localhost:8000/api/users/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetSuccess(true);
        setModalTitle('Успешно');
        setModalContent('Инструкции по восстановлению пароля отправлены на ваш email. Проверьте вашу почту.');
        setShowModal(true);
        
      } else {
        setModalTitle('Ошибка');
        setModalContent(data.error || data.message || 'Пользователь с таким email не найден');
        setShowModal(true);
      }
      
    } catch (error) {
      setModalTitle('Ошибка');
      setModalContent('Не удалось отправить запрос. Пожалуйста, попробуйте позже.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Вход через социальные сети
  const handleSocialLogin = (provider) => {
    setModalTitle('Вход через ' + provider);
    setModalContent(`Функция входа через ${provider} находится в разработке. Пожалуйста, используйте стандартную форму входа.`);
    setShowModal(true);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          
          {!showForgotPassword ? (
            // Форма входа
            <div className="login-form-wrapper">
              <div className="form-header">
                <div className="form-icon">🔑</div>
                <h1>Вход в аккаунт</h1>
                <p className="form-subtitle">Добро пожаловать обратно в PlantMe</p>
              </div>
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="username" className="label-required">
                    Логин или Email
                  </label>
                  <div className="input-with-icon">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Введите логин или email"
                      className={errors.username ? 'error' : ''}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <div className="error-message">
                      <AlertCircle size={14} /> {errors.username}
                    </div>
                  )}
                </div>
                
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
                      placeholder="Введите пароль"
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
                </div>
                
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span>Запомнить меня</span>
                  </label>
                  
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                    disabled={isLoading}
                  >
                    Забыли пароль?
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className={`btn btn-login ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                </button>
                
                <div className="form-divider">
                  <span>Или войдите через</span>
                </div>
                
                <div className="social-login">
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                  >
                    <span className="social-icon">G</span>
                    Google
                  </button>
                  <button
                    type="button"
                    className="social-btn vk-btn"
                    onClick={() => handleSocialLogin('VK')}
                    disabled={isLoading}
                  >
                    <span className="social-icon">VK</span>
                    ВКонтакте
                  </button>
                </div>
                
                <div className="register-link">
                  Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
                </div>
              </form>
            </div>
          ) : (
            // Форма восстановления пароля
            <div className="forgot-password-form">
              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setResetSuccess(false);
                }}
                disabled={isLoading}
              >
                ← Назад ко входу
              </button>
              
              <div className="form-header">
                <div className="form-icon">🔐</div>
                <h1>Восстановление пароля</h1>
                <p className="form-subtitle">
                  {resetSuccess 
                    ? 'Проверьте вашу почту' 
                    : 'Введите email, указанный при регистрации'
                  }
                </p>
              </div>
              
              {!resetSuccess ? (
                <form onSubmit={handleForgotPassword} className="login-form">
                  <div className="form-group">
                    <label htmlFor="resetEmail" className="label-required">
                      Email
                    </label>
                    <div className="input-with-icon">
                      <Mail size={20} className="input-icon" />
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="example@mail.com"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="form-hint">
                      На этот email будут отправлены инструкции по восстановлению
                    </p>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`btn btn-login ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Запрос отправлен успешно!</h3>
                  <p>
                    Инструкции по восстановлению пароля отправлены на email:<br />
                    <strong>{resetEmail}</strong>
                  </p>
                  <p className="success-note">
                    Если вы не получили письмо, проверьте папку "Спам" или попробуйте снова через несколько минут.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="login-info">
            <div className="info-card">
              <div className="info-icon">🌿</div>
              <h2>Добро пожаловать в PlantMe</h2>
              <p>
                Присоединяйтесь к сообществу любителей растений. 
                Покупайте, обменивайтесь опытом и создавайте свой зеленый уголок.
              </p>
              <ul className="info-list">
                <li>✅ Более 100 видов растений</li>
                <li>✅ Бесплатная консультация</li>
                <li>✅ Гарантия качества</li>
                <li>✅ Сообщество единомышленников</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальное окно для сообщений */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <div className="modal-message">
          {modalContent}
        </div>
      </Modal>
    </div>
  );
};

export default Login;
