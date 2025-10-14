import { useState, useEffect } from "react";
import ContatoSection from "../components/contato-section/ContatoSection";
import "./Contato.css";
import { apiService } from "../services/apiService";

interface SiteConfig {
  site_email: string;
  site_phone: string;
  site_address: string;
  site_instagram: string;
  site_facebook: string;
  site_youtube: string;
  site_url: string;
}

const Contato = () => {
  const [config, setConfig] = useState<SiteConfig>({
    site_email: 'contato@feiraceart.com.br',
    site_phone: '(11) 9999-9999',
    site_address: 'São Paulo, SP',
    site_instagram: '',
    site_facebook: '',
    site_youtube: '',
    site_url: '',
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const siteInfo = await apiService.getInfoSite();
        setConfig({
          site_email: siteInfo.site_email,
          site_phone: siteInfo.site_phone,
          site_address: siteInfo.site_address,
          site_instagram: siteInfo.site_instagram,
          site_facebook: siteInfo.site_facebook,
          site_youtube: siteInfo.site_youtube,
          site_url: siteInfo.site_url,
        });
      } catch (error) {
        console.error('Erro ao carregar configurações de contato:', error);
      }
    };
    loadConfig();
  }, []);

  return (
    <div className="contato-page">
      {/* Hero Section */}
      <section className="contato-hero">
        <div className="contato-hero-content">
          <h1>Fale Conosco</h1>
          <p>Estamos aqui para ajudar e esclarecer suas dúvidas sobre a Feira CEART</p>
        </div>
      </section>

      {/* Informações Gerais */}
      <section className="contato-info-section">
        <div className="container">
          <div className="contato-info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Localização</h3>
              <p>{config.site_address.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Telefone</h3>
              <p>{config.site_phone.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>E-mail</h3>
              <p>{config.site_email.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🌐</div>
              <h3>Redes Sociais</h3>
              <div className="social-links">
                {config.site_facebook && (
                  <a href={config.site_facebook.startsWith('http') ? config.site_facebook : `https://facebook.com/${config.site_facebook}`} 
                     className="social-link" target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                )}
                {config.site_instagram && (
                  <a href={config.site_instagram.startsWith('http') ? config.site_instagram : `https://instagram.com/${config.site_instagram.replace('@', '')}`} 
                     className="social-link" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
                {config.site_youtube && (
                  <a href={config.site_youtube.startsWith('http') ? config.site_youtube : `https://youtube.com/${config.site_youtube}`} 
                     className="social-link" target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                )}
                {config.site_url && (
                  <a href={config.site_url} className="social-link" target="_blank" rel="noopener noreferrer">
                    Site Oficial
                  </a>
                )}
                {!config.site_facebook && !config.site_instagram && !config.site_youtube && !config.site_url && (
                  <p>Configure as redes sociais no CMS</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Contato Principal */}
      <ContatoSection />
    </div>
  );
};

export default Contato;
