import "./Footer.css";
import aceLogo from "../../assets/logos/ace-logo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img 
              src={aceLogo} 
              alt="ACE - Associação Comercial e Empresarial" 
              className="footer-logo"
            />
            <div className="footer-logo-text">
              <h3>ACE</h3>
              <p>Associação Comercial<br />e Empresarial</p>
            </div>
          </div>
          
          <div className="footer-info">
            <h4>Feira Cultural de Empreendedorismo e Artesanato</h4>
            <p>Uma iniciativa da <strong>ACE - Associação Comercial e Empresarial</strong></p>
            <p>Promovendo cultura, tradição e empreendedorismo em nossa região</p>
            <p>Conectando artesãos, empreendedores e a comunidade</p>
          </div>
          
          <div className="footer-links">
            <h4>Links Úteis</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/expositores">Expositores</a></li>
              <li><a href="/regulamento">Regulamento</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contato">Contato</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contato</h4>
            <div className="contact-item">
              <span>📧 contato@feiraceart.com.br</span>
            </div>
            <div className="contact-item">
              <span>📱 (11) 9999-9999</span>
            </div>
            <div className="contact-item">
              <span>📍 São Paulo, SP</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>&copy; 2025 Feira Cultural CEART. Todos os direitos reservados.</p>
            <p>Desenvolvido com ❤️ para promover a cultura brasileira</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
