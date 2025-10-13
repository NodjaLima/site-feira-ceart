import { useState, useEffect } from "react";
import "./CarrosselDestaque.css";

// Dados estáticos para teste
const STATIC_CAROUSEL_DATA = [
  { 
    id: 1, 
    titulo: "Feira CEART 2025", 
    imagem: "/logo.png", 
    ordem: 1, 
    ativo: true 
  },
  { 
    id: 2, 
    titulo: "Arte e Cultura", 
    imagem: "/vite.svg", 
    ordem: 2, 
    ativo: true 
  }
];

const CarrosselDestaque = () => {
  const [carrosselItems] = useState(STATIC_CAROUSEL_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (carrosselItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === carrosselItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [carrosselItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carrosselItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carrosselItems.length - 1 ? 0 : currentIndex + 1);
  };

  // Handler para erro de carregamento de imagem
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    console.log('Erro ao carregar imagem:', img.src);
    img.src = '/logo.png'; // Fallback para logo
  };

  if (carrosselItems.length === 0) {
    return (
      <div className="carrossel-container">
        <div className="carrossel-slide active">
          <img 
            src="/logo.png" 
            alt="Feira CEART" 
            onError={handleImageError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="carrossel-container">
      <div className="carrossel-wrapper">
        {carrosselItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`carrossel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img 
              src={item.imagem} 
              alt={item.titulo}
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
      
      {carrosselItems.length > 1 && (
        <>
          <button className="carrossel-button prev" onClick={goToPrevious}>
            &#8249;
          </button>
          <button className="carrossel-button next" onClick={goToNext}>
            &#8250;
          </button>
          
          <div className="carrossel-dots">
            {carrosselItems.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarrosselDestaque;