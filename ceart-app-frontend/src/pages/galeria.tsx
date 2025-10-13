import React, { useState, useEffect } from 'react';
import { apiService, Galeria as GaleriaType, GaleriaItem } from '../services/apiService';
import './Galeria.css';

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
              {galeria.titulo}
            </button>
          ))}
        </div>

        {/* Descrição da galeria selecionada */}
        {selectedGaleria && (
          <div className="galeria-info">
            <h2>{selectedGaleria.titulo}</h2>
            {selectedGaleria.descricao && <p>{selectedGaleria.descricao}</p>}
            {selectedGaleria.data_evento && (
              <p className="galeria-date">
                Data do evento: {new Date(selectedGaleria.data_evento).toLocaleDateString('pt-BR')}
              </p>
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
              <img src={item.imagem} alt={item.titulo || 'Imagem da galeria'} />
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
            
            <img src={selectedImage.imagem} alt={selectedImage.titulo || 'Imagem'} />
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
