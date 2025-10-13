import { useEffect, useState } from "react";
import "../styles/Regulamento.css";
import { useRegulamento, Regulamento as RegulamentoType } from "../services/apiService";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://site-feira-ceart-production.up.railway.app';

const Regulamento = () => {
  const [regulamento, setRegulamento] = useState<RegulamentoType | null>(null);
  const [loading, setLoading] = useState(true);
  const { getRegulamentoAtivo } = useRegulamento();

  useEffect(() => {
    const fetchRegulamento = async () => {
      try {
        const data = await getRegulamentoAtivo();
        setRegulamento(data);
      } catch (error) {
        console.error("Erro ao carregar regulamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegulamento();
  }, [getRegulamentoAtivo]);

  const handleDownloadRegulamento = () => {
    if (regulamento?.arquivo_pdf) {
      const link = document.createElement('a');
      link.href = `${API_BASE_URL}${regulamento.arquivo_pdf}`;
      link.download = `regulamento-feira-ceart-${regulamento.ano}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="regulamento-page">
        <div className="regulamento-container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando regulamento...</p>
        </div>
      </div>
    );
  }

  if (!regulamento) {
    return (
      <div className="regulamento-page">
        <div className="regulamento-container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Regulamento não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="regulamento-page">
      <div className="regulamento-header">
        <div className="regulamento-header-content">
          <h1 className="regulamento-title">REGULAMENTO</h1>
          <p className="regulamento-subtitle">
            {regulamento.subtitulo}
          </p>
        </div>
      </div>

      <div className="regulamento-container">
        <div className="regulamento-content">
          
          <div 
            className="regulamento-dynamic-content"
            dangerouslySetInnerHTML={{ __html: regulamento.conteudo }}
          />

          {regulamento.arquivo_pdf && (
            <div className="regulamento-download">
              <button 
                onClick={handleDownloadRegulamento}
                className="regulamento-download-btn"
              >
                <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L7 11L8.4 9.6L11 12.2V4H13V12.2L15.6 9.6L17 11L12 16Z" fill="currentColor"/>
                  <path d="M5 20H19V18H5V20Z" fill="currentColor"/>
                </svg>
                Baixar Regulamento Completo (PDF)
              </button>
              <p className="regulamento-download-info">
                Arquivo PDF com o regulamento completo e formulários de inscrição
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Regulamento;
