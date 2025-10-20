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

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
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

  const [formErrors, setFormErrors] = useState<FormErrors>({});
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Aceita telefones com 10 ou 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validar nome
    if (!formData.nome.trim()) {
      errors.nome = 'Por favor, digite seu nome completo';
    } else if (formData.nome.trim().length < 3) {
      errors.nome = 'O nome deve ter pelo menos 3 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'Por favor, digite seu e-mail';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Por favor, digite um e-mail válido (ex: seuemail@exemplo.com)';
    }

    // Validar telefone
    if (!formData.telefone.trim()) {
      errors.telefone = 'Por favor, digite seu telefone';
    } else if (!validatePhone(formData.telefone)) {
      errors.telefone = 'Por favor, digite um telefone válido com DDD (ex: 11 99999-9999)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);

    // Validar formulário antes de enviar
    if (!validateForm()) {
      setSubmitMessage({
        type: 'error',
        text: 'Por favor, corrija os erros no formulário antes de enviar'
      });
      return;
    }

    setIsSubmitting(true);

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
      setFormErrors({});

      // Limpar mensagem após 5 segundos
      setTimeout(() => setSubmitMessage(null), 5000);

    } catch (error) {
      // Capturar mensagem de erro específica do backend
      let errorMessage = 'Erro ao enviar mensagem. Por favor, verifique os dados e tente novamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      
      setSubmitMessage({
        type: 'error',
        text: errorMessage
      });

      // Limpar mensagem de erro após 7 segundos
      setTimeout(() => setSubmitMessage(null), 7000);
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
                className={formErrors.nome ? 'error' : ''}
              />
              {formErrors.nome && (
                <span className="error-message">{formErrors.nome}</span>
              )}
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
                placeholder="Digite seu e-mail (ex: seuemail@exemplo.com)"
                disabled={isSubmitting}
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
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
                className={formErrors.telefone ? 'error' : ''}
              />
              {formErrors.telefone && (
                <span className="error-message">{formErrors.telefone}</span>
              )}
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
