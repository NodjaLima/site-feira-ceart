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
  galeria: [
    {
      titulo: 'Cerâmica Artesanal',
      descricao: 'Vasos decorativos únicos feitos à mão',
      categoria: 'Cerâmica',
      imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    },
    {
      titulo: 'Móveis Rústicos',
      descricao: 'Móveis artesanais em madeira sustentável',
      categoria: 'Marcenaria',
      imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    },
    {
      titulo: 'Tecidos Naturais',
      descricao: 'Tecidos tingidos com plantas naturais',
      categoria: 'Têxtil',
      imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'
    },
    {
      titulo: 'Joias Artesanais',
      descricao: 'Joias únicas com pedras brasileiras',
      categoria: 'Ourivesaria',
      imagem: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
    },
    {
      titulo: 'Cestas de Fibra',
      descricao: 'Cestas sustentáveis de fibras naturais',
      categoria: 'Fibras',
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'
    },
    {
      titulo: 'Esculturas em Pedra',
      descricao: 'Arte em pedra sabão mineira',
      categoria: 'Escultura',
      imagem: 'https://images.unsplash.com/photo-1544967890-1ad5dbaac10d?w=800'
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
  ]
};
