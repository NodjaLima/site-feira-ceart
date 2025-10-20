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
  site_whatsapp: string;
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
    site_whatsapp: '',
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
          site_whatsapp: siteInfo.site_whatsapp,
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

      {/* Botão flutuante do WhatsApp */}
      {config.site_whatsapp && (
        <a
          href={`https://wa.me/${config.site_whatsapp.replace(/\D/g, '')}`}
          className="whatsapp-float-button"
          target="_blank"
          rel="noopener noreferrer"
          title="Fale conosco no WhatsApp"
        >
          <svg viewBox="0 0 32 32" className="whatsapp-icon">
            <path fill="currentColor" d="M16 0C7.163 0 0 7.163 0 16c0 2.825.738 5.487 2.013 7.788L.05 31.95l8.325-2.088A15.943 15.943 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.25c-2.537 0-4.975-.738-7-2.013l-.5-.3-5.2 1.3 1.388-5.088-.325-.537A13.175 13.175 0 012.75 16c0-7.325 5.95-13.25 13.25-13.25S29.25 8.675 29.25 16 23.3 29.25 16 29.25zm7.263-9.95c-.4-.2-2.363-1.163-2.725-1.3-.363-.137-.625-.2-.888.2-.262.4-1.012 1.3-1.238 1.563-.225.262-.45.3-.85.1-.4-.2-1.688-.625-3.213-2-.388-.35-1.187-1.237-1.187-1.737s.35-.65.55-.85c.2-.2.4-.4.6-.6.2-.2.263-.35.4-.588.137-.237.075-.45-.025-.625-.1-.175-.888-2.137-1.213-2.925-.325-.788-.65-.65-.887-.65-.225 0-.487-.025-.75-.025s-.725.1-1.1.5c-.375.4-1.45 1.412-1.45 3.45s1.488 4 1.688 4.275c.2.275 2.85 4.35 6.9 6.088.962.412 1.712.65 2.3.837.962.3 1.837.262 2.525.162.775-.112 2.363-.962 2.7-1.887.337-.925.337-1.712.237-1.887-.1-.175-.362-.275-.762-.475z"/>
          </svg>
          <span className="whatsapp-text">WhatsApp</span>
        </a>
      )}
    </div>
  );
};

export default Contato;
