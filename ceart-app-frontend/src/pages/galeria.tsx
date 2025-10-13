import React, { useState, useEffect } from 'react';
import { apiService, Galeria as GaleriaType, GaleriaItem } from '../services/apiService';
import './Galeria.css';

// URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://site-feira-ceart-production.up.railway.app/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', ''); // Remove /api para obter a URL base do backend

// Helper para construir URL completa da imagem
const getImageUrl = (imagePath: string) => {
  // Se já for uma URL completa (http/https), retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Se for um caminho relativo, adiciona a URL base do backend
  return `${BACKEND_BASE_URL}${imagePath}`;
};

const Galeria: React.FC = () => {
  const [galerias, setGalerias] = useState<GaleriaType[]>([]);
  const [selectedGaleria, setSelectedGaleria] = useState<GaleriaType | null>(null);
  const [galeriaItens, setGaleriaItens] = useState<GaleriaItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GaleriaItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar galerias da API
  useEffect(() => {
    const fetchGalerias = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGaleriasAtivas();
        setGalerias(data);
        
        // Seleciona automaticamente a primeira galeria
        if (data.length > 0) {
          setSelectedGaleria(data[0]);
          const itens = await apiService.getGaleriaItens(data[0].id);
          setGaleriaItens(itens);
        }
      } catch (error) {
        console.error('Erro ao carregar galerias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalerias();
  }, []);

  // Trocar galeria
  const handleGaleriaChange = async (galeria: GaleriaType) => {
    setSelectedGaleria(galeria);
    try {
      const itens = await apiService.getGaleriaItens(galeria.id);
      setGaleriaItens(itens);
    } catch (error) {
      console.error('Erro ao carregar itens da galeria:', error);
    }
  };

  const filteredItems = galeriaItens;

  const openModal = (item: GaleriaItem) => {
    setSelectedImage(item);
    // Adiciona foco ao modal para suporte ao teclado
    setTimeout(() => {
      const modal = document.querySelector('.galeria-modal') as HTMLElement;
      if (modal) {
        modal.focus();
      }
    }, 100);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const getCurrentImageIndex = () => {
    if (!selectedImage) return -1;
    return filteredItems.findIndex(item => item.id === selectedImage.id);
  };

  const goToNextImage = () => {
    const currentIndex = getCurrentImageIndex();
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1]);
    }
  };

  const goToPreviousImage = () => {
    const currentIndex = getCurrentImageIndex();
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPreviousImage();
    } else if (e.key === 'ArrowRight') {
      goToNextImage();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="galeria-page">
        <div className="galeria-header">
          <h1>GALERIA DE ARTES</h1>
        </div>
        <div className="galeria-container">
          <p>Carregando galeria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galeria-page">
      <div className="galeria-header">
        <h1>Galerias de Fotos</h1>
        <p>Veja as fotos das edições da Feira CEART</p>
      </div>

      <div className="galeria-container">
        {/* Seletor de Galerias */}
        <div className="galeria-filters">
          {galerias.map(galeria => (
            <button
              key={galeria.id}
              onClick={() => handleGaleriaChange(galeria)}
              className={`filter-btn ${selectedGaleria?.id === galeria.id ? 'active' : ''}`}
            >
              <span className="filter-btn-title">{galeria.titulo}</span>
              {galeria.data_evento && (
                <span className="filter-btn-date">
                  {new Date(galeria.data_evento).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Descrição da galeria selecionada */}
        {selectedGaleria && (
          <div className="galeria-info-section">
            <div className="galeria-info-header">
              <h2 className="galeria-info-title">{selectedGaleria.titulo}</h2>
              {selectedGaleria.data_evento && (
                <div className="galeria-info-date">
                  <svg className="calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>
                    {new Date(selectedGaleria.data_evento).toLocaleDateString('pt-BR', { 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              )}
            </div>
            {selectedGaleria.descricao && (
              <p className="galeria-info-description">{selectedGaleria.descricao}</p>
            )}
          </div>
        )}

        {/* Grid de imagens */}
        <div className="galeria-grid">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="galeria-item"
              onClick={() => openModal(item)}
            >
              <img src={getImageUrl(item.imagem)} alt={item.titulo || 'Imagem da galeria'} />
              <div className="galeria-item-overlay">
                <h3>{item.titulo || 'Sem título'}</h3>
                {item.descricao && <p>{item.descricao}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas */}
        <div className="galeria-stats">
          <p>Mostrando {filteredItems.length} de {galeriaItens.length} trabalhos</p>
        </div>
      </div>

      {/* Modal para imagem ampliada */}
      {selectedImage && (
        <div className="galeria-modal" onClick={closeModal} onKeyDown={handleKeyPress} tabIndex={0}>
          <div className="galeria-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {/* Seta anterior */}
            {getCurrentImageIndex() > 0 && (
              <button className="modal-nav modal-prev" onClick={goToPreviousImage}>
                ‹
              </button>
            )}
            
            {/* Seta próxima */}
            {getCurrentImageIndex() < filteredItems.length - 1 && (
              <button className="modal-nav modal-next" onClick={goToNextImage}>
                ›
              </button>
            )}
            
            <img src={getImageUrl(selectedImage.imagem)} alt={selectedImage.titulo || 'Imagem'} />
            <div className="modal-info">
              <h3>{selectedImage.titulo || 'Sem título'}</h3>
              {selectedImage.descricao && (
                <p className="modal-description">{selectedImage.descricao}</p>
              )}
              <div className="modal-counter">
                {getCurrentImageIndex() + 1} de {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeria;
