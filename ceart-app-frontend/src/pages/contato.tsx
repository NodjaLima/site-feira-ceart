import { useState, useEffect } from "react";
import ContatoSection from "../components/contato-section/ContatoSection";
import "./Contato.css";
import { apiService } from "../services/apiService";

interface SiteConfig {
  site_email: string;
  site_phone: string;
  site_address: string;
}

const Contato = () => {
  const [config, setConfig] = useState<SiteConfig>({
    site_email: 'contato@feiraceart.com.br',
    site_phone: '(11) 9999-9999',
    site_address: 'São Paulo, SP',
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const siteInfo = await apiService.getInfoSite();
        setConfig({
          site_email: siteInfo.site_email,
          site_phone: siteInfo.site_phone,
          site_address: siteInfo.site_address,
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
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">WhatsApp</a>
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
