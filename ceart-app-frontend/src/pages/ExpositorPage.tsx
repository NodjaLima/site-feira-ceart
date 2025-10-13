import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExpositorById, Expositor } from '../data/mockData';
import './ExpositorPage.css';

const ExpositorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expositor, setExpositor] = useState<Expositor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      const foundExpositor = getExpositorById(parseInt(id));
      setExpositor(foundExpositor || null);
      setLoading(false);
    }
  }, [id]);

  const handleWhatsApp = () => {
    if (expositor) {
      const message = `Olá ${expositor.nome}! Vi seu trabalho no site da feira CEART e gostaria de saber mais sobre seus produtos.`;
      const url = `https://wa.me/${expositor.contato.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const handleInstagram = () => {
    if (expositor?.contato.instagram) {
      window.open(`https://instagram.com/${expositor.contato.instagram.replace('@', '')}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (expositor) {
      const subject = `Contato via CEART - ${expositor.nome}`;
      const body = `Olá ${expositor.nome}!\n\nVi seu trabalho no site da feira CEART e gostaria de saber mais sobre seus produtos.\n\nAguardo seu contato.\n\nObrigado(a)!`;
      window.open(`mailto:${expositor.contato.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
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
              <img src={expositor.foto} alt={expositor.nome} />
            </div>
            
            <div className="expositor-hero-info">
              <h1 className="expositor-hero-name">{expositor.nome}</h1>
              <p className="expositor-hero-location">{expositor.cidade}, {expositor.estado}</p>
              <p className="expositor-hero-specialty">{expositor.especialidade}</p>
              <p className="expositor-hero-experience">{expositor.anosExperiencia} anos de experiência</p>
              
              <div className="expositor-hero-contact">
                <button className="expositor-hero-btn" onClick={handleWhatsApp}>
                  <span className="whatsapp-icon">📱</span>
                  Conversar no WhatsApp
                </button>
                
                <div className="expositor-hero-social">
                  {expositor.contato.instagram && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleInstagram(); }}
                      className="social-link"
                      title="Instagram"
                    >
                      📷
                    </a>
                  )}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleEmail(); }}
                    className="social-link"
                    title="Email"
                  >
                    ✉️
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="expositor-content">
        {/* Biografia */}
        <section>
          <h2>Sobre {expositor.nome}</h2>
          <div className="bio-content">
            <p>{expositor.biografia}</p>
          </div>
        </section>

        {/* Galeria */}
        {expositor.galeria && expositor.galeria.length > 0 && (
          <section>
            <h2>Galeria de Trabalhos</h2>
            <div className="galeria-main">
              <div className="galeria-featured">
                <img 
                  src={expositor.galeria[selectedImage]} 
                  alt={`Trabalho ${selectedImage + 1} de ${expositor.nome}`} 
                />
              </div>
              
              <div className="galeria-thumbnails">
                {expositor.galeria.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`Miniatura ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Produtos */}
        <section>
          <h2>Produtos e Especialidades</h2>
          <div className="produtos-grid">
            {expositor.produtos.map((produto: string, index: number) => (
              <div key={index} className="produto-item">
                <h4>{produto}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Destaques */}
        <section>
          <h2>Destaques e Conquistas</h2>
          <div className="destaques-list">
            {expositor.destaques.map((destaque: string, index: number) => (
              <div key={index} className="destaque-item">
                <span className="destaque-icon">🏆</span>
                <span className="destaque-text">{destaque}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contato */}
        <section>
          <h2>Entre em Contato</h2>
          <div className="contato-grid">
            <div className="contato-item">
              <span className="contato-icon">📱</span>
              <div>
                <h4>Telefone/WhatsApp</h4>
                <p>{expositor.contato.telefone}</p>
              </div>
            </div>
            
            <div className="contato-item">
              <span className="contato-icon">✉️</span>
              <div>
                <h4>Email</h4>
                <p>{expositor.contato.email}</p>
              </div>
            </div>
            
            {expositor.contato.instagram && (
              <div className="contato-item">
                <span className="contato-icon">📷</span>
                <div>
                  <h4>Instagram</h4>
                  <p>{expositor.contato.instagram}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="contato-cta">
            <button className="contato-cta-btn" onClick={handleWhatsApp}>
              <span className="whatsapp-icon">📱</span>
              Conversar pelo WhatsApp
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExpositorPage;
