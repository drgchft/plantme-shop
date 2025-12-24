import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, ChevronDown, Star, ShoppingCart, Heart } from 'lucide-react';
import '../styles/catalog.css';

const Catalog = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    difficulty: 'all',
    light: 'all',
  });
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  const categories = [
    { id: 'all', name: 'Все растения' },
    { id: 'succulents', name: 'Сукуленты', icon: '🌵' },
    { id: 'cacti', name: 'Кактусы', icon: '🌵' },
    { id: 'flowering', name: 'Цветущие', icon: '🌸' },
    { id: 'decorative', name: 'Декоративно-лиственные', icon: '🍃' },
    { id: 'air-plants', name: 'Воздушные растения', icon: '🌿' },
    { id: 'beginner', name: 'Для начинающих', icon: '🌱' },
    { id: 'rare', name: 'Редкие растения', icon: '🎍' },
  ];

  const difficulties = [
    { id: 'all', name: 'Любая' },
    { id: 'easy', name: 'Легкий', color: '#27ae60' },
    { id: 'medium', name: 'Средний', color: '#f39c12' },
    { id: 'hard', name: 'Сложный', color: '#e74c3c' },
  ];

  const lightRequirements = [
    { id: 'all', name: 'Любое освещение' },
    { id: 'low', name: 'Тень', icon: '🌑' },
    { id: 'medium', name: 'Полутень', icon: '🌥️' },
    { id: 'high', name: 'Яркий свет', icon: '☀️' },
  ];

  const plantsData = [
    {
      id: 1,
      name: 'Алоэ Вера',
      latinName: 'Aloe barbadensis miller',
      price: 850,
      category: 'succulents',
      difficulty: 'easy',
      light: 'high',
      rating: 4.5,
      reviews: 128,
      image: '🌵',
      description: 'Лечебное растение с сочными листьями. Отлично очищает воздух.',
      inStock: true,
      isNew: true,
      discount: 0,
    },
    {
      id: 2,
      name: 'Фикус Бенджамина',
      latinName: 'Ficus benjamina',
      price: 1200,
      category: 'decorative',
      difficulty: 'medium',
      light: 'medium',
      rating: 4.8,
      reviews: 94,
      image: '🌳',
      description: 'Элегантное дерево с мелкими листьями. Идеально для офиса.',
      inStock: true,
      isNew: false,
      discount: 10,
    },
    {
      id: 3,
      name: 'Спатифиллум',
      latinName: 'Spathiphyllum',
      price: 950,
      category: 'flowering',
      difficulty: 'easy',
      light: 'low',
      rating: 4.3,
      reviews: 156,
      image: '🌸',
      description: 'Цветущее растение, известное как "Женское счастье".',
      inStock: true,
      isNew: true,
      discount: 0,
    },
    {
      id: 4,
      name: 'Замиокулькас',
      latinName: 'Zamioculcas zamiifolia',
      price: 1500,
      category: 'beginner',
      difficulty: 'easy',
      light: 'medium',
      rating: 4.7,
      reviews: 87,
      image: '🍃',
      description: 'Неприхотливое растение с глянцевыми листьями. "Долларовое дерево".',
      inStock: true,
      isNew: false,
      discount: 15,
    },
    {
      id: 5,
      name: 'Кактус Цереус',
      latinName: 'Cereus',
      price: 600,
      category: 'cacti',
      difficulty: 'easy',
      light: 'high',
      rating: 4.2,
      reviews: 203,
      image: '🌵',
      description: 'Колонновидный кактус. Цветет ночными цветами.',
      inStock: true,
      isNew: false,
      discount: 0,
    },
    {
      id: 6,
      name: 'Монстера',
      latinName: 'Monstera deliciosa',
      price: 1800,
      category: 'decorative',
      difficulty: 'medium',
      light: 'medium',
      rating: 4.9,
      reviews: 112,
      image: '🌿',
      description: 'Тропическая лиана с резными листьями. Модный интерьерный акцент.',
      inStock: false,
      isNew: true,
      discount: 0,
    },
    {
      id: 7,
      name: 'Орхидея Фаленопсис',
      latinName: 'Phalaenopsis',
      price: 1300,
      category: 'flowering',
      difficulty: 'hard',
      light: 'medium',
      rating: 4.6,
      reviews: 189,
      image: '🌺',
      description: 'Элегантная орхидея с длительным цветением.',
      inStock: true,
      isNew: false,
      discount: 20,
    },
    {
      id: 8,
      name: 'Сансевиерия',
      latinName: 'Sansevieria trifasciata',
      price: 700,
      category: 'beginner',
      difficulty: 'easy',
      light: 'low',
      rating: 4.4,
      reviews: 145,
      image: '🍀',
      description: 'Неприхотливое растение "Тещин язык". Отличный очиститель воздуха.',
      inStock: true,
      isNew: false,
      discount: 5,
    },
    {
      id: 9,
      name: 'Хойя',
      latinName: 'Hoya carnosa',
      price: 1100,
      category: 'flowering',
      difficulty: 'medium',
      light: 'high',
      rating: 4.7,
      reviews: 76,
      image: '🌸',
      description: 'Вьющееся растение с восковыми цветами. "Восковой плющ".',
      inStock: true,
      isNew: true,
      discount: 0,
    },
    {
      id: 10,
      name: 'Тилландсия',
      latinName: 'Tillandsia',
      price: 800,
      category: 'air-plants',
      difficulty: 'medium',
      light: 'medium',
      rating: 4.5,
      reviews: 63,
      image: '🌿',
      description: 'Воздушное растение, не требует почвы. Полив путем опрыскивания.',
      inStock: true,
      isNew: true,
      discount: 10,
    },
    {
      id: 11,
      name: 'Фикус Лирата',
      latinName: 'Ficus lyrata',
      price: 2500,
      category: 'decorative',
      difficulty: 'medium',
      light: 'high',
      rating: 4.8,
      reviews: 42,
      image: '🌳',
      description: 'Крупное растение с листьями в форме скрипки. Модный интерьерный элемент.',
      inStock: true,
      isNew: false,
      discount: 0,
    },
    {
      id: 12,
      name: 'Суккулент "Живой камень"',
      latinName: 'Lithops',
      price: 500,
      category: 'succulents',
      difficulty: 'hard',
      light: 'high',
      rating: 4.1,
      reviews: 89,
      image: '🌵',
      description: 'Миниатюрные суккуленты, похожие на камни. Очень необычный вид.',
      inStock: true,
      isNew: false,
      discount: 0,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPlants(plantsData);
      setFilteredPlants(plantsData);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let result = [...plants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(plant =>
        plant.name.toLowerCase().includes(query) ||
        plant.latinName.toLowerCase().includes(query) ||
        plant.description.toLowerCase().includes(query)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(plant => plant.category === filters.category);
    }

    result = result.filter(plant =>
      plant.price >= filters.priceRange[0] &&
      plant.price <= filters.priceRange[1]
    );

    if (filters.difficulty !== 'all') {
      result = result.filter(plant => plant.difficulty === filters.difficulty);
    }

    if (filters.light !== 'all') {
      result = result.filter(plant => plant.light === filters.light);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'new':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'popular':
        default:
          return b.reviews - a.reviews;
      }
    });

    setFilteredPlants(result);
  }, [plants, filters, sortBy, searchQuery]);

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  const handleDifficultyChange = (difficultyId) => {
    setFilters(prev => ({ ...prev, difficulty: difficultyId }));
  };

  const handleLightChange = (lightId) => {
    setFilters(prev => ({ ...prev, light: lightId }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 10000],
      difficulty: 'all',
      light: 'all',
    });
    setSearchQuery('');
    setSortBy('popular');
  };

  const toggleWishlist = (plantId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(plantId)) {
        newWishlist.delete(plantId);
      } else {
        newWishlist.add(plantId);
      }
      return newWishlist;
    });
  };

  const addToCart = (plant) => {
    alert(`"${plant.name}" добавлен в корзину!`);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const calculateDiscountedPrice = (plant) => {
    if (plant.discount > 0) {
      const discountAmount = (plant.price * plant.discount) / 100;
      return plant.price - discountAmount;
    }
    return plant.price;
  };

  return (
    <div className="catalog-page">
      <section className="catalog-header">
        <div className="container">
          <div className="header-content">
            <h1>Каталог растений</h1>
            <p className="catalog-description">
              Более 100 видов комнатных растений для вашего дома и офиса. 
              Найдите своего зеленого друга!
            </p>
            <div className="header-stats">
                <div className="stat-item">
                     <div className="stat-value">{plantsData.length}+</div>
                     <div className="stat-label">Видов растений</div>
                    </div>
            <div className="stat-item">
                <div className="stat-value">4.7</div>
                <div className="stat-label">Средний рейтинг</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">30</div>
                <div className="stat-label">Дней гарантии</div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="catalog-layout">
          
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3><Filter size={20} /> Фильтры</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                ×
              </button>
            </div>

            <div className="filter-section">
              <h4>Поиск растения</h4>
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Название растения..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-section">
              <h4>Категории</h4>
              <div className="categories-list">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${filters.category === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.icon && <span className="category-icon">{category.icon}</span>}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Цена, ₽</h4>
              <div className="price-range">
                <div className="price-inputs">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                    min="0"
                    max="10000"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                    min="0"
                    max="10000"
                  />
                </div>
                <div className="range-slider">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="filter-section">
                <h4>Сложность ухода</h4>
                <div className="difficulty-list">
                    {difficulties.map(diff => (
                        <button
                            key={diff.id}
                            className={`difficulty-btn ${filters.difficulty === diff.id ? 'active' : ''}`}
                            onClick={() => handleDifficultyChange(diff.id)}
                            data-difficulty={diff.id}
                            style={diff.color ? { 
                                '--difficulty-color': diff.color,
                                'border-color': filters.difficulty === diff.id ? diff.color : '#e8f0eb',
                                'color': filters.difficulty === diff.id ? diff.color : 'var(--dark-color)'
                            } : {}}
                        >
                            {diff.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-section">
              <h4>Освещение</h4>
              <div className="light-list">
                {lightRequirements.map(light => (
                  <button
                    key={light.id}
                    className={`light-btn ${filters.light === light.id ? 'active' : ''}`}
                    onClick={() => handleLightChange(light.id)}
                  >
                    {light.icon && <span className="light-icon">{light.icon}</span>}
                    {light.name}
                  </button>
                ))}
              </div>
            </div>

            <button className="reset-filters" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </aside>

          <main className="catalog-content">
            
            <div className="controls-panel">
              <button 
                className="mobile-filters-btn"
                onClick={() => setShowFilters(true)}
              >
                <Filter size={18} /> Фильтры
              </button>
              
              <div className="results-info">
                Найдено растений: <span className="count">{filteredPlants.length}</span>
                {searchQuery && (
                  <span className="search-query"> по запросу "{searchQuery}"</span>
                )}
              </div>
              
              <div className="sort-controls">
                <span className="sort-label">Сортировка:</span>
                <div className="sort-select-wrapper">
                    <select 
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    >
                    <option value="popular">По популярности</option>
                    <option value="rating">По рейтингу</option>
                    <option value="price-low">Сначала дешевые</option>
                    <option value="price-high">Сначала дорогие</option>
                    <option value="new">Новинки</option>
                    </select>
                </div>
                </div>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Загружаем растения...</p>
              </div>
            ) : filteredPlants.length > 0 ? (
              <div className="plants-grid">
                {filteredPlants.map(plant => {
                  const discountedPrice = calculateDiscountedPrice(plant);
                  const isInWishlist = wishlist.has(plant.id);
                  
                  return (
                    <div key={plant.id} className="plant-card">
                      
                      <div className="plant-badges">
                        {plant.isNew && <span className="badge new">Новинка</span>}
                        {plant.discount > 0 && (
                          <span className="badge discount">-{plant.discount}%</span>
                        )}
                        {!plant.inStock && (
                          <span className="badge out-of-stock">Нет в наличии</span>
                        )}
                      </div>
                      
                      <button 
                        className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                        onClick={() => toggleWishlist(plant.id)}
                        aria-label={isInWishlist ? 'Убрать из избранного' : 'Добавить в избранное'}
                      >
                        <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
                      </button>
                      
                      <div className="plant-image">
                        <div className="image-placeholder">
                          {plant.image}
                        </div>
                      </div>
                      
                      <div className="plant-info">
                        <div className="plant-category">
                          {categories.find(c => c.id === plant.category)?.icon} 
                          {categories.find(c => c.id === plant.category)?.name}
                        </div>
                        
                        <h3 className="plant-name">{plant.name}</h3>
                        <p className="plant-latin">{plant.latinName}</p>
                        
                        <div className="plant-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                fill={i < Math.floor(plant.rating) ? "#FFC107" : "#E0E0E0"}
                              />
                            ))}
                          </div>
                          <span className="rating-value">{plant.rating.toFixed(1)}</span>
                          <span className="reviews-count">({plant.reviews})</span>
                        </div>
                        
                        <p className="plant-description">{plant.description}</p>
                        
                        <div className="plant-details">
                          <span className="detail">
                            <span className="detail-label">Сложность:</span>
                            <span 
                              className="detail-value difficulty"
                              style={{ 
                                color: difficulties.find(d => d.id === plant.difficulty)?.color 
                              }}
                            >
                              {difficulties.find(d => d.id === plant.difficulty)?.name}
                            </span>
                          </span>
                          <span className="detail">
                            <span className="detail-label">Освещение:</span>
                            <span className="detail-value">
                              {lightRequirements.find(l => l.id === plant.light)?.name}
                            </span>
                          </span>
                        </div>
                        
                        <div className="plant-footer">
                          <div className="plant-pricing">
                            {plant.discount > 0 ? (
                              <>
                                <span className="price-old">{formatPrice(plant.price)}</span>
                                <span className="price-current">
                                  {formatPrice(discountedPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="price-current">
                                {formatPrice(plant.price)}
                              </span>
                            )}
                          </div>
                          
                          <button 
                            className={`btn btn-primary add-to-cart ${!plant.inStock ? 'disabled' : ''}`}
                            onClick={() => plant.inStock && addToCart(plant)}
                            disabled={!plant.inStock}
                          >
                            {plant.inStock ? (
                              <>
                                <ShoppingCart size={18} />
                                В корзину
                              </>
                            ) : (
                              'Нет в наличии'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌿</div>
                <h3>Растения не найдены</h3>
                <p>Попробуйте изменить параметры поиска или фильтры</p>
                <button className="btn btn-outline" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              </div>
            )}
            
            <div className="catalog-info">
              <div className="info-card">
                <div className="info-icon">🚚</div>
                <h4>Бесплатная доставка</h4>
                <p>При заказе от 3000 ₽ по Москве</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🌱</div>
                <h4>Гарантия качества</h4>
                <p>30 дней на возврат растения</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <h4>Консультация</h4>
                <p>Бесплатные советы по уходу</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
