import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Expositor } from '../services/apiService';
import '../styles/Expositores.css';

const Expositores = () => {
  const [allExpositores, setAllExpositores] = useState<Expositor[]>([]);
  const [expositores, setExpositores] = useState<Expositor[]>([]);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const expositoresPerPage = 6;

  const [especialidades, setEspecialidades] = useState<string[]>(['Todas']);

  // Carregar dados iniciais
  useEffect(() => {
    const fetchExpositores = async () => {
      try {
        setLoading(true);
        const expositoresData = await apiService.getExpositoresAtivos();
        setAllExpositores(expositoresData);
        
        // Extrair especialidades únicas
        const especialidadesUnicas = ['Todas', ...new Set(expositoresData.map(exp => exp.especialidade))];
        setEspecialidades(especialidadesUnicas);
        
      } catch (error) {
        console.error('Erro ao carregar expositores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpositores();
  }, []);

  // Filtrar expositores
  useEffect(() => {
    let filteredExpositores = allExpositores;

    // Filtrar por especialidade
    if (selectedEspecialidade !== 'Todas') {
      filteredExpositores = allExpositores.filter(exp => exp.especialidade === selectedEspecialidade);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filteredExpositores = filteredExpositores.filter(expositor =>
        expositor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expositor.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expositor.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expositor.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expositor.produtos.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setExpositores(filteredExpositores);
    setCurrentPage(1);
  }, [allExpositores, selectedEspecialidade, searchTerm]);

  // Paginação
  const indexOfLastExpositor = currentPage * expositoresPerPage;
  const indexOfFirstExpositor = indexOfLastExpositor - expositoresPerPage;
  const currentExpositores = expositores.slice(indexOfFirstExpositor, indexOfLastExpositor);
  const totalPages = Math.ceil(expositores.length / expositoresPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = (expositor: Expositor) => {
    if (expositor.contato_whatsapp) {
      const message = `Olá ${expositor.nome}! Gostaria de saber mais sobre seus produtos artesanais.`;
      const whatsappUrl = `https://wa.me/55${expositor.contato_whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="expositores-page">
        <div className="expositores-page-container">
          <p>Carregando expositores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expositores-page">
      {/* Header da página */}
      <div className="expositores-page-header">
        <div className="expositores-page-header-content">
          <h1 className="expositores-page-title">NOSSOS EXPOSITORES</h1>
          <p className="expositores-page-subtitle">
            Conheça os talentosos artesãos que fazem parte da nossa feira cultural. 
            Cada um com sua especialidade e história única para contar.
          </p>
        </div>
      </div>

      <div className="expositores-page-container">
        {/* Filtros e busca */}
        <div className="expositores-filters">
          <div className="expositores-search">
            <input
              type="text"
              placeholder="Buscar expositores, especialidades ou produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="expositores-search-input"
            />
          </div>
          
          <div className="expositores-especialidades">
            {especialidades.map((especialidade) => (
              <button
                key={especialidade}
                onClick={() => setSelectedEspecialidade(especialidade)}
                className={`expositores-especialidade-btn ${selectedEspecialidade === especialidade ? 'active' : ''}`}
              >
                {especialidade}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="expositores-results">
          <p className="expositores-results-count">
            {expositores.length} {expositores.length === 1 ? 'expositor encontrado' : 'expositores encontrados'}
          </p>
        </div>

        {/* Grid de expositores */}
        <div className="expositores-grid">
          {currentExpositores.map((expositor) => (
            <div key={expositor.id} className="expositor-card">
              <div className="expositor-foto-container">
                <img src={expositor.foto} alt={expositor.nome} className="expositor-foto" />
              </div>
              
              <div className="expositor-content">
                <div className="expositor-main-info">
                  <h3 className="expositor-nome">{expositor.nome}</h3>
                  <p className="expositor-localizacao">{expositor.cidade}, {expositor.estado}</p>
                  <p className="expositor-especialidade-texto">{expositor.especialidade}</p>
                  <p className="expositor-descricao">{expositor.descricao}</p>
                </div>
                
                <div className="expositor-actions">
                  <Link 
                    to={`/expositores/${expositor.id}`}
                    className="expositor-view-btn"
                  >
                    Ver Perfil
                  </Link>
                  <button 
                    onClick={() => handleContactClick(expositor)}
                    className="expositor-contact-btn"
                  >
                    <span className="whatsapp-icon">📱</span>
                    Contatar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {expositores.length === 0 && (
          <div className="expositores-no-results">
            <h3>Nenhum expositor encontrado</h3>
            <p>Tente ajustar os filtros ou termos de busca.</p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="expositores-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="expositores-pagination-btn"
            >
              ← Anterior
            </button>
            
            <div className="expositores-pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`expositores-pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="expositores-pagination-btn"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* Call to action */}
        <div className="expositores-cta">
          <div className="expositores-cta-content">
            <h3>Interessado em participar?</h3>
            <p>Se você é artesão e gostaria de expor seus produtos em nossa feira, entre em contato conosco!</p>
            <Link to="/contato" className="expositores-cta-btn">
              Quero Participar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expositores;
