import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { apiService } from "../../services/apiService";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navbarLogo, setNavbarLogo] = useState(logo);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const siteInfo = await apiService.getInfoSite();
        if (siteInfo.navbar_logo) {
          setNavbarLogo(siteInfo.navbar_logo);
        }
      } catch (error) {
        console.error('Erro ao carregar logo do navbar:', error);
      }
    };
    loadConfig();
  }, []);

  const toggleMenu = () => {
    console.log("Menu toggle clicked, current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    console.log("Closing menu");
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={navbarLogo} alt="Logomarca da Feira" />
        </Link>
      </div>
      
      <div className={`navbar-links ${isMenuOpen ? 'navbar-links-active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/expositores" onClick={closeMenu}>Expositores</Link>
        <Link to="/blog" onClick={closeMenu}>Blog</Link>
        <Link to="/galeria" onClick={closeMenu}>Galeria</Link>
        <Link to="/contato" onClick={closeMenu}>Contato</Link>
        <Link to="/regulamento" onClick={closeMenu}>Regulamento</Link>
        <a 
          href={import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="navbar-admin-link"
          onClick={closeMenu}
        >
          <i className="fas fa-lock"></i> Admin
        </a>
      </div>

      <button 
        className={`navbar-hamburger ${isMenuOpen ? 'navbar-hamburger-active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;