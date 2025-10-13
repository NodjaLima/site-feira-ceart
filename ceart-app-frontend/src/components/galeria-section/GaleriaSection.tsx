import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, GaleriaItem } from "../../services/apiService";
import "./GaleriaSection.css";

const GaleriaSection = () => {
  const [galeriaItems, setGaleriaItems] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaleria = async () => {
      try {
        const items = await apiService.getGaleriaAtiva();
        // Pega apenas os 6 primeiros para exibir na home
        setGaleriaItems(items.slice(0, 6));
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGaleria();
  }, []);

  if (loading) {
    return (
      <section className="galeria-section">
        <div className="galeria-container">
          <p>Carregando galeria...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="galeria-section">
      <div className="galeria-container">
        <h2 className="galeria-title">GALERIA</h2>
        
        <div className="galeria-grid">
          {galeriaItems.map((item) => (
            <div key={item.id} className="galeria-card">
              <div className="galeria-image-container">
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  className="galeria-image"
                />
                <div className="galeria-overlay">
                  <span className="galeria-caption">{item.titulo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="galeria-view-all">
          <Link to="/galeria" className="galeria-view-all-btn">
            Veja todas as imagens da nossa última feira
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GaleriaSection;
