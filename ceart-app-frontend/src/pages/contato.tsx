import ContatoSection from "../components/contato-section/ContatoSection";
import "./Contato.css";

const Contato = () => {
  return (
    <div className="contato-page">
      {/* Hero Section */}
      <section className="contato-hero">
        <div className="contato-hero-content">
          <h1>Fale Conosco</h1>
          <p>Estamos aqui para ajudar e esclarecer suas dúvidas sobre a Feira CEART</p>
        </div>
      </section>

      {/* Informações Gerais */}
      <section className="contato-info-section">
        <div className="container">
          <div className="contato-info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Localização</h3>
              <p>Centro de Eventos CEART<br />
                 Rua das Artes, 123<br />
                 São Paulo - SP, 01234-567</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Telefone</h3>
              <p>(11) 3456-7890<br />
                 (11) 99999-9999<br />
                 Segunda à Sexta: 9h às 18h</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>E-mail</h3>
              <p>contato@feiraceart.com.br<br />
                 expositores@feiraceart.com.br<br />
                 Resposta em até 24h</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🌐</div>
              <h3>Redes Sociais</h3>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Contato Principal */}
      <ContatoSection />

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Perguntas Frequentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Como posso me inscrever como expositor?</h4>
              <p>Preencha o formulário de contato acima informando seu interesse em participar como expositor. Nossa equipe entrará em contato com todas as informações necessárias.</p>
            </div>
            
            <div className="faq-item">
              <h4>Qual é o valor da participação?</h4>
              <p>Os valores variam conforme o tipo de estande e localização. Entre em contato conosco para receber uma tabela completa de preços e condições especiais.</p>
            </div>
            
            <div className="faq-item">
              <h4>Quando acontece a próxima feira?</h4>
              <p>A Feira CEART acontece trimestralmente. Consulte nosso calendário de eventos ou entre em contato para saber as próximas datas.</p>
            </div>
            
            <div className="faq-item">
              <h4>Que tipo de artesanato pode participar?</h4>
              <p>Aceitamos todos os tipos de artesanato tradicional: cerâmica, marcenaria, têxtil, ourivesaria, bordados, esculturas e muito mais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa Section */}
      <section className="mapa-section">
        <div className="container">
          <h2>Como Chegar</h2>
          <div className="mapa-content">
            <div className="mapa-info">
              <h3>Localização da Feira</h3>
              <p>O Centro de Eventos CEART está localizado em uma região de fácil acesso, com amplo estacionamento e próximo ao transporte público.</p>
              
              <div className="transporte-info">
                <h4>Transporte Público:</h4>
                <ul>
                  <li>🚇 Estação Metro São Paulo - Linha Verde (500m)</li>
                  <li>🚌 Linhas de ônibus: 123, 456, 789</li>
                  <li>🚕 Pontos de táxi e Uber na porta do evento</li>
                </ul>
                
                <h4>Estacionamento:</h4>
                <ul>
                  <li>🅿️ 200 vagas gratuitas para visitantes</li>
                  <li>🅿️ Estacionamento coberto disponível</li>
                  <li>♿ Vagas preferenciais para PCD</li>
                </ul>
              </div>
            </div>
            
            <div className="mapa-placeholder">
              <div className="mapa-frame">
                <p>🗺️ Mapa Interativo</p>
                <p>Centro de Eventos CEART<br />
                   Rua das Artes, 123<br />
                   São Paulo - SP</p>
                <button className="mapa-btn">Ver no Google Maps</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contato;
