import React, { useState } from 'react';
import './Galeria.css';

interface GaleriaItem {
  id: number;
  titulo: string;
  imagem: string;
  categoria: string;
  descricao: string;
}

const mockGaleriaItens: GaleriaItem[] = [
  {
    id: 1,
    titulo: "Cerâmica Artesanal",
    imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    categoria: "Cerâmica",
    descricao: "Vasos decorativos únicos feitos à mão"
  },
  {
    id: 2,
    titulo: "Móveis Rústicos",
    imagem: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    categoria: "Marcenaria",
    descricao: "Móveis artesanais em madeira sustentável"
  },
  {
    id: 3,
    titulo: "Tecidos Naturais",
    imagem: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
    categoria: "Têxtil",
    descricao: "Tecidos tingidos com plantas naturais"
  },
  {
    id: 4,
    titulo: "Joias Artesanais",
    imagem: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    categoria: "Ourivesaria",
    descricao: "Joias únicas com pedras brasileiras"
  },
  {
    id: 5,
    titulo: "Cestas de Fibra",
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    categoria: "Fibras",
    descricao: "Cestas sustentáveis de fibras naturais"
  },
  {
    id: 6,
    titulo: "Esculturas em Pedra",
    imagem: "https://images.unsplash.com/photo-1544967890-1ad5dbaac10d?w=600",
    categoria: "Escultura",
    descricao: "Arte em pedra sabão mineira"
  },
  {
    id: 7,
    titulo: "Bordados Tradicionais",
    imagem: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600",
    categoria: "Bordado",
    descricao: "Bordados à mão com técnicas ancestrais"
  },
  {
    id: 8,
    titulo: "Produtos de Couro",
    imagem: "https://images.unsplash.com/photo-1544966503-7e44e1e03652?w=600",
    categoria: "Couro",
    descricao: "Artigos de couro com técnicas tradicionais"
  },
  {
    id: 9,
    titulo: "Instrumentos Musicais",
    imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    categoria: "Música",
    descricao: "Instrumentos artesanais de madeira"
  },
  {
    id: 10,
    titulo: "Arte em Madeira",
    imagem: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600",
    categoria: "Marcenaria",
    descricao: "Peças decorativas entalhadas à mão"
  },
  {
    id: 11,
    titulo: "Pinturas em Tecido",
    imagem: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600",
    categoria: "Arte",
    descricao: "Técnicas de pintura em tecido"
  },
  {
    id: 12,
    titulo: "Objetos Decorativos",
    imagem: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600",
    categoria: "Decoração",
    descricao: "Peças únicas para decoração"
  }
];

const Galeria: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedImage, setSelectedImage] = useState<GaleriaItem | null>(null);

  const categories = ['Todas', ...Array.from(new Set(mockGaleriaItens.map(item => item.categoria)))];

  const filteredItems = selectedCategory === 'Todas' 
    ? mockGaleriaItens 
    : mockGaleriaItens.filter(item => item.categoria === selectedCategory);

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
          <p>Mostrando {filteredItems.length} de {mockGaleriaItens.length} trabalhos</p>
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
