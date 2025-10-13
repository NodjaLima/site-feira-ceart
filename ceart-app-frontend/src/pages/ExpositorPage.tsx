import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Expositor } from '../services/apiService';
import './ExpositorPage.css';

const ExpositorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expositor, setExpositor] = useState<Expositor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [galeriaImagens, setGaleriaImagens] = useState<string[]>([]);

  useEffect(() => {
    const fetchExpositor = async () => {
      if (id) {
        try {
          const foundExpositor = await apiService.getExpositorById(parseInt(id));
          setExpositor(foundExpositor);
          
          // Parse da galeria de imagens
          if (foundExpositor?.galeria_imagens) {
            try {
              const galeriaArray = JSON.parse(foundExpositor.galeria_imagens);
              if (Array.isArray(galeriaArray)) {
                setGaleriaImagens(galeriaArray);
              }
            } catch (e) {
              console.error('Erro ao parsear galeria_imagens:', e);
            }
          }
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
    if (expositor?.instagram) {
      const username = expositor.instagram.replace('@', '').replace('instagram.com/', '').replace('https://', '').replace('http://', '');
      window.open(`https://instagram.com/${username}`, '_blank');
    }
  };

  const handleFacebook = () => {
    if (expositor?.facebook) {
      const url = expositor.facebook.startsWith('http') ? expositor.facebook : `https://${expositor.facebook}`;
      window.open(url, '_blank');
    }
  };

  // Funções do modal de galeria
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < galeriaImagens.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const goToPreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeImageModal();
    } else if (e.key === 'ArrowLeft') {
      goToPreviousImage();
    } else if (e.key === 'ArrowRight') {
      goToNextImage();
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
                  {expositor.instagram && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleInstagram(); }}
                      className="social-link"
                      title="Instagram"
                    >
                      📷
                    </a>
                  )}
                  {expositor.facebook && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleFacebook(); }}
                      className="social-link"
                      title="Facebook"
                    >
                      👥
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

        {/* Galeria de Trabalhos */}
        {galeriaImagens.length > 0 && (
          <section className="galeria-trabalhos">
            <h2>Galeria de Trabalhos</h2>
            <div className="galeria-grid">
              {galeriaImagens.map((imagemUrl: string, index: number) => (
                <div 
                  key={index} 
                  className="galeria-item"
                  onClick={() => openImageModal(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={imagemUrl} 
                    alt={`Trabalho ${index + 1} de ${expositor.nome}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

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
            
            {expositor.instagram && (
              <div className="contato-item">
                <span className="contato-icon">📷</span>
                <div>
                  <h4>Instagram</h4>
                  <p>{expositor.instagram}</p>
                </div>
              </div>
            )}
            
            {expositor.facebook && (
              <div className="contato-item">
                <span className="contato-icon">👥</span>
                <div>
                  <h4>Facebook</h4>
                  <p>{expositor.facebook}</p>
                </div>
              </div>
            )}
            
            {expositor.site && (
              <div className="contato-item">
                <span className="contato-icon">🌐</span>
                <div>
                  <h4>Site/Loja Online</h4>
                  <p>{expositor.site}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de Galeria */}
      {selectedImageIndex !== null && (
        <div 
          className="galeria-modal"
          onClick={closeImageModal}
          onKeyDown={handleKeyPress}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="galeria-modal-close" 
            onClick={closeImageModal}
            aria-label="Fechar"
          >
            ×
          </button>
          
          {selectedImageIndex > 0 && (
            <button 
              className="galeria-modal-nav galeria-modal-prev"
              onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
              aria-label="Imagem anterior"
            >
              ‹
            </button>
          )}
          
          <div className="galeria-modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={galeriaImagens[selectedImageIndex]} 
              alt={`Trabalho ${selectedImageIndex + 1} de ${expositor.nome}`}
            />
            <div className="galeria-modal-info">
              <h3>Trabalho {selectedImageIndex + 1} de {galeriaImagens.length}</h3>
              <p>{expositor.nome}</p>
            </div>
          </div>
          
          {selectedImageIndex < galeriaImagens.length - 1 && (
            <button 
              className="galeria-modal-nav galeria-modal-next"
              onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
              aria-label="Próxima imagem"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpositorPage;
