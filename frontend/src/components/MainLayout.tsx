import React, { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import logo from '../assets/botblo-logo.png';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  useEffect(() => {
    document.body.classList.add('layout-active');
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.classList.remove('layout-active');
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <AnimatedBackground />
      <div className="layout-container">
        {/* ===== HEADER ===== */}
        <header className="app-header">
          <div className="container d-flex justify-content-between align-items-center">
            <Link to="/" className="header-logo-link">
              <img src={logo} alt="BotBlo Logo" className="header-logo" />
            </Link>
            <button className="burger-button" onClick={toggleMenu} aria-label="Toggle menu">
              <div className={`burger-icon ${isMenuOpen ? 'active' : ''}`}>
                <span></span><span></span><span></span>
              </div>
            </button>
          </div>
        </header>

        <div id="menu-main-open-panel" className={isMenuOpen ? 'active' : ''}>
          <div className="menu-main-open-inner-container container h-100 d-flex flex-column">
            <div className="d-flex flex-row align-items-center  justify-content-between h-100 menu-main-open-inner-div">
              <div className="menu-open-logo-area">
                <img src={logo} alt="BotBlo Menu Logo" className="menu-open-logo-main" />
              </div>
              <nav className="menu-navigation-area w-100">
                <ul className="main-navigation-open list-unstyled">
                  <li><Link to="/create-post" onClick={toggleMenu}>Nowy Wpis</Link></li>
                  <li><Link to="/manage-sites" onClick={toggleMenu}>Zarządzaj Stronami</Link></li>
                  <li><Link to="/account" onClick={toggleMenu}>Zarządzanie kontem</Link></li> 
                  <li><button onClick={handleLogout} className="logout-button">Wyloguj</button></li>
                </ul>
              </nav>
              
            </div>
            <div className="menu-footer-row mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="social-links-col">
                    <a href="#" target="_blank">Kontakt</a>
                  </div>
                  <div className="policy-links-col text-end">
                    <p className="mb-0">© 2025 BotBlo</p>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <main className="layout-main-content">
          <div className="container ">
            {children}
          </div>
        </main>

        <footer className="app-footer">
          <div className="container d-flex flex-column align-items-center gap-3">
            <div className="w-100">
              <img src={logo} alt="BotBlo Logo" className="footer-logo" />
            </div>
            <div className="d-flex justify-content-between w-100 footer-bottom">
              <p className="mb-0">&copy; 2025 BotBlo. Wszelkie prawa zastrzeżone.</p>
              <p className="mb-0">Wykonawca: Miłosz Pradela</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainLayout;