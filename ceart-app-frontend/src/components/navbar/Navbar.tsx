import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <img src={logo} alt="Logomarca da Feira" />
        </Link>
      </div>
      
      <div className={`navbar-links ${isMenuOpen ? 'navbar-links-active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/expositores" onClick={closeMenu}>Expositores</Link>
        <Link to="/blog" onClick={closeMenu}>Blog</Link>
        <Link to="/galeria" onClick={closeMenu}>Galeria</Link>
        <Link to="/contato" onClick={closeMenu}>Contato</Link>
        <Link to="/regulamento" onClick={closeMenu}>Regulamento</Link>
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