import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Expositor } from '../services/apiService';
import './ExpositorPage.css';

const ExpositorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expositor, setExpositor] = useState<Expositor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpositor = async () => {
      if (id) {
        try {
          const foundExpositor = await apiService.getExpositorById(parseInt(id));
          setExpositor(foundExpositor);
        } catch (error) {
          console.error('Erro ao carregar expositor:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExpositor();
  }, [id]);

  const handleWhatsApp = () => {
    if (expositor?.telefone) {
      const message = `Olá ${expositor.nome}! Vi seu trabalho no site da feira CEART e gostaria de saber mais sobre seus produtos.`;
      const telefone = expositor.telefone.replace(/\D/g, '');
      const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const handleInstagram = () => {
    if (expositor?.site && expositor.site.includes('@')) {
      window.open(`https://instagram.com/${expositor.site.replace('@', '')}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (expositor?.email) {
      const subject = `Contato via CEART - ${expositor.nome}`;
      const body = `Olá ${expositor.nome}!\n\nVi seu trabalho no site da feira CEART e gostaria de saber mais sobre seus produtos.\n\nAguardo seu contato.\n\nObrigado(a)!`;
      window.open(`mailto:${expositor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="expositor-page">
        <div className="expositor-loading">
          <div className="loading-spinner"></div>
          <p>Carregando perfil do expositor...</p>
        </div>
      </div>
    );
  }

  if (!expositor) {
    return (
      <div className="expositor-page">
        <div className="expositor-not-found">
          <h2>Expositor não encontrado</h2>
          <p>O expositor que você está procurando não foi encontrado.</p>
          <Link to="/expositores">Voltar para lista de expositores</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="expositor-page">
      {/* Header com gradiente */}
      <header className="expositor-header">
        <div className="expositor-header-content">
          <Link to="/expositores" className="back-button">
            <span className="back-arrow">←</span>
            Voltar para Expositores
          </Link>
          
          <div className="expositor-hero">
            <div className="expositor-hero-image">
              <img src={expositor.imagem || '/logo.png'} alt={expositor.nome} />
            </div>
            
            <div className="expositor-hero-info">
              <h1 className="expositor-hero-name">{expositor.nome}</h1>
              {expositor.contato && <p className="expositor-hero-location">{expositor.contato}</p>}
              <p className="expositor-hero-specialty">{expositor.categoria}</p>
              
              <div className="expositor-hero-contact">
                {expositor.telefone && (
                  <button className="expositor-hero-btn" onClick={handleWhatsApp}>
                    <span className="whatsapp-icon">📱</span>
                    Conversar no WhatsApp
                  </button>
                )}
                
                <div className="expositor-hero-social">
                  {expositor.site && expositor.site.includes('@') && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleInstagram(); }}
                      className="social-link"
                      title="Instagram"
                    >
                      📷
                    </a>
                  )}
                  {expositor.email && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleEmail(); }}
                      className="social-link"
                      title="Email"
                    >
                      ✉️
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="expositor-content">
        {/* Descrição */}
        <section>
          <h2>Sobre {expositor.nome}</h2>
          <div className="bio-content">
            <p>{expositor.descricao}</p>
          </div>
        </section>

        {/* Contato */}
        <section>
          <h2>Entre em Contato</h2>
          <div className="contato-grid">
            {expositor.telefone && (
              <div className="contato-item">
                <span className="contato-icon">📱</span>
                <div>
                  <h4>Telefone/WhatsApp</h4>
                  <p>{expositor.telefone}</p>
                </div>
              </div>
            )}
            
            {expositor.email && (
              <div className="contato-item">
                <span className="contato-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>{expositor.email}</p>
                </div>
              </div>
            )}
            
            {expositor.site && expositor.site.includes('@') && (
              <div className="contato-item">
                <span className="contato-icon">📷</span>
                <div>
                  <h4>Instagram</h4>
                  <p>{expositor.site}</p>
                </div>
              </div>
            )}
          </div>
          
          {expositor.telefone && (
            <div className="contato-cta">
              <button className="contato-cta-btn" onClick={handleWhatsApp}>
                <span className="whatsapp-icon">📱</span>
                Conversar pelo WhatsApp
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ExpositorPage;
