import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Heart, Star, Truck, Shield, Clock, ArrowLeft,
  Check, X, MessageSquare, Share2, Package, Droplets, Sun, 
  Thermometer, Users, ChevronRight, Home, Edit, Send, Camera,
  ChevronLeft, ChevronDown, Filter
} from 'lucide-react';
import '../styles/card.css';

const Card = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllDescription, setShowAllDescription] = useState(false);
  
  const reviewsRef = useRef(null);
  const similarPlantsRef = useRef(null);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: '',
    email: '',
    images: []
  });

  const plantsData = [
    {
      id: 1,
      name: 'Алоэ Вера',
      latinName: 'Aloe barbadensis miller',
      price: 850,
      discount: 0,
      category: 'succulents',
      categoryName: 'Сукуленты',
      categoryIcon: '🌵',
      difficulty: 'easy',
      light: 'high',
      rating: 4.5,
      reviewsCount: 128,
      images: ['🌵', '🌿', '🪴'],
      description: 'Лечебное растение с сочными листьями, известное своими целебными свойствами. Отлично очищает воздух, поглощая вредные вещества. Идеально подходит для спален и офисов.',
      fullDescription: `Алоэ Вера — суккулентное растение, известное своими целебными свойствами. Его гель используется для лечения ожогов, порезов и раздражений кожи.

Особенности:
• Целебные свойства для кожи
• Отличный очиститель воздуха
• Неприхотливо в уходе
• Любит яркий свет
• Умеренный полив (1 раз в 2 недели)

Идеально подходит для начинающих растениеводов и тех, кто ценит полезные свойства растений в доме.`,
      inStock: true,
      isNew: true,
      stockCount: 15,
      care: {
        watering: 'Умеренный (1 раз в 2 недели летом, 1 раз в месяц зимой)',
        light: 'Яркий рассеянный свет, можно прямое солнце утром',
        temperature: '18-25°C',
        humidity: 'Средняя (40-50%)',
        fertilizer: '1 раз в месяц весной-летом специальным удобрением для суккулентов'
      },
      specifications: {
        height: '30-60 см',
        potDiameter: '15 см',
        soil: 'Специальная смесь для суккулентов с дренажем',
        toxicity: 'Безопасно для кошек и собак',
        origin: 'Аравийский полуостров',
        growthRate: 'Средняя',
        lifespan: '5-10 лет'
      },
      benefits: [
        'Очищает воздух от формальдегида и бензола',
        'Лечебные свойства для кожи',
        'Повышает влажность воздуха',
        'Нетоксично для животных'
      ]
    },
    {
      id: 2,
      name: 'Фикус Бенджамина',
      latinName: 'Ficus benjamina',
      price: 1200,
      discount: 10,
      category: 'decorative',
      categoryName: 'Декоративно-лиственные',
      categoryIcon: '🍃',
      difficulty: 'medium',
      light: 'medium',
      rating: 4.8,
      reviewsCount: 94,
      images: ['🌳', '🍃', '🌿'],
      description: 'Элегантное дерево с мелкими глянцевыми листьями. Идеально для офисов и гостиных. Отличный очиститель воздуха.',
      fullDescription: `Фикус Бенджамина — популярное комнатное дерево, известное своей элегантностью и воздухоочищающими свойствами.

Особенности:
• Элегантный внешний вид
• Отличный очиститель воздуха
• Подходит для формирования бонсай
• Любит стабильные условия
• Чувствителен к перепадам температуры

Рекомендуется для опытных растениеводов или тех, кто готов уделять внимание деталям ухода.`,
      inStock: true,
      isNew: false,
      stockCount: 8,
      care: {
        watering: 'Регулярный (1 раз в неделю летом, 1 раз в 2 недели зимой)',
        light: 'Яркий рассеянный свет, избегать прямого солнца',
        temperature: '20-25°C, не ниже 16°C',
        humidity: 'Высокая (50-70%), любит опрыскивания',
        fertilizer: '1 раз в 2 недели весной-летом универсальным удобрением'
      },
      specifications: {
        height: '50-200 см',
        potDiameter: '20 см',
        soil: 'Универсальный грунт с добавлением торфа',
        toxicity: 'Слабо токсичен для животных при попадании внутрь',
        origin: 'Юго-Восточная Азия',
        growthRate: 'Быстрая',
        lifespan: '10-15 лет'
      },
      benefits: [
        'Эффективный очиститель воздуха',
        'Повышает влажность в помещении',
        'Создает уютную атмосферу',
        'Долговечное растение'
      ]
    },
    {
      id: 3,
      name: 'Спатифиллум',
      latinName: 'Spathiphyllum',
      price: 950,
      discount: 0,
      category: 'flowering',
      categoryName: 'Цветущие',
      categoryIcon: '🌸',
      difficulty: 'easy',
      light: 'low',
      rating: 4.3,
      reviewsCount: 156,
      images: ['🌸', '🌺', '🌼'],
      description: 'Цветущее растение, известное как "Женское счастье". Цветет красивыми белыми цветами. Отлично растет в тени.',
      fullDescription: `Спатифиллум, также известный как "Женское счастье" или "Лилия мира", — красивое цветущее растение, которое приносит в дом гармонию и чистый воздух.

Особенности:
• Красивое цветение несколько раз в год
• Отличный очиститель воздуха
• Растет в условиях низкой освещенности
• Любит высокую влажность
• Символ гармонии и счастья

Идеальный выбор для темных комнат и начинающих садоводов.`,
      inStock: true,
      isNew: true,
      stockCount: 20,
      care: {
        watering: 'Обильный (поддерживать почву влажной), но не заливать',
        light: 'Полутень, избегать прямого солнца',
        temperature: '18-24°C, не ниже 16°C',
        humidity: 'Высокая (60-80%), необходимы регулярные опрыскивания',
        fertilizer: '1 раз в 2 недели в период роста специальным удобрением для цветущих'
      },
      specifications: {
        height: '30-60 см',
        potDiameter: '17 см',
        soil: 'Влагопроницаемый грунт для ароидных',
        toxicity: 'Токсичен для кошек и собак при попадании внутрь',
        origin: 'Тропическая Америка',
        growthRate: 'Средняя',
        lifespan: '3-5 лет при правильном уходе'
      },
      benefits: [
        'Очищает воздух от аммиака и формальдегида',
        'Цветет несколько раз в год',
        'Подходит для темных помещений',
        'Создает тропическую атмосферу'
      ]
    }
  ];

  const reviewsData = [
    {
      id: 1,
      plantId: 1,
      user: {
        name: 'Мария Петрова',
        avatar: '👩',
        role: 'Постоянный покупатель'
      },
      rating: 5,
      comment: 'Отличное растение! Прекрасно прижилось, уже дало побеги. Очень довольна покупкой. Растение пришло хорошо упакованным и здоровым. Особенно порадовал быстрый рост новых листьев.',
      date: '10.01.2024',
      likes: 24,
      verified: true
    },
    {
      id: 2,
      plantId: 1,
      user: {
        name: 'Иван Сидоров',
        avatar: '👨',
        role: 'Цветовод-любитель'
      },
      rating: 4,
      comment: 'Хорошее растение, но потребовалось время для адаптации. После пересадки в больший горшок пошел в рост. Советую новичкам - растение действительно неприхотливое.',
      date: '05.12.2023',
      likes: 18,
      verified: true
    },
    {
      id: 3,
      plantId: 1,
      user: {
        name: 'Елена Козлова',
        avatar: '👩‍🔬',
        role: 'Биолог'
      },
      rating: 5,
      comment: 'Отличное качество растения. Уже использовала гель для лечения ожога - помогло мгновенно. Растет быстро, выглядит здоровым. Рекомендую всем, кто хочет полезное и красивое растение.',
      date: '20.11.2023',
      likes: 42,
      verified: true
    },
    {
      id: 4,
      plantId: 1,
      user: {
        name: 'Алексей Новиков',
        avatar: '👨‍💼',
        role: 'Первый раз покупаю'
      },
      rating: 5,
      comment: 'Очень доволен! Растение большое, здоровое. Пришло с инструкцией по уходу. Уже месяц стоит на кухне - смотрится великолепно. Обязательно куплю еще что-то в этом магазине.',
      date: '15.02.2024',
      likes: 15,
      verified: false
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const foundPlant = plantsData.find(p => p.id === parseInt(id));
      setPlant(foundPlant);
      setReviews(reviewsData.filter(r => r.plantId === parseInt(id)));
      setIsLoading(false);
    }, 300);
  }, [id]);

  const handleAddToCart = () => {
    if (plant?.inStock) {
      alert(`${plant.name} добавлен в корзину! Количество: ${quantity}`);
    }
  };

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    alert(isInWishlist ? 'Удалено из избранного' : 'Добавлено в избранное');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.comment && newReview.name) {
      const review = {
        id: reviews.length + 1,
        plantId: parseInt(id),
        user: {
          name: newReview.name,
          avatar: '👤',
          role: 'Покупатель'
        },
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString('ru-RU'),
        likes: 0,
        verified: false
      };
      setReviews([review, ...reviews]);
      setNewReview({
        rating: 5,
        comment: '',
        name: '',
        email: '',
        images: []
      });
      alert('Спасибо за ваш отзыв!');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (plant?.stockCount || 10)) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const calculateDiscountedPrice = (plant) => {
    if (plant?.discount > 0) {
      const discountAmount = (plant.price * plant.discount) / 100;
      return plant.price - discountAmount;
    }
    return plant?.price || 0;
  };

  const renderStars = (rating, size = 20) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.floor(rating) ? "#FFC107" : "#E0E0E0"}
      />
    ));
  };

  const calculateRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    return distribution;
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSimilar = () => {
    similarPlantsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (category) => {
    navigate(`/catalog?category=${category}`);
  };

  if (isLoading) {
    return (
      <div className="card-page">
        <div className="container">
          <div className="card-loading">
            <div className="loading-spinner"></div>
            <p>Загружаем информацию о растении...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="card-page">
        <div className="container">
          <div className="card-empty">
            <div className="empty-icon">🌿</div>
            <h3>Растение не найдено</h3>
            <p>К сожалению, растение с таким ID не существует</p>
            <Link to="/catalog" className="btn btn-primary">
              <ArrowLeft size={18} />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(plant);
  const ratingDistribution = calculateRatingDistribution();
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : plant.rating;

  const similarPlants = plantsData
    .filter(p => p.id !== plant.id && p.category === plant.category)
    .slice(0, 4);

  return (
    <div className="card-page">
      <section className="card-hero">
        <div className="container">
          <div className="card-breadcrumbs">
            <div className="card-breadcrumb">
              <Link to="/" className="breadcrumb-link">
                <Home size={16} />
                Главная
              </Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/catalog" className="breadcrumb-link">
                Каталог
              </Link>
              <span className="breadcrumb-separator">/</span>
              <button 
                className="breadcrumb-category"
                onClick={() => handleCategoryClick(plant.category)}
              >
                {plant.categoryIcon} {plant.categoryName}
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{plant.name}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <main className="card-main">
          <div className="card-container">
            <div className="card-gallery">
              <div className="card-badges">
                {plant.isNew && <span className="card-badge new">Новинка</span>}
                {plant.discount > 0 && (
                  <span className="card-badge discount">-{plant.discount}%</span>
                )}
                {plant.inStock ? (
                  <span className="card-badge in-stock">В наличии</span>
                ) : (
                  <span className="card-badge out-of-stock">Нет в наличии</span>
                )}
              </div>

              <div className="card-main-image">
                {plant.images[selectedImage]}
              </div>

              <div className="card-thumbnails">
                {plant.images.map((image, index) => (
                  <div
                    key={index}
                    className={`card-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    {image}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-info">
              <div className="card-header">
                <button 
                  className="card-category-btn"
                  onClick={() => handleCategoryClick(plant.category)}
                >
                  {plant.categoryIcon} {plant.categoryName}
                </button>
                
                <h1 className="card-title">{plant.name}</h1>
                <p className="card-latin">{plant.latinName}</p>
                
                <div className="card-rating-section">
                  <div className="card-rating">
                    <div className="card-stars">
                      {renderStars(averageRating)}
                    </div>
                    <span className="card-rating-value">{averageRating.toFixed(1)}</span>
                  </div>
                  <button 
                    className="card-reviews-link"
                    onClick={scrollToReviews}
                  >
                    <span className="card-reviews-count">{reviews.length} отзывов</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              <div className="card-tabs">
                <button 
                  className={`card-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Описание
                </button>
                <button 
                  className={`card-tab-btn ${activeTab === 'care' ? 'active' : ''}`}
                  onClick={() => setActiveTab('care')}
                >
                  Уход
                </button>
                <button 
                  className={`card-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specs')}
                >
                  Характеристики
                </button>
              </div>

              <div className="card-tab-content">
                {activeTab === 'description' && (
                  <div className="card-description-content">
                    <p className="card-description-short">{plant.description}</p>
                    <div className={`card-description-full ${showAllDescription ? 'expanded' : ''}`}>
                      {plant.fullDescription.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                    <button 
                      className="card-description-toggle"
                      onClick={() => setShowAllDescription(!showAllDescription)}
                    >
                      {showAllDescription ? 'Скрыть' : 'Читать полностью'}
                      <ChevronDown size={16} className={showAllDescription ? 'rotated' : ''} />
                    </button>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="card-care-content">
                    <div className="care-item">
                      <div className="care-icon">💧</div>
                      <div className="care-info">
                        <h4>Полив</h4>
                        <p>{plant.care.watering}</p>
                      </div>
                    </div>
                    <div className="care-item">
                      <div className="care-icon">☀️</div>
                      <div className="care-info">
                        <h4>Освещение</h4>
                        <p>{plant.care.light}</p>
                      </div>
                    </div>
                    <div className="care-item">
                      <div className="care-icon">🌡️</div>
                      <div className="care-info">
                        <h4>Температура</h4>
                        <p>{plant.care.temperature}</p>
                      </div>
                    </div>
                    <div className="care-item">
                      <div className="care-icon">💦</div>
                      <div className="care-info">
                        <h4>Влажность</h4>
                        <p>{plant.care.humidity}</p>
                      </div>
                    </div>
                    <div className="care-item">
                      <div className="care-icon">🌱</div>
                      <div className="care-info">
                        <h4>Удобрение</h4>
                        <p>{plant.care.fertilizer}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="card-specs-content">
                    <div className="specs-grid">
                      <div className="specs-item">
                        <span className="specs-label">Высота растения:</span>
                        <span className="specs-value">{plant.specifications.height}</span>
                      </div>
                      <div className="specs-item">
                        <span className="specs-label">Диаметр горшка:</span>
                        <span className="specs-value">{plant.specifications.potDiameter}</span>
                      </div>
                      <div className="specs-item">
                        <span className="specs-label">Тип почвы:</span>
                        <span className="specs-value">{plant.specifications.soil}</span>
                      </div>
                      <div className="specs-item">
                        <span className="specs-label">Безопасность:</span>
                        <span className="specs-value">{plant.specifications.toxicity}</span>
                      </div>
                      <div className="specs-item">
                        <span className="specs-label">Происхождение:</span>
                        <span className="specs-value">{plant.specifications.origin}</span>
                      </div>
                      <div className="specs-item">
                        <span className="specs-label">Скорость роста:</span>
                        <span className="specs-value">{plant.specifications.growthRate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-benefits">
                <h3>Польза растения:</h3>
                <ul className="benefits-list">
                  {plant.benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      <Check size={16} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-pricing-section">
                <div className="card-price-info">
                  {plant.discount > 0 ? (
                    <div className="card-price-with-discount">
                      <span className="card-price-old">{formatPrice(plant.price)}</span>
                      <span className="card-price-current">{formatPrice(discountedPrice)}</span>
                      <span className="card-discount-badge">-{plant.discount}%</span>
                    </div>
                  ) : (
                    <span className="card-price-current">{formatPrice(plant.price)}</span>
                  )}
                </div>

                <div className="card-stock-info">
                  <div className={`stock-status ${plant.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    <div className="stock-dot"></div>
                    <span>
                      {plant.inStock ? `В наличии · ${plant.stockCount} шт.` : 'Нет в наличии'}
                    </span>
                  </div>
                </div>

                {plant.inStock && (
                  <div className="card-actions-container">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn minus"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button 
                        className="quantity-btn plus"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= plant.stockCount}
                      >
                        +
                      </button>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn-primary add-to-cart-btn"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart size={20} />
                        Добавить в корзину
                      </button>
                      
                      <button
                        className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                        onClick={handleWishlistToggle}
                      >
                        <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-features">
                <div className="feature">
                  <Truck size={24} />
                  <div className="feature-text">
                    <h4>Бесплатная доставка</h4>
                    <p>От 3000 ₽ по Москве</p>
                  </div>
                </div>
                <div className="feature">
                  <Shield size={24} />
                  <div className="feature-text">
                    <h4>Гарантия качества</h4>
                    <p>30 дней на возврат</p>
                  </div>
                </div>
                <div className="feature">
                  <Clock size={24} />
                  <div className="feature-text">
                    <h4>Быстрая доставка</h4>
                    <p>1-3 дня по Москве</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-reviews-section" ref={reviewsRef}>
            <div className="section-header">
              <div className="header-left">
                <h2>Отзывы покупателей</h2>
                <div className="rating-summary">
                  <div className="average-rating">
                    <span className="rating-number">{averageRating.toFixed(1)}</span>
                    <div className="rating-stars">
                      {renderStars(averageRating)}
                    </div>
                    <span className="reviews-count">{reviews.length} отзывов</span>
                  </div>
                </div>
              </div>
              
              <div className="review-distribution">
                {[5, 4, 3, 2, 1].map((stars, index) => {
                  const count = ratingDistribution[stars - 1];
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={stars} className="distribution-row">
                      <span className="stars-label">{stars} звезд</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="count-label">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="user-info">
                      <div className="user-avatar">{review.user.avatar}</div>
                      <div className="user-details">
                        <h4 className="user-name">
                          {review.user.name}
                          {review.verified && <span className="verified-badge">✓</span>}
                        </h4>
                        <span className="user-role">{review.user.role}</span>
                      </div>
                    </div>
                    <div className="review-meta">
                      <div className="review-rating">
                        {renderStars(review.rating, 16)}
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  
                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>
                  
                  <div className="review-footer">
                    <button className="like-btn">
                      <Heart size={16} />
                      <span>{review.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-review-section">
              <h3>Оставить отзыв</h3>
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ваше имя *</label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      required
                      placeholder="Как к вам обращаться?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email (необязательно)</label>
                    <input
                      type="email"
                      value={newReview.email}
                      onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                      placeholder="Для обратной связи"
                    />
                  </div>
                </div>

                <div className="rating-input">
                  <label>Ваша оценка:</label>
                  <div className="stars-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        className="star-btn"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        onMouseEnter={() => setNewReview(prev => ({...prev, rating: star}))}
                      >
                        <Star
                          size={28}
                          fill={star <= newReview.rating ? "#FFC107" : "#E0E0E0"}
                        />
                      </button>
                    ))}
                    <span className="rating-text">
                      {newReview.rating === 5 ? 'Отлично' :
                       newReview.rating === 4 ? 'Хорошо' :
                       newReview.rating === 3 ? 'Нормально' :
                       newReview.rating === 2 ? 'Плохо' : 'Ужасно'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ваш отзыв *</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    required
                    placeholder="Поделитесь вашим опытом с этим растением. Что вам особенно понравилось? Есть ли рекомендации по уходу?"
                    rows={4}
                  />
                  <div className="textarea-footer">
                    <button type="button" className="add-photo-btn">
                      <Camera size={18} />
                      Добавить фото
                    </button>
                    <span className="char-count">{newReview.comment.length}/1000</span>
                  </div>
                </div>

                <button type="submit" className="submit-review-btn">
                  <Send size={18} />
                  Опубликовать отзыв
                </button>
              </form>
            </div>
          </div>

          {similarPlants.length > 0 && (
            <div className="similar-plants-section" ref={similarPlantsRef}>
              <div className="section-title">
                <h2>Похожие растения</h2>
                <Link to={`/catalog?category=${plant.category}`} className="view-all-link">
                  Все растения категории
                  <ChevronRight size={18} />
                </Link>
              </div>
              
              <div className="similar-plants-grid">
                {similarPlants.map(similarPlant => (
                  <div key={similarPlant.id} className="similar-plant-card">
                    <Link to={`/card/${similarPlant.id}`} className="plant-link">
                      <div className="plant-image">
                        <div className="image-wrapper">
                          {similarPlant.images[0]}
                        </div>
                        {similarPlant.isNew && (
                          <span className="new-badge">Новинка</span>
                        )}
                      </div>
                      
                      <div className="plant-info">
                        <div className="plant-category">
                          {similarPlant.categoryIcon} {similarPlant.categoryName}
                        </div>
                        
                        <h3 className="plant-name">{similarPlant.name}</h3>
                        <p className="plant-latin">{similarPlant.latinName}</p>
                        
                        <div className="plant-rating">
                          {renderStars(similarPlant.rating, 14)}
                          <span className="rating-value">{similarPlant.rating.toFixed(1)}</span>
                        </div>
                        
                        <div className="plant-price">
                          {similarPlant.discount > 0 ? (
                            <>
                              <span className="old-price">{formatPrice(similarPlant.price)}</span>
                              <span className="current-price">
                                {formatPrice(calculateDiscountedPrice(similarPlant))}
                              </span>
                            </>
                          ) : (
                            <span className="current-price">
                              {formatPrice(similarPlant.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Card;