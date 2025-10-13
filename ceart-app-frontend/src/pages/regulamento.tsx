import "../styles/Regulamento.css";

const Regulamento = () => {
  const handleDownloadRegulamento = () => {
    // Simular download do arquivo PDF
    const link = document.createElement('a');
    link.href = '/regulamento-feira-ceart-2025.pdf';
    link.download = 'regulamento-feira-ceart-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="regulamento-page">
      {/* Header da página */}
      <div className="regulamento-header">
        <div className="regulamento-header-content">
          <h1 className="regulamento-title">REGULAMENTO</h1>
          <p className="regulamento-subtitle">
            Feira Cultural de Arte e Artesanato - CEART 2025
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="regulamento-container">
        <div className="regulamento-content">
          
          {/* Seção de Introdução */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Disposições Gerais</h2>
            <p className="regulamento-text">
              A Feira Cultural de Arte e Artesanato - CEART 2025 tem como objetivo promover, 
              valorizar e divulgar o trabalho de artesãos e artistas locais, proporcionando 
              um espaço de comercialização, intercâmbio cultural e preservação das tradições 
              artesanais da nossa região.
            </p>
          </section>

          {/* Seção de Participação */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Da Participação</h2>
            <div className="regulamento-items">
              <div className="regulamento-item">
                <h3 className="regulamento-item-title">1. Inscrições</h3>
                <p className="regulamento-text">
                  Podem participar artesãos e artistas maiores de 18 anos, devidamente 
                  inscritos até a data limite estabelecida no cronograma oficial.
                </p>
              </div>
              
              <div className="regulamento-item">
                <h3 className="regulamento-item-title">2. Documentação Necessária</h3>
                <ul className="regulamento-list">
                  <li>Formulário de inscrição devidamente preenchido</li>
                  <li>Cópia do documento de identidade (RG) e CPF</li>
                  <li>Comprovante de residência</li>
                  <li>Portfólio com fotos dos produtos a serem comercializados</li>
                  <li>Declaração de autenticidade dos produtos artesanais</li>
                </ul>
              </div>

              <div className="regulamento-item">
                <h3 className="regulamento-item-title">3. Critérios de Seleção</h3>
                <p className="regulamento-text">
                  A seleção será baseada na originalidade, qualidade técnica, 
                  valor cultural e adequação aos objetivos da feira.
                </p>
              </div>
            </div>
          </section>

          {/* Seção de Produtos */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Dos Produtos</h2>
            <div className="regulamento-items">
              <div className="regulamento-item">
                <h3 className="regulamento-item-title">4. Produtos Permitidos</h3>
                <ul className="regulamento-list">
                  <li>Peças de cerâmica e olaria</li>
                  <li>Trabalhos em madeira e marcenaria artística</li>
                  <li>Produtos têxteis e bordados</li>
                  <li>Joias e bijuterias artesanais</li>
                  <li>Trabalhos com fibras naturais</li>
                  <li>Esculturas em pedra e outros materiais</li>
                  <li>Produtos em couro</li>
                  <li>Pinturas e artes visuais</li>
                </ul>
              </div>

              <div className="regulamento-item">
                <h3 className="regulamento-item-title">5. Produtos Não Permitidos</h3>
                <ul className="regulamento-list">
                  <li>Produtos industrializados ou de revenda</li>
                  <li>Alimentos perecíveis</li>
                  <li>Produtos que infrinjam direitos autorais</li>
                  <li>Materiais que possam causar danos ao meio ambiente</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seção de Espaços */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Dos Espaços e Estrutura</h2>
            <div className="regulamento-items">
              <div className="regulamento-item">
                <h3 className="regulamento-item-title">6. Espaços de Exposição</h3>
                <p className="regulamento-text">
                  Cada expositor receberá um espaço de 3m x 2m, incluindo mesa, 
                  cadeira e identificação. A organização fornecerá energia elétrica 
                  básica (110V).
                </p>
              </div>

              <div className="regulamento-item">
                <h3 className="regulamento-item-title">7. Montagem e Desmontagem</h3>
                <p className="regulamento-text">
                  A montagem deverá ser realizada no dia anterior ao evento, 
                  das 14h às 18h. A desmontagem ocorrerá no último dia, 
                  após o encerramento oficial.
                </p>
              </div>
            </div>
          </section>

          {/* Seção de Responsabilidades */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Das Responsabilidades</h2>
            <div className="regulamento-items">
              <div className="regulamento-item">
                <h3 className="regulamento-item-title">8. Do Expositor</h3>
                <ul className="regulamento-list">
                  <li>Manter o espaço limpo e organizado</li>
                  <li>Estar presente durante todo o horário de funcionamento</li>
                  <li>Apresentar produtos de qualidade e procedência</li>
                  <li>Respeitar os demais expositores e visitantes</li>
                  <li>Cumprir os horários estabelecidos</li>
                </ul>
              </div>

              <div className="regulamento-item">
                <h3 className="regulamento-item-title">9. Da Organização</h3>
                <ul className="regulamento-list">
                  <li>Fornecer a estrutura básica para exposição</li>
                  <li>Promover a divulgação do evento</li>
                  <li>Garantir a segurança durante o evento</li>
                  <li>Coordenar as atividades culturais</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seção de Disposições Finais */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Disposições Finais</h2>
            <div className="regulamento-items">
              <div className="regulamento-item">
                <h3 className="regulamento-item-title">10. Casos Omissos</h3>
                <p className="regulamento-text">
                  Os casos não previstos neste regulamento serão analisados e 
                  decididos pela comissão organizadora.
                </p>
              </div>

              <div className="regulamento-item">
                <h3 className="regulamento-item-title">11. Alterações</h3>
                <p className="regulamento-text">
                  Este regulamento poderá ser alterado a qualquer momento, 
                  sendo as mudanças comunicadas aos participantes com antecedência.
                </p>
              </div>
            </div>
          </section>

          {/* Informações de Contato */}
          <section className="regulamento-section">
            <h2 className="regulamento-section-title">Informações e Contato</h2>
            <div className="regulamento-contact">
              <p className="regulamento-text">
                <strong>Comissão Organizadora CEART 2025</strong><br/>
                Email: inscricoes@feiraceart.com.br<br/>
                Telefone: (11) 9999-9999<br/>
                Horário de atendimento: Segunda a Sexta, das 9h às 17h
              </p>
            </div>
          </section>

          {/* Botão de Download */}
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

        </div>
      </div>
    </div>
  );
};

export default Regulamento;
