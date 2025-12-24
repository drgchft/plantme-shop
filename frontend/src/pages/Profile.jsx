import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit2, Save, X, Camera, ShoppingBag, MessageSquare, Star, Heart, Settings, Package, Calendar, Mail, Phone, User, MapPin, Upload } from 'lucide-react';
import '../styles/profile.css';

const Profile = ({ user, onLogout }) => {
  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  
  const [userData, setUserData] = useState({
    id: user?.id || 1,
    username: username || user?.username || 'plantlover',
    fullName: user?.fullName || 'Алексей Петров',
    email: user?.email || 'alexey@example.com',
    phone: user?.phone || '+7 (999) 123-45-67',
    address: user?.address || 'г. Москва, ул. Зеленая, д. 15, кв. 42',
    registrationDate: user?.registrationDate || '15.03.2023',
    status: user?.status || 'premium',
    about: user?.about || 'Люблю комнатные растения. В моей коллекции уже более 50 видов. Особенно нравятся суккуленты и орхидеи.',
    avatar: user?.avatar || '👤',
    banner: user?.banner || '🌿🌱🌸',
    avatarFilter: user?.avatarFilter || 'none',
    bannerFilter: user?.bannerFilter || 'none',
    stats: {
      plantsBought: user?.stats?.plantsBought || 24,
      reviews: user?.stats?.reviews || 18,
      wishlist: user?.stats?.wishlist || 32,
      orders: user?.stats?.orders || 15
    }
  });

  const [tempAvatar, setTempAvatar] = useState(userData.avatar);
  const [tempBanner, setTempBanner] = useState(userData.banner);
  const [tempAvatarFilter, setTempAvatarFilter] = useState(userData.avatarFilter);
  const [tempBannerFilter, setTempBannerFilter] = useState(userData.bannerFilter);
  const [tempAbout, setTempAbout] = useState(userData.about);

  const [activeTab, setActiveTab] = useState('info');

  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-001',
      date: '12.01.2024',
      status: 'delivered',
      total: 3850,
      items: [
        { id: 1, name: 'Алоэ Вера', price: 850, quantity: 1, image: '🌵' },
        { id: 2, name: 'Спатифиллум', price: 950, quantity: 1, image: '🌸' },
        { id: 3, name: 'Кактус Цереус', price: 600, quantity: 2, image: '🌵' },
      ]
    },
    {
      id: 'ORD-2023-045',
      date: '25.12.2023',
      status: 'delivered',
      total: 1800,
      items: [
        { id: 4, name: 'Монстера', price: 1800, quantity: 1, image: '🌿' }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '15.01.2024',
      status: 'processing',
      total: 2450,
      items: [
        { id: 5, name: 'Фикус Лирата', price: 2500, quantity: 1, image: '🌳' }
      ]
    }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      plantId: 1,
      plantName: 'Алоэ Вера',
      date: '10.01.2024',
      rating: 5,
      text: 'Отличное растение! Прекрасно прижилось, уже дало побеги. Очень доволен покупкой.',
      images: ['🌵', '🌿']
    },
    {
      id: 2,
      plantId: 2,
      plantName: 'Фикус Бенджамина',
      date: '05.12.2023',
      rating: 4,
      text: 'Красивое растение, но потребовалось время для адаптации. Сейчас чувствует себя прекрасно.',
      images: ['🌳']
    },
    {
      id: 3,
      plantId: 3,
      plantName: 'Спатифиллум',
      date: '20.11.2023',
      rating: 5,
      text: 'Цветет уже второй месяц! Очень красивые белые цветы. Рекомендую всем.',
      images: ['🌸', '🌺']
    }
  ]);

  const filters = [
    { id: 'none', name: 'Без фильтра', preview: '🖼️' },
    { id: 'sepia', name: 'Сепия', preview: '🎨' },
    { id: 'grayscale', name: 'Черно-белый', preview: '⚫' },
    { id: 'invert', name: 'Негатив', preview: '🌀' },
    { id: 'hue-rotate', name: 'Цветовой сдвиг', preview: '🌈' },
    { id: 'saturate', name: 'Насыщенность', preview: '🎪' },
    { id: 'brightness', name: 'Яркость', preview: '☀️' },
    { id: 'contrast', name: 'Контраст', preview: '⚡' },
    { id: 'blur', name: 'Размытие', preview: '💫' },
  ];

  const statusColors = {
    standard: { bg: 'linear-gradient(135deg, #3498db, #2980b9)', label: 'Стандарт' },
    premium: { bg: 'linear-gradient(135deg, #f39c12, #e67e22)', label: 'Премиум' },
    admin: { bg: 'linear-gradient(135deg, #e74c3c, #c0392b)', label: 'Администратор' },
    blocked: { bg: 'linear-gradient(135deg, #95a5a6, #7f8c8d)', label: 'Заблокирован' }
  };

  useEffect(() => {
    if (user) {
      setUserData({
        ...userData,
        ...user,
        avatar: user.avatar || '👤',
        banner: user.banner || '🌿🌱🌸',
        avatarFilter: user.avatarFilter || 'none',
        bannerFilter: user.bannerFilter || 'none',
      });
      setTempAvatar(user.avatar || '👤');
      setTempBanner(user.banner || '🌿🌱🌸');
      setTempAvatarFilter(user.avatarFilter || 'none');
      setTempBannerFilter(user.bannerFilter || 'none');
      setTempAbout(user.about || '');
    }
  }, [user]);

  const handleEditToggle = () => {
    if (editMode) {
      const updatedUserData = {
        ...userData,
        avatar: tempAvatar,
        banner: tempBanner,
        avatarFilter: tempAvatarFilter,
        bannerFilter: tempBannerFilter,
        about: tempAbout,
      };
      
      setUserData(updatedUserData);
      
      console.log('Сохранение данных пользователя:', updatedUserData);
      
      setEditMode(false);
      setIsEditing(false);
      
      alert('Изменения сохранены!');
    } else {
      setEditMode(true);
      setIsEditing(true);
      setTempAvatar(userData.avatar);
      setTempBanner(userData.banner);
      setTempAvatarFilter(userData.avatarFilter);
      setTempBannerFilter(userData.bannerFilter);
      setTempAbout(userData.about);
    }
  };

  const handleImageEdit = (type) => {
    setSelectedImageType(type);
    setShowFilterModal(true);
  };

  const applyFilter = () => {
    if (selectedImageType === 'avatar') {
      setTempAvatarFilter(selectedFilter);
    } else if (selectedImageType === 'banner') {
      setTempBannerFilter(selectedFilter);
    }
    setShowFilterModal(false);
    setSelectedFilter('none');
  };

  const handleAvatarChange = (newAvatar) => {
    setTempAvatar(newAvatar);
  };

  const handleBannerChange = (newBanner) => {
    setTempBanner(newBanner);
  };

  const handleAboutChange = (e) => {
    setTempAbout(e.target.value);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setIsEditing(false);
    setTempAvatar(userData.avatar);
    setTempBanner(userData.banner);
    setTempAvatarFilter(userData.avatarFilter);
    setTempBannerFilter(userData.bannerFilter);
    setTempAbout(userData.about);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const getStatusInfo = (status) => {
    return statusColors[status] || statusColors.standard;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#FFC107" : "#E0E0E0"}
      />
    ));
  };

  const availableEmojis = [
    '👤', '👩‍🔬', '👨‍🎨', '👩‍🌾', '👨‍💼', '🌿', '🌱', '🌸', '🌵', '🌳',
    '🌺', '🍃', '🎍', '💐', '🌻', '🌹', '🌷', '🌼', '🌴', '🌲'
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="profile-banner">
            <div className={`banner-content filter-${editMode ? tempBannerFilter : userData.bannerFilter}`}>
              {editMode ? tempBanner : userData.banner}
            </div>
            {editMode && (
              <button 
                className="edit-banner-btn"
                onClick={() => handleImageEdit('banner')}
                title="Изменить баннер"
              >
                <Camera size={20} />
              </button>
            )}
          </div>

          <div className="profile-info-card">
            <div className="profile-avatar">
              <div className="avatar-container">
                <div className={`avatar-content filter-${editMode ? tempAvatarFilter : userData.avatarFilter}`}>
                  {editMode ? tempAvatar : userData.avatar}
                </div>
              </div>
              {editMode && (
                <button 
                  className="edit-avatar-btn"
                  onClick={() => handleImageEdit('avatar')}
                  title="Изменить аватар"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            <div className="profile-main-info">
              <div className="profile-header-row">
                <div className="profile-title">
                  <h1>{userData.fullName}</h1>
                  <div className="user-status" style={{ background: getStatusInfo(userData.status).bg }}>
                    {getStatusInfo(userData.status).label}
                  </div>
                </div>
                
                <div className="profile-actions">
                  {editMode && (
                    <button 
                      className="edit-profile-btn cancel"
                      onClick={handleCancelEdit}
                    >
                      <X size={18} />
                      Отмена
                    </button>
                  )}
                  <button 
                    className={`edit-profile-btn ${editMode ? 'save' : ''}`}
                    onClick={handleEditToggle}
                  >
                    {editMode ? (
                      <>
                        <Save size={18} />
                        Применить
                      </>
                    ) : (
                      <>
                        <Edit2 size={18} />
                        Редактировать
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="profile-bio-section">
                {editMode ? (
                  <textarea 
                    className="edit-bio"
                    value={tempAbout}
                    onChange={handleAboutChange}
                    rows="3"
                    placeholder="Расскажите о себе..."
                  />
                ) : (
                  <p className="profile-bio">{userData.about}</p>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat-card">
                  <div className="stat-value">{userData.stats.plantsBought}</div>
                  <div className="stat-label">Растений куплено</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{userData.stats.orders}</div>
                  <div className="stat-label">Заказов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{userData.stats.reviews}</div>
                  <div className="stat-label">Отзывов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{userData.stats.wishlist}</div>
                  <div className="stat-label">В избранном</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="profile-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <User size={18} />
              Личная информация
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              Мои заказы ({orders.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare size={18} />
              Мои отзывы ({reviews.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              Настройки
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'info' && (
              <div className="personal-info-grid">
                <div className="info-section">
                  <h3><User size={20} /> Основная информация</h3>
                  <div className="info-field">
                    <span className="field-label">Имя пользователя</span>
                    <div className="field-value">@{userData.username}</div>
                  </div>
                  <div className="info-field">
                    <span className="field-label">Полное имя</span>
                    <div className="field-value">{userData.fullName}</div>
                  </div>
                  <div className="info-field">
                    <span className="field-label">Дата регистрации</span>
                    <div className="field-value">{userData.registrationDate}</div>
                  </div>
                </div>

                <div className="info-section">
                  <h3><Mail size={20} /> Контактная информация</h3>
                  <div className="info-field">
                    <span className="field-label">Электронная почта</span>
                    <div className="field-value">{userData.email}</div>
                  </div>
                  <div className="info-field">
                    <span className="field-label">Телефон</span>
                    <div className="field-value">{userData.phone}</div>
                  </div>
                  <div className="info-field">
                    <span className="field-label">Адрес</span>
                    <div className="field-value">{userData.address}</div>
                  </div>
                </div>

                {editMode && (
                  <div className="info-section">
                    <h3><Edit2 size={20} /> Настройка изображений</h3>
                    
                    <div className="info-field">
                      <span className="field-label">Выберите аватар</span>
                      <div className="emoji-grid">
                        {availableEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            className={`emoji-option ${tempAvatar === emoji ? 'active' : ''}`}
                            onClick={() => handleAvatarChange(emoji)}
                          >
                            <span className={`emoji-preview filter-${tempAvatarFilter}`}>
                              {emoji}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="info-field">
                      <span className="field-label">Выберите баннер</span>
                      <div className="emoji-grid">
                        {availableEmojis.filter(e => ['🌿', '🌱', '🌸', '🌵', '🌳', '🌺', '🍃', '🎍', '💐', '🌻', '🌹', '🌷', '🌼', '🌴', '🌲'].includes(e)).map((emoji, index) => (
                          <button
                            key={index}
                            className={`emoji-option ${tempBanner === emoji ? 'active' : ''}`}
                            onClick={() => handleBannerChange(emoji)}
                          >
                            <span className={`emoji-preview filter-${tempBannerFilter}`}>
                              {emoji}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-grid">
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <div className="order-id">Заказ #{order.id}</div>
                          <div className="order-date">{order.date}</div>
                        </div>
                        <div className={`order-status status-${order.status}`}>
                          {order.status === 'delivered' && 'Доставлен'}
                          {order.status === 'processing' && 'В обработке'}
                          {order.status === 'cancelled' && 'Отменен'}
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="order-item">
                            <div className="item-image">{item.image}</div>
                            <div className="item-info">
                              <div className="item-name">{item.name}</div>
                              <div className="item-price">{formatPrice(item.price)} × {item.quantity}</div>
                            </div>
                            <div className="item-total">{formatPrice(item.price * item.quantity)}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-total">Итого: {formatPrice(order.total)}</div>
                        <div className="order-actions">
                          <Link to="/catalog" className="btn btn-outline">
                            Повторить заказ
                          </Link>
                          <button className="btn btn-primary">
                            Отследить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <div className="no-data-icon">📦</div>
                    <h3>Заказов пока нет</h3>
                    <p>Совершите свою первую покупку в нашем магазине!</p>
                    <Link to="/catalog" className="btn btn-primary">
                      Перейти в каталог
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-grid">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div>
                          <div className="review-plant">{review.plantName}</div>
                          <div className="review-date">{review.date}</div>
                        </div>
                        <div className="review-rating">
                          <div className="review-stars">
                            {renderStars(review.rating)}
                          </div>
                          <span className="rating-value">{review.rating}.0</span>
                        </div>
                      </div>
                      
                      <div className="review-text">{review.text}</div>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="review-images">
                          {review.images.map((img, index) => (
                            <div key={index} className="review-image">
                              {img}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="review-actions">
                        <Link to={`/card/${review.plantId}`} className="btn btn-outline">
                          Перейти к товару
                        </Link>
                        <button className="btn btn-outline">
                          Редактировать отзыв
                        </button>
                        <button className="btn btn-danger">
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <div className="no-data-icon">💬</div>
                    <h3>Отзывов пока нет</h3>
                    <p>Оставьте свой первый отзыв о покупке!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="personal-info-grid">
                <div className="info-section">
                  <h3><Settings size={20} /> Настройки аккаунта</h3>
                  <div className="info-field">
                    <span className="field-label">Уведомления</span>
                    <div className="field-value">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        Email-уведомления
                      </label>
                    </div>
                  </div>
                  <div className="info-field">
                    <span className="field-label">Приватность</span>
                    <div className="field-value">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        Показывать профиль другим пользователям
                      </label>
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                    onClick={() => {
                      if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
                        onLogout();
                      }
                    }}
                  >
                    Удалить аккаунт
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilterModal && (
        <div className="image-filter-modal">
          <div className="filter-modal-content">
            <div className="modal-header">
              <h2>Выберите фильтр для {selectedImageType === 'avatar' ? 'аватара' : 'баннера'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowFilterModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="filter-options">
              {filters.map(filter => (
                <div 
                  key={filter.id}
                  className={`filter-option ${selectedFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <div className={`filter-preview filter-${filter.id}`}>
                    {filter.preview}
                  </div>
                  <span className="filter-name">{filter.name}</span>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setShowFilterModal(false)}
              >
                Отмена
              </button>
              <button 
                className="btn btn-primary"
                onClick={applyFilter}
              >
                Применить фильтр
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;