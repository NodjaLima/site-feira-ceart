import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import './Galeria.css';

interface GaleriaItem {
  id: number;
  titulo: string;
  imagem: string;
  categoria: string;
  descricao: string;
  created_at?: string;
  updated_at?: string;
}

const Galeria: React.FC = () => {
  const [galeriaItens, setGaleriaItens] = useState<GaleriaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedImage, setSelectedImage] = useState<GaleriaItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar galeria da API
  useEffect(() => {
    const fetchGaleria = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGaleria();
        setGaleriaItens(data);
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGaleria();
  }, []);

  const categories = ['Todas', ...Array.from(new Set(galeriaItens.map(item => item.categoria || 'Sem categoria')))];

  const filteredItems = selectedCategory === 'Todas' 
    ? galeriaItens 
    : galeriaItens.filter(item => item.categoria === selectedCategory);

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
        <h1>Galeria de Trabalhos</h1>
        <p>Conheça a diversidade e qualidade dos trabalhos artesanais da nossa feira</p>
      </div>

      <div className="galeria-container">
        {/* Filtros */}
        <div className="galeria-filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid de imagens */}
        <div className="galeria-grid">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="galeria-item"
              onClick={() => openModal(item)}
            >
              <img src={item.imagem} alt={item.titulo} />
              <div className="galeria-item-overlay">
                <h3>{item.titulo}</h3>
                <p>{item.categoria}</p>
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
            
            <img src={selectedImage.imagem} alt={selectedImage.titulo} />
            <div className="modal-info">
              <h3>{selectedImage.titulo}</h3>
              <p className="modal-category">{selectedImage.categoria}</p>
              <p className="modal-description">{selectedImage.descricao}</p>
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
