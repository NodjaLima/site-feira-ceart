const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar ao banco
const dbPath = path.join(__dirname, '..', 'ceart_cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Iniciando seed do banco de dados CEART CMS...');

// Dados de exemplo para expositores
const expositoresSeed = [
  {
    nome: 'Maria Silva Santos',
    categoria: 'Cerâmica',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '(11) 98765-4321',
    email: 'maria.ceramica@email.com',
    instagram: '@maria_ceramica_sp',
    descricao: 'Artesã especializada em cerâmica decorativa com mais de 15 anos de experiência. Trabalha com técnicas tradicionais e contemporâneas, criando peças únicas que unem funcionalidade e beleza. Suas obras incluem vasos, pratos, esculturas e objetos de decoração.',
  },
  {
    nome: 'João Santos Oliveira',
    categoria: 'Marcenaria',
    cidade: 'Ouro Preto',
    estado: 'MG',
    telefone: '(31) 99887-6654',
    email: 'joao.marceneiro@email.com',
    instagram: '@joao_marcenaria_mg',
    descricao: 'Marceneiro artesanal que preserva técnicas tradicionais mineiras. Especialista em móveis rústicos e decoração em madeira de demolição. Cada peça conta uma história e carrega a essência da tradição familiar passada de geração em geração.',
  },
  {
    nome: 'Ana Costa Ferreira',
    categoria: 'Têxtil',
    cidade: 'Salvador',
    estado: 'BA',
    telefone: '(71) 97654-3210',
    email: 'ana.textil@email.com',
    instagram: '@ana_textil_ba',
    descricao: 'Designer têxtil especializada em fibras naturais e tingimento natural. Cria peças sustentáveis usando algodão orgânico, linho e corantes extraídos de plantas. Suas criações incluem roupas, acessórios e decoração para casa.',
  },
  {
    nome: 'Pedro Lima Costa',
    categoria: 'Ourivesaria',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    telefone: '(31) 98765-1234',
    email: 'pedro.ourives@email.com',
    instagram: '@pedro_ourives_bh',
    descricao: 'Ourives e joalheiro com técnicas refinadas em metais preciosos. Cria joias autorais inspiradas na natureza e na cultura brasileira. Especialista em alianças personalizadas, anéis únicos e peças comemorativas.',
  },
  {
    nome: 'Carla Mendes Ribeiro',
    categoria: 'Fibras',
    cidade: 'Petrolina',
    estado: 'PE',
    telefone: '(87) 96543-2109',
    email: 'carla.fibras@email.com',
    instagram: '@carla_fibras_pe',
    descricao: 'Artesã especializada em trabalhos com fibras do sertão. Utiliza materiais como palha de carnaúba, sisal e outros recursos naturais da região. Produz cestas, bolsas, chapéus e objetos decorativos que refletem a cultura nordestina.',
  },
  {
    nome: 'Roberto Silva Medeiros',
    categoria: 'Escultura',
    cidade: 'Congonhas',
    estado: 'MG',
    telefone: '(31) 95432-1098',
    email: 'roberto.escultor@email.com',
    instagram: '@roberto_esculturas',
    descricao: 'Escultor em pedra-sabão seguindo a tradição de Aleijadinho. Cria esculturas religiosas e contemporâneas, sempre respeitando as características únicas da pedra mineira. Suas obras adornam jardins, igrejas e espaços públicos.',
  }
];

// Dados de exemplo para posts do blog
const postsSeed = [
  {
    titulo: 'A Arte da Cerâmica: Tradição que Atravessa Gerações',
    excerpt: 'Descubra como artesãos preservam técnicas milenares da cerâmica brasileira, mesclando tradições indígenas, africanas e europeias em peças únicas.',
    conteudo: `<p>A cerâmica é uma das artes mais antigas da humanidade, e no Brasil, essa tradição ganhou características únicas que misturam técnicas indígenas, africanas e europeias.</p>

<p>Na nossa feira, você encontrará artesãos que preservam essa rica herança cultural, criando peças que vão desde utilitários domésticos até verdadeiras obras de arte.</p>

<h2>O Processo Artesanal</h2>
<p>O processo de criação de uma peça cerâmica envolve várias etapas: preparação do barro, modelagem, secagem, primeira queima, esmaltação e segunda queima. Cada etapa requer conhecimento técnico e sensibilidade artística.</p>

<blockquote>
"Cada peça de cerâmica carrega a alma do artesão e a história de gerações que passaram esse conhecimento adiante." - Maria Silva Santos, ceramista
</blockquote>

<p>Nossos ceramistas trabalham com diferentes tipos de argila, desde a tradicional terracotta até argilas especiais que permitem efeitos únicos de cor e textura. Venha conhecer essas técnicas milenares que continuam vivas nas mãos hábeis dos nossos artesãos.</p>`,
    categoria: 'Artesanato',
    autor: 'Equipe CEART',
    readTime: '4 min'
  },
  {
    titulo: 'Sustentabilidade no Artesanato: O Futuro é Consciente',
    excerpt: 'Como artesãos estão liderando a transformação sustentável, utilizando materiais reciclados e técnicas ecológicas na criação de peças únicas.',
    conteudo: `<p>O movimento de sustentabilidade chegou ao artesanato e trouxe uma nova consciência sobre materiais, processos e impacto ambiental.</p>

<p>Nossos artesãos estão na vanguarda dessa transformação, utilizando materiais reciclados, tingimentos naturais e técnicas que respeitam o meio ambiente.</p>

<h2>Práticas Sustentáveis</h2>
<p>Exemplos práticos incluem:</p>
<ul>
<li>Uso de madeira de demolição na marcenaria</li>
<li>Tingimentos com cascas de cebola, urucum e outros corantes naturais</li>
<li>Aproveitamento de fibras descartadas pela agricultura</li>
<li>Criação de peças a partir de materiais recicláveis</li>
</ul>

<p>Essa abordagem não apenas preserva o meio ambiente, mas também cria peças com histórias únicas e significado especial. Cada objeto carrega consigo a consciência de um futuro mais sustentável.</p>

<blockquote>
"Transformar o que seria descarte em arte é nossa forma de cuidar do planeta enquanto criamos beleza." - Ana Costa Ferreira, designer têxtil
</blockquote>

<p>Venha descobrir como o artesanato pode ser uma forma de consumo consciente e apoio à economia local.</p>`,
    categoria: 'Sustentabilidade',
    autor: 'Marina Costa',
    readTime: '6 min'
  },
  {
    titulo: 'Empreendedorismo Cultural: Como Transformar Arte em Negócio',
    excerpt: 'Aprenda as estratégias essenciais para transformar seu talento artístico em um negócio próspero e sustentável no mercado atual.',
    conteudo: `<p>Ser um artesão empreendedor vai muito além de criar belas peças. É necessário desenvolver habilidades de gestão, marketing e relacionamento com o cliente.</p>

<p>Nossa feira oferece não apenas um espaço de venda, mas também uma oportunidade de networking e aprendizado entre artesãos experientes e iniciantes.</p>

<h2>Dicas Essenciais para Artesãos Empreendedores</h2>

<p><strong>1. Precificação Justa:</strong> Calcule corretamente custos de material, tempo e margem de lucro</p>
<p><strong>2. Identidade Visual:</strong> Desenvolva uma marca própria que reflita seu trabalho</p>
<p><strong>3. Redes Sociais:</strong> Use plataformas digitais para mostrar seu processo criativo</p>
<p><strong>4. Qualidade Constante:</strong> Mantenha padrões altos em todas as peças</p>
<p><strong>5. Relacionamento:</strong> Construa conexões genuínas com seus clientes</p>

<blockquote>
"O sucesso no artesanato vem da combinação perfeita entre paixão criativa e visão empresarial. É preciso amar o que se faz e saber vendê-lo." - João Santos Oliveira, marceneiro
</blockquote>

<p>O artesanato brasileiro tem um potencial enorme no mercado nacional e internacional. Com as ferramentas certas e muito dedicação, é possível transformar uma paixão pela arte em um negócio próspero e sustentável.</p>`,
    categoria: 'Empreendedorismo',
    autor: 'Carlos Andrade',
    readTime: '7 min'
  },
  {
    titulo: 'Preservando Tradições: A Importância Cultural do Artesanato',
    excerpt: 'Entenda como o artesanato brasileiro preserva nossa herança cultural e por que é fundamental apoiar essas tradições ancestrais.',
    conteudo: `<p>O artesanato é muito mais que produtos para venda - é um patrimônio cultural que conta a história de um povo, preserva conhecimentos ancestrais e mantém vivas as tradições.</p>

<p>Cada região do Brasil possui técnicas e estilos únicos que foram desenvolvidos ao longo de séculos, influenciados pela geografia local, materiais disponíveis e herança cultural de diferentes povos.</p>

<h2>Diversidade Regional</h2>
<p>Em nossa feira, você encontrará representantes de diversas tradições:</p>

<p><strong>Região Nordeste:</strong> Cerâmica do Alto do Moura, rendas de bilro, trabalhos em couro</p>
<p><strong>Região Sudeste:</strong> Cerâmica de Cunha, artesanato em pedra-sabão de MG</p>
<p><strong>Região Sul:</strong> Trabalhos em madeira, artesanato alemão e italiano</p>
<p><strong>Região Norte:</strong> Cerâmica marajoara, trabalhos com fibras amazônicas</p>
<p><strong>Centro-Oeste:</strong> Artesanato pantaneiro, trabalhos com materiais do cerrado</p>

<blockquote>
"Preservar nossa cultura através do artesanato é manter viva a alma do nosso povo. Cada técnica perdida é uma parte da nossa história que se vai para sempre." - Pedro Lima Costa, ourives
</blockquote>

<p>Ao comprar uma peça artesanal, você não está apenas adquirindo um objeto, mas contribuindo para a preservação de uma tradição cultural e apoiando famílias que dedicam suas vidas a manter essas técnicas vivas.</p>

<p>Venha conhecer essas histórias e fazer parte dessa rede de preservação cultural.</p>`,
    categoria: 'Cultura',
    autor: 'Equipe CEART',
    readTime: '5 min'
  }
];

// Dados de configurações
const configuracoesSeed = [
  { chave: 'site_name', valor: 'Feira CEART 2025', descricao: 'Nome do site' },
  { chave: 'site_email', valor: 'contato@feiraceart.com.br', descricao: 'Email principal' },
  { chave: 'site_phone', valor: '(11) 9999-9999', descricao: 'Telefone de contato' },
  { chave: 'site_address', valor: 'Centro Cultural CEART - São Paulo, SP', descricao: 'Endereço da feira' },
  { chave: 'feira_data_inicio', valor: '2025-11-15', descricao: 'Data de início da feira' },
  { chave: 'feira_data_fim', valor: '2025-11-17', descricao: 'Data de fim da feira' },
  { chave: 'site_whatsapp', valor: '(11) 99999-9999', descricao: 'WhatsApp oficial' },
  { chave: 'site_instagram', valor: '@feiraceart', descricao: 'Instagram oficial' },
  { chave: 'site_slogan', valor: 'Feira Cultural de Arte e Artesanato', descricao: 'Slogan do site' }
];

// Dados da galeria
const galeriaSeed = [
  {
    titulo: 'Vaso de Cerâmica Decorativo',
    descricao: 'Peça única em cerâmica com técnica de esmalte cristalino, criada pela artesã Maria Silva.',
    imagem: '/uploads/galeria-ceramica-1.jpg',
    categoria: 'ceramica',
    ordem: 1
  },
  {
    titulo: 'Móvel Rústico em Madeira de Demolição',
    descricao: 'Mesa de centro confeccionada com madeira de demolição, preservando a história e sustentabilidade.',
    imagem: '/uploads/galeria-madeira-1.jpg',
    categoria: 'madeira',
    ordem: 2
  },
  {
    titulo: 'Tecido Artesanal com Tingimento Natural',
    descricao: 'Tecido em algodão orgânico tingido com urucum e outras plantas da região nordestina.',
    imagem: '/uploads/galeria-textil-1.jpg',
    categoria: 'textil',
    ordem: 3
  }
];

// Dados do carrossel
const carrosselSeed = [
  {
    titulo: 'Feira CEART 2025',
    imagem: '/uploads/carrossel-feira-principal.jpg',
    ordem: 1
  },
  {
    titulo: 'Arte que Transforma Vidas',
    imagem: '/uploads/carrossel-artesaos.jpg',
    ordem: 2
  },
  {
    titulo: 'Tradições Brasileiras',
    imagem: '/uploads/carrossel-tradicoes.jpg',
    ordem: 3
  }
];

// Dados de arquivos
const arquivosSeed = [
  {
    nome: 'Regulamento Feira CEART 2025',
    descricao: 'Documento oficial com todas as regras e procedimentos para participação na feira.',
    arquivo: '/uploads/regulamento-ceart-2025.pdf',
    tipo: '.pdf',
    tamanho: 524288, // 512KB
    categoria: 'regulamento'
  },
  {
    nome: 'Formulário de Inscrição de Expositores',
    descricao: 'Formulário para inscrição de novos artesãos interessados em participar da feira.',
    arquivo: '/uploads/formulario-inscricao.pdf',
    tipo: '.pdf',
    tamanho: 256000, // 250KB
    categoria: 'formularios'
  }
];

// Função para inserir dados
function insertData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Limpar tabelas existentes
      db.run('DELETE FROM expositores');
      db.run('DELETE FROM posts');
      db.run('DELETE FROM configuracoes');
      db.run('DELETE FROM galeria');
      db.run('DELETE FROM carrossel');
      db.run('DELETE FROM arquivos');
      
      console.log('🗑️  Tabelas limpas');
      
      // Inserir expositores
      const expositorStmt = db.prepare(`
        INSERT INTO expositores (nome, categoria, descricao, contato, telefone, email, site)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      expositoresSeed.forEach(exp => {
        const contato = `${exp.cidade} - ${exp.estado}`;
        expositorStmt.run(exp.nome, exp.categoria, exp.descricao, contato, 
                          exp.telefone, exp.email, exp.instagram);
      });
      expositorStmt.finalize();
      
      console.log(`✅ ${expositoresSeed.length} expositores inseridos`);
      
      // Inserir posts
      const postStmt = db.prepare(`
        INSERT INTO posts (titulo, excerpt, conteudo, categoria, autor, readTime)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      postsSeed.forEach(post => {
        postStmt.run(post.titulo, post.excerpt, post.conteudo, post.categoria, post.autor, post.readTime);
      });
      postStmt.finalize();
      
      console.log(`✅ ${postsSeed.length} posts inseridos`);
      
      // Inserir configurações
      const configStmt = db.prepare(`
        INSERT INTO configuracoes (chave, valor, descricao)
        VALUES (?, ?, ?)
      `);
      
      configuracoesSeed.forEach(config => {
        configStmt.run(config.chave, config.valor, config.descricao);
      });
      configStmt.finalize();
      
      console.log(`✅ ${configuracoesSeed.length} configurações inseridas`);
      
      // Inserir galeria
      const galeriaStmt = db.prepare(`
        INSERT INTO galeria (titulo, descricao, imagem, categoria, ordem)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      galeriaSeed.forEach(item => {
        galeriaStmt.run(item.titulo, item.descricao, item.imagem, item.categoria, item.ordem);
      });
      galeriaStmt.finalize();
      
      console.log(`✅ ${galeriaSeed.length} itens da galeria inseridos`);
      
      // Inserir carrossel
      const carrosselStmt = db.prepare(`
        INSERT INTO carrossel (titulo, subtitulo, imagem, link_texto, link_url, ordem)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      carrosselSeed.forEach(slide => {
        carrosselStmt.run(slide.titulo, slide.subtitulo, slide.imagem, slide.link_texto, slide.link_url, slide.ordem);
      });
      carrosselStmt.finalize();
      
      console.log(`✅ ${carrosselSeed.length} slides do carrossel inseridos`);
      
      // Inserir arquivos
      const arquivosStmt = db.prepare(`
        INSERT INTO arquivos (nome, descricao, arquivo, tipo, tamanho, categoria)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      arquivosSeed.forEach(arquivo => {
        arquivosStmt.run(arquivo.nome, arquivo.descricao, arquivo.arquivo, arquivo.tipo, arquivo.tamanho, arquivo.categoria);
      });
      arquivosStmt.finalize();
      
      console.log(`✅ ${arquivosSeed.length} arquivos inseridos`);
      
      resolve();
    });
  });
}

// Executar seed
insertData()
  .then(() => {
    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📊 Dados inseridos:');
    console.log(`   - ${expositoresSeed.length} expositores`);
    console.log(`   - ${postsSeed.length} posts do blog`);
    console.log(`   - ${galeriaSeed.length} imagens da galeria`);
    console.log(`   - ${carrosselSeed.length} slides do carrossel`);
    console.log(`   - ${arquivosSeed.length} arquivos/documentos`);
    console.log(`   - ${configuracoesSeed.length} configurações`);
    console.log('');
    console.log('🚀 Inicie o servidor com: npm start');
    console.log('🔗 Acesse: http://localhost:3001/admin');
    
    db.close();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erro durante o seed:', error);
    db.close();
    process.exit(1);
  });