import { useState, useEffect } from "react";
import "./CarrosselDestaque.css";
import { apiService, CarrosselItem } from "../../services/apiService";

const CarrosselDestaque = () => {
  const [carrosselItems, setCarrosselItems] = useState<CarrosselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Buscar dados do carrossel da API
  useEffect(() => {
    const fetchCarrossel = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCarrosselAtivo();
        setCarrosselItems(data);
      } catch (err) {
        console.error('Erro ao carregar carrossel:', err);
        // Fallback para dados estáticos
        setCarrosselItems([
          { 
            id: 1, 
            titulo: "Feira CEART 2025", 
            imagem: "/logo.png", 
            ordem: 1, 
            ativo: true 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrossel();
  }, []);

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

  if (loading) {
    return (
      <div className="carrossel-container">
        <div className="carrossel-slide active">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            color: '#666'
          }}>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

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