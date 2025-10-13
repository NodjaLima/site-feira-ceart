import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, Galeria, GaleriaItem } from "../../services/apiService";
import "./GaleriaSection.css";

const GaleriaSection = () => {
  const [galeriaItems, setGaleriaItems] = useState<GaleriaItem[]>([]);
  const [galeriaAtual, setGaleriaAtual] = useState<Galeria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaleria = async () => {
      try {
        // Busca as galerias ativas
        const galerias = await apiService.getGaleriasAtivas();
        
        if (galerias.length > 0) {
          // Pega a primeira galeria ativa (mais recente)
          const primeiraGaleria = galerias[0];
          setGaleriaAtual(primeiraGaleria);
          
          // Busca os itens dessa galeria
          const items = await apiService.getGaleriaItens(primeiraGaleria.id);
          // Pega apenas os 6 primeiros para exibir na home
          setGaleriaItems(items.slice(0, 6));
        }
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
        <h2 className="galeria-title">
          {galeriaAtual ? galeriaAtual.titulo : 'GALERIA'}
        </h2>
        {galeriaAtual && galeriaAtual.descricao && (
          <p className="galeria-description">{galeriaAtual.descricao}</p>
        )}
        
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
            Ver todas as galerias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GaleriaSection;
