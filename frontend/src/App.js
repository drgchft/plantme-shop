import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/registration.css';
import './styles/login.css';

import Main from './pages/Main';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import About from './pages/About';
import Catalog from './pages/Catalog';
import Card from './pages/Card';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      const testUser = {
        id: 1,
        username: 'plantlover',
        fullName: 'Алексей Петров',
        email: 'alexey@example.com',
        phone: '+7 (999) 123-45-67',
        address: 'г. Москва, ул. Зеленая, д. 15, кв. 42',
        registrationDate: '15.03.2023',
        status: 'premium',
        about: 'Люблю комнатные растения. В моей коллекции уже более 50 видов. Особенно нравятся суккуленты и орхидеи.',
        stats: {
          plantsBought: 24,
          reviews: 18,
          wishlist: 32,
          orders: 15
        }
      };
      
      // Раскомментируйте строку ниже для автоматического входа при разработке
      handleLogin(testUser, 'test-jwt-token-12345');
      
      console.log('Для тестирования раскомментируйте строку handleLogin в useEffect');
      console.log('Текущий статус авторизации:', isAuthenticated);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout}
        />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={
              isAuthenticated ? 
                <Navigate to="/profile" /> : 
                <Login onLogin={handleLogin} />
            } />
            <Route path="/registration" element={
              isAuthenticated ? 
                <Navigate to="/profile" /> : 
                <Registration onLogin={handleLogin} />
            } />
            <Route path="/profile/:username" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                {user ? <Navigate to={`/profile/${user.username}`} /> : <Navigate to="/login" />}
              </ProtectedRoute>
            } />
            <Route path="/about-us" element={<About />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/card/:id" element={<Card />} />
            
            <Route path="/privacy" element={<div>Политика конфиденциальности</div>} />
            <Route path="/offer" element={<div>Договор оферты</div>} />
            <Route path="/agreement" element={<div>Согласие на обработку данных</div>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;