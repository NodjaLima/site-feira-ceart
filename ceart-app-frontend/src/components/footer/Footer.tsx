import { useState, useEffect } from "react";
import "./Footer.css";
import aceLogo from "../../assets/logos/ace-logo.svg";
import { apiService } from "../../services/apiService";

interface SiteConfig {
  footer_logo: string;
  org_name: string;
  org_description: string;
  feira_description: string;
  site_email: string;
  site_phone: string;
  site_address: string;
}

const Footer = () => {
  const [config, setConfig] = useState<SiteConfig>({
    footer_logo: aceLogo,
    org_name: 'ACE',
    org_description: 'Associação Comercial e Empresarial',
    feira_description: 'Uma iniciativa da ACE - Associação Comercial e Empresarial',
    site_email: 'contato@feiraceart.com.br',
    site_phone: '(11) 9999-9999',
    site_address: 'São Paulo, SP',
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const siteInfo = await apiService.getInfoSite();
        setConfig({
          footer_logo: siteInfo.footer_logo || aceLogo,
          org_name: siteInfo.org_name,
          org_description: siteInfo.org_description,
          feira_description: siteInfo.feira_description,
          site_email: siteInfo.site_email,
          site_phone: siteInfo.site_phone,
          site_address: siteInfo.site_address,
        });
      } catch (error) {
        console.error('Erro ao carregar configurações do footer:', error);
      }
    };
    loadConfig();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            {config.footer_logo && (
              <img 
                src={config.footer_logo} 
                alt={`${config.org_name} - ${config.org_description}`}
                className="footer-logo"
              />
            )}
            <div className="footer-logo-text">
              <h3>{config.org_name}</h3>
              <p>{config.org_description.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</p>
            </div>
          </div>
          
          <div className="footer-info">
            <h4>Feira Cultural de Empreendedorismo e Artesanato</h4>
            {config.feira_description.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
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
              <span>📧 {config.site_email}</span>
            </div>
            <div className="contact-item">
              <span>📱 {config.site_phone}</span>
            </div>
            <div className="contact-item">
              <span>📍 {config.site_address}</span>
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
