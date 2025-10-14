import { useState, useEffect } from "react";
import "./ContatoSection.css";
import { apiService } from "../../services/apiService";

interface SiteConfig {
  site_email: string;
  site_phone: string;
  site_address: string;
}

const ContatoSection = () => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário
    console.log("Formulário enviado!");
  };

  return (
    <section className="contato-section">
      <div className="contato-container">
        <div className="contato-header">
          <h2 className="contato-title">ENTRE EM CONTATO</h2>
          <p className="contato-subtitle">
            Ficou interessado em participar da feira? Preencha o formulário abaixo e entraremos em contato com você
          </p>
        </div>
        
        <div className="contato-content">
          <div className="contato-info">
            <h3>Informações de Contato</h3>
            <div className="info-item">
              <i className="icon-phone"></i>
              <span>{config.site_phone}</span>
            </div>
            <div className="info-item">
              <i className="icon-email"></i>
              <span>{config.site_email}</span>
            </div>
            <div className="info-item">
              <i className="icon-location"></i>
              <span>{config.site_address}</span>
            </div>
          </div>
          
          <form className="contato-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                placeholder="Digite seu nome completo"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Digite seu e-mail"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="mensagem">Mensagem (Opcional)</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                placeholder="Conte-nos mais sobre seu interesse em participar da feira"
              />
            </div>
            
            <button type="submit" className="contato-btn">
              ENVIAR MENSAGEM
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContatoSection;
