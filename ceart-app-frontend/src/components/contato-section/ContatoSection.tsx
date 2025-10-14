import { useState, useEffect } from "react";
import "./ContatoSection.css";
import { apiService } from "../../services/apiService";

interface SiteConfig {
  site_email: string;
  site_phone: string;
  site_address: string;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

const ContatoSection = () => {
  const [config, setConfig] = useState<SiteConfig>({
    site_email: 'contato@feiraceart.com.br',
    site_phone: '(11) 9999-9999',
    site_address: 'São Paulo, SP',
  });

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await apiService.enviarContato(formData);
      
      setSubmitMessage({
        type: 'success',
        text: result.message || 'Mensagem enviada com sucesso! Em breve entraremos em contato.'
      });

      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        mensagem: ''
      });

      // Limpar mensagem após 5 segundos
      setTimeout(() => setSubmitMessage(null), 5000);

    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.'
      });

      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => setSubmitMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
            {submitMessage && (
              <div className={`form-message ${submitMessage.type}`}>
                {submitMessage.text}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Digite seu nome completo"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Digite seu e-mail"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                placeholder="(11) 99999-9999"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="mensagem">Mensagem (Opcional)</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                rows={4}
                placeholder="Conte-nos mais sobre seu interesse em participar da feira"
                disabled={isSubmitting}
              />
            </div>
            
            <button type="submit" className="contato-btn" disabled={isSubmitting}>
              {isSubmitting ? 'ENVIANDO...' : 'ENVIAR MENSAGEM'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContatoSection;
