// Dados de seed para popular o banco
module.exports = {
  expositores: [
    {
      nome: 'Artesanato Regional',
      categoria: 'Artesanato',
      descricao: 'Peças artesanais únicas da região, feitas com materiais naturais e técnicas tradicionais.',
      cidade: 'Florianópolis',
      estado: 'SC',
      telefone: '(48) 99999-1111',
      email: 'artesanato@example.com',
      instagram: '@artesanato_regional'
    },
    {
      nome: 'Doces da Vovó',
      categoria: 'Alimentação',
      descricao: 'Doces caseiros artesanais, receitas de família passadas por gerações.',
      cidade: 'São José',
      estado: 'SC',
      telefone: '(48) 99999-2222',
      email: 'doces@example.com',
      instagram: '@doces_da_vovo'
    },
    {
      nome: 'Arte em Madeira',
      categoria: 'Decoração',
      descricao: 'Móveis e objetos decorativos em madeira de demolição e madeiras nobres.',
      cidade: 'Biguaçu',
      estado: 'SC',
      telefone: '(48) 99999-3333',
      email: 'madeira@example.com',
      instagram: '@arte_madeira'
    },
    {
      nome: 'Cosméticos Naturais',
      categoria: 'Beleza',
      descricao: 'Produtos de beleza 100% naturais, sem testes em animais.',
      cidade: 'Palhoça',
      estado: 'SC',
      telefone: '(48) 99999-4444',
      email: 'cosmeticos@example.com',
      instagram: '@cosmeticos_naturais'
    },
    {
      nome: 'Roupas Sustentáveis',
      categoria: 'Vestuário',
      descricao: 'Roupas produzidas com tecidos sustentáveis e práticas de comércio justo.',
      cidade: 'Florianópolis',
      estado: 'SC',
      telefone: '(48) 99999-5555',
      email: 'roupas@example.com',
      instagram: '@roupas_sustentaveis'
    },
    {
      nome: 'Cerveja Artesanal',
      categoria: 'Bebidas',
      descricao: 'Cervejas artesanais produzidas localmente com ingredientes selecionados.',
      cidade: 'Santo Amaro da Imperatriz',
      estado: 'SC',
      telefone: '(48) 99999-6666',
      email: 'cerveja@example.com',
      instagram: '@cerveja_artesanal'
    }
  ],
  galerias: [
    {
      titulo: 'Feira CEART 2025',
      descricao: 'Fotos da edição 2025 da Feira CEART',
      data_evento: '2025-03-15',
      ativo: true,
      ordem: 1
    },
    {
      titulo: 'Feira CEART 2024',
      descricao: 'Fotos da edição 2024 da Feira CEART',
      data_evento: '2024-03-20',
      ativo: true,
      ordem: 2
    }
  ],
  galeriaItens: [
    // Itens da Feira 2025 (galeria_id: 1)
    {
      galeria_id: 1,
      titulo: 'Cerâmica Artesanal',
      descricao: 'Vasos decorativos únicos feitos à mão',
      imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      ordem: 1
    },
    {
      galeria_id: 1,
      titulo: 'Móveis Rústicos',
      descricao: 'Mobiliário artesanal em madeira sustentável',
      imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ordem: 2
    },
    {
      galeria_id: 1,
      titulo: 'Tecidos Naturais',
      descricao: 'Tecidos tingidos com plantas naturais',
      imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      ordem: 3
    },
    {
      galeria_id: 1,
      titulo: 'Joias Artesanais',
      descricao: 'Joias únicas com pedras brasileiras',
      imagem: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      ordem: 4
    },
    {
      galeria_id: 1,
      titulo: 'Arte em Couro',
      descricao: 'Bolsas e acessórios em couro legítimo',
      imagem: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
      ordem: 5
    },
    {
      galeria_id: 1,
      titulo: 'Pinturas em Tela',
      descricao: 'Obras de arte de artistas locais',
      imagem: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      ordem: 6
    },
    {
      galeria_id: 1,
      titulo: 'Bordados Tradicionais',
      descricao: 'Bordados à mão com técnicas ancestrais',
      imagem: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=800',
      ordem: 7
    },
    {
      galeria_id: 1,
      titulo: 'Macramê Contemporâneo',
      descricao: 'Peças decorativas em macramê moderno',
      imagem: 'https://images.unsplash.com/photo-1551058622-6954cb50b144?w=800',
      ordem: 8
    },
    // Itens da Feira 2024 (galeria_id: 2)
    {
      galeria_id: 2,
      titulo: 'Cestas de Fibra',
      descricao: 'Cestas sustentáveis de fibras naturais',
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      ordem: 1
    },
    {
      galeria_id: 2,
      titulo: 'Esculturas em Pedra',
      descricao: 'Arte em pedra sabão mineira',
      imagem: 'https://images.unsplash.com/photo-1544967890-1ad5dbaac10d?w=800',
      ordem: 2
    },
    {
      galeria_id: 2,
      titulo: 'Tapetes Artesanais',
      descricao: 'Tapetes feitos à mão com lã natural',
      imagem: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
      ordem: 3
    },
    {
      galeria_id: 2,
      titulo: 'Velas Aromáticas',
      descricao: 'Velas artesanais com essências naturais',
      imagem: 'https://images.unsplash.com/photo-1602874801006-96e1526dffac?w=800',
      ordem: 4
    },
    {
      galeria_id: 2,
      titulo: 'Sabonetes Naturais',
      descricao: 'Sabonetes artesanais com ingredientes orgânicos',
      imagem: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800',
      ordem: 5
    },
    {
      galeria_id: 2,
      titulo: 'Instrumentos Musicais',
      descricao: 'Instrumentos artesanais feitos à mão',
      imagem: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      ordem: 6
    }
  ],
  posts: [
    {
      titulo: 'A Arte do Artesanato Regional',
      resumo: 'Descubra as técnicas tradicionais que tornam o artesanato regional único e especial.',
      conteudo: '<p>O artesanato regional representa a identidade cultural de uma comunidade. Cada peça carrega consigo histórias, tradições e técnicas passadas de geração em geração.</p><p>Os artesãos utilizam materiais locais e técnicas ancestrais para criar obras únicas que refletem a alma da região.</p>',
      imagem_destaque: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      categoria: 'Artesanato',
      autor: 'Maria Silva',
      publicado: true
    },
    {
      titulo: 'Sustentabilidade na Feira',
      resumo: 'Como a feira promove práticas sustentáveis e o comércio justo.',
      conteudo: '<p>A sustentabilidade é um dos pilares da nossa feira. Todos os expositores são selecionados considerando suas práticas ambientais e sociais.</p><p>Priorizamos produtos feitos com materiais naturais, reciclados ou de fontes renováveis, além de valorizar o comércio justo.</p>',
      imagem_destaque: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      categoria: 'Sustentabilidade',
      autor: 'João Santos',
      publicado: true
    },
    {
      titulo: 'Conheça os Artesãos Locais',
      resumo: 'Histórias inspiradoras dos talentosos artesãos da nossa região.',
      conteudo: '<p>Cada artesão tem uma história única para contar. Muitos aprenderam o ofício com seus pais e avós, mantendo vivas as tradições familiares.</p><p>Conheça as pessoas por trás das obras e entenda o amor e dedicação presentes em cada criação.</p>',
      imagem_destaque: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      categoria: 'Histórias',
      autor: 'Ana Costa',
      publicado: true
    },
    {
      titulo: 'Tendências do Artesanato em 2025',
      resumo: 'As principais tendências que estão moldando o artesanato contemporâneo.',
      conteudo: '<p>O artesanato moderno une tradição e inovação. Vemos cada vez mais artesãos incorporando design contemporâneo às técnicas ancestrais.</p><p>Materiais sustentáveis, minimalismo e funcionalidade são as principais tendências deste ano.</p>',
      imagem_destaque: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      categoria: 'Tendências',
      autor: 'Pedro Oliveira',
      publicado: true
    }
  ],
  carrossel: [
    {
      titulo: 'Feira CEART 2025',
      imagem: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      ordem: 1,
      ativo: true
    },
    {
      titulo: 'Artesanato Regional',
      imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200',
      ordem: 2,
      ativo: true
    },
    {
      titulo: 'Sustentabilidade e Arte',
      imagem: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
      ordem: 3,
      ativo: true
    },
    {
      titulo: 'Cultura e Tradição',
      imagem: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
      ordem: 4,
      ativo: true
    }
  ],
  regulamento: {
    titulo: 'Regulamento da Feira CEART 2025',
    subtitulo: 'Feira Cultural de Arte e Artesanato',
    conteudo: `
      <h2>Disposições Gerais</h2>
      <p>A Feira Cultural de Arte e Artesanato - CEART 2025 tem como objetivo promover, valorizar e divulgar o trabalho de artesãos e artistas locais, proporcionando um espaço de comercialização, intercâmbio cultural e preservação das tradições artesanais da nossa região.</p>
      
      <h2>Da Participação</h2>
      <h3>1. Inscrições</h3>
      <p>Podem participar artesãos e artistas maiores de 18 anos, devidamente inscritos até a data limite estabelecida no cronograma oficial.</p>
      
      <h3>2. Categorias</h3>
      <ul>
        <li>Artesanato em geral</li>
        <li>Alimentação artesanal</li>
        <li>Decoração</li>
        <li>Vestuário e acessórios</li>
        <li>Beleza e cosméticos naturais</li>
        <li>Arte e cultura</li>
      </ul>
      
      <h2>Dos Estandes</h2>
      <h3>3. Montagem e Desmontagem</h3>
      <p>Os expositores devem montar seus estandes no dia anterior ao evento, no horário estabelecido pela organização. A desmontagem deve ocorrer após o encerramento, respeitando o horário informado.</p>
      
      <h3>4. Estrutura</h3>
      <p>A organização fornecerá estrutura básica (mesa e cadeira). Decoração adicional e material de exposição são de responsabilidade do expositor.</p>
      
      <h2>Das Normas de Conduta</h2>
      <h3>5. Horário de Funcionamento</h3>
      <p>Os expositores devem estar presentes durante todo o período de funcionamento da feira.</p>
      
      <h3>6. Comercialização</h3>
      <p>Só é permitida a venda de produtos artesanais de produção própria do expositor.</p>
      
      <h3>7. Limpeza e Organização</h3>
      <p>Cada expositor é responsável pela limpeza e organização de seu espaço.</p>
      
      <h2>Disposições Finais</h2>
      <p>Os casos omissos neste regulamento serão resolvidos pela comissão organizadora. A participação na feira implica na aceitação integral deste regulamento.</p>
      
      <p><strong>Data do evento:</strong> 10 a 12 de maio de 2025</p>
      <p><strong>Local:</strong> Centro de Eventos CEART</p>
      <p><strong>Horário:</strong> 9h às 18h</p>
    `,
    ano: 2025,
    ativo: true
  }
};
