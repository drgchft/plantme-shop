import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components.css';

const Header = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>🌿 PlantMe</h1>
          </Link>
        </div>
            
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Главная</Link></li>
            <li><Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>Каталог</Link></li>
            <li><Link to="/about-us" onClick={() => setMobileMenuOpen(false)}>О нас</Link></li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to={`/profile/${user?.username}`} onClick={() => setMobileMenuOpen(false)}>
                    👤 {user?.nickname || user?.username}
                  </Link>
                </li>
                <li>
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="btn btn-outline">Войти</button>
                  </Link>
                </li>
                <li>
                  <Link to="/registration" onClick={() => setMobileMenuOpen(false)}>
                    <button className="btn btn-primary">Регистрация</button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;