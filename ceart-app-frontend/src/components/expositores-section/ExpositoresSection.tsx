import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, Expositor } from "../../services/apiService";
import "./ExpositoresSection.css";

const ExpositoresSection = () => {
  const [expositores, setExpositores] = useState<Expositor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpositores = async () => {
      try {
        console.log('[ExpositoresSection] Iniciando carregamento...');
        const expositoresData = await apiService.getExpositoresAtivos();
        console.log('[ExpositoresSection] Dados recebidos:', expositoresData);
        // Pega apenas os 3 primeiros para exibir na home
        setExpositores(expositoresData.slice(0, 3));
        console.log('[ExpositoresSection] Primeiros 3:', expositoresData.slice(0, 3));
      } catch (error) {
        console.error('[ExpositoresSection] Erro ao carregar:', error);
      } finally {
        console.log('[ExpositoresSection] Finalizando carregamento');
        setLoading(false);
      }
    };

    console.log('[ExpositoresSection] useEffect executado');
    fetchExpositores();
  }, []);

  if (loading) {
    return (
      <section className="home-expositores-section">
        <div className="home-expositores-container">
          <p>Carregando expositores...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="home-expositores-section">
      <div className="home-expositores-container">
        <h2 className="home-expositores-title">EXPOSITORES</h2>
        <p className="home-expositores-subtitle">Conheça alguns dos talentosos artesãos que participam da nossa feira</p>
        
        <div className="home-expositores-grid">
          {expositores.map((expositor) => (
            <div key={expositor.id} className="home-expositor-card">
              <div className="home-expositor-foto-container">
                <img
                  src={expositor.imagem}
                  alt={expositor.nome}
                  className="home-expositor-foto"
                />
              </div>
              
              <div className="home-expositor-info">
                <h3 className="home-expositor-nome">{expositor.nome}</h3>
                {expositor.contato && (
                  <p className="home-expositor-cidade">{expositor.contato}</p>
                )}
                <p className="home-expositor-descricao">{expositor.descricao}</p>
                
                <Link to={`/expositores/${expositor.id}`} className="home-expositor-btn">
                  VER PERFIL
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="home-expositores-view-all">
          <Link to="/expositores" className="home-expositores-view-all-btn">
            Conheça todos os nossos expositores
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExpositoresSection;
