export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

export interface Expositor {
  id: number;
  nome: string;
  descricao: string;
  especialidade: string;
  foto: string;
  cidade: string;
  estado: string;
  contato: {
    telefone?: string;
    email?: string;
    instagram?: string;
    whatsapp?: string;
  };
  produtos: string[];
  anosExperiencia: number;
  biografia: string;
  destaques: string[];
  galeria?: string[];
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Técnicas Ancestrais de Cerâmica Brasileira",
    excerpt: "Descubra como artesãos preservam tradições milenares na criação de peças únicas que contam a história do nosso país.",
    content: `
      <p>A cerâmica brasileira é uma expressão cultural rica e diversa que remonta a milhares de anos, com técnicas que foram transmitidas entre gerações e comunidades. As influências indígenas, africanas e europeias criaram um mosaico único de estilos e métodos que são preservados até hoje por artesãos dedicados em todo o país.</p>
      
      <h2>Origens Indígenas</h2>
      <p>As tribos indígenas brasileiras, particularmente os Marajoara e Tapajônica na Amazônia, desenvolveram técnicas sofisticadas de cerâmica muito antes da chegada dos europeus. Suas peças apresentavam padrões geométricos complexos e representações simbólicas da natureza e cosmologia.</p>
      
      <blockquote>
        "A argila nos conecta com a terra, com nossos ancestrais. Cada peça conta uma história que transcende gerações." - Maria do Barro, ceramista tradicional
      </blockquote>
      
      <h2>Técnicas Preservadas</h2>
      <p>Hoje, artesãos como Dona Maria do Carmo, mestre ceramista do Vale do Jequitinhonha em Minas Gerais, continuam utilizando métodos ancestrais: coleta manual da argila, preparo tradicional das peças sem uso de torno mecânico, e queima em fornos a lenha construídos na terra.</p>
      
      <p>O conhecimento é transmitido de forma oral e prática, com crianças aprendendo desde cedo ao observar os mais velhos da comunidade. Esse sistema de aprendizado garante a continuidade de técnicas que poderiam facilmente ser perdidas na era da produção em massa.</p>
      
      <h2>Desafios da Preservação</h2>
      <p>No entanto, estas tradições enfrentam desafios crescentes. A urbanização, o acesso limitado a matérias-primas tradicionais devido à degradação ambiental, e a concorrência com produtos industrializados de baixo custo têm pressionado os artesãos a abandonar suas práticas.</p>
      
      <h2>Valorização Cultural</h2>
      <p>Iniciativas como a Feira Cultural de Empreendedorismo e Artesanato são fundamentais para valorizar e preservar estas técnicas. Ao criar espaços onde artesãos podem mostrar seu trabalho, compartilhar conhecimento e comercializar seus produtos por um preço justo, estamos contribuindo para a sustentabilidade destas tradições.</p>
      
      <p>Visitar a feira não é apenas uma oportunidade de adquirir peças únicas, mas também de conectar-se com uma rica herança cultural que forma parte essencial da identidade brasileira.</p>
    `,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200",
    date: "2025-09-01",
    author: "Juliana Cerqueira",
    category: "Artesanato",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "O Futuro do Empreendedorismo Cultural no Brasil",
    excerpt: "Como jovens empreendedores estão revolucionando o mercado cultural brasileiro através da inovação e tradição.",
    content: `
      <p>O empreendedorismo cultural no Brasil está passando por uma transformação significativa, impulsionada por uma nova geração de jovens criativos que combinam tradição com inovação tecnológica. Esta mudança está redefinindo como a cultura brasileira é produzida, distribuída e consumida.</p>
      
      <h2>A Nova Geração de Empreendedores</h2>
      <p>Jovens empreendedores estão criando negócios que valorizam a cultura local enquanto aproveitam as oportunidades do mercado digital. Eles estão desenvolvendo plataformas online para artesãos, criando experiências culturais imersivas e estabelecendo novas formas de conectar criadores com consumidores.</p>
      
      <h2>Tecnologia a Serviço da Tradição</h2>
      <p>O uso de redes sociais, e-commerce e realidade aumentada está permitindo que artesãos tradicionais alcancem mercados globais. Aplicativos móveis conectam turistas com experiências culturais autênticas, enquanto plataformas de crowdfunding ajudam a financiar projetos culturais inovadores.</p>
      
      <blockquote>
        "A tecnologia não substitui a tradição, ela a amplifica. Podemos levar a cultura brasileira para o mundo inteiro sem perder sua essência." - Pedro Santos, fundador da startup CulturaTech
      </blockquote>
      
      <h2>Impacto Econômico</h2>
      <p>O setor cultural brasileiro movimenta bilhões de reais anualmente e emprega milhões de pessoas. Os novos empreendedores culturais estão criando modelos de negócio sustentáveis que beneficiam toda a cadeia produtiva, desde o artesão local até o consumidor final.</p>
      
      <h2>Desafios e Oportunidades</h2>
      <p>Apesar do potencial, existem desafios como acesso a financiamento, formação empresarial e infraestrutura digital. Iniciativas como a nossa feira buscam criar pontes entre empreendedores, investidores e consumidores, fomentando um ecossistema cultural próspero.</p>
    `,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
    date: "2025-09-05",
    author: "Ricardo Almeida",
    category: "Empreendedorismo",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Sustentabilidade e Arte: Um Novo Paradigma",
    excerpt: "Conheça artistas que transformam materiais reciclados em obras de arte, promovendo consciência ambiental.",
    content: `
      <p>A arte sustentável está ganhando força no Brasil como uma forma poderosa de conscientização ambiental e expressão criativa. Artistas de todo o país estão transformando resíduos em obras de arte, criando um movimento que combina estética com responsabilidade ecológica.</p>
      
      <h2>Arte com Propósito</h2>
      <p>Materiais como garrafas PET, tampinhas, papelão e tecidos descartados estão sendo transformados em esculturas, pinturas e instalações que desafiam nossa percepção sobre lixo e beleza. Estes artistas não apenas criam obras visualmente impactantes, mas também transmitem mensagens importantes sobre consumo consciente.</p>
      
      <h2>Técnicas Inovadoras</h2>
      <p>As técnicas variam desde a colagem com materiais recicláveis até a criação de tintas naturais a partir de plantas e minerais. Alguns artistas desenvolvem processos únicos, como a fusão de plásticos para criar novas texturas ou o uso de elementos orgânicos que se decompõem com o tempo.</p>
      
      <blockquote>
        "Cada obra é um manifesto. Quando transformo lixo em arte, estou mostrando que podemos repensar nossa relação com o planeta." - Marina Verde, artista sustentável
      </blockquote>
      
      <h2>Impacto Social</h2>
      <p>Além do aspecto ambiental, muitos projetos de arte sustentável envolvem comunidades em situação de vulnerabilidade, oferecendo renda através da coleta e transformação de materiais recicláveis. Cooperativas de catadores se tornaram parceiras essenciais neste movimento.</p>
      
      <h2>O Futuro da Arte Sustentável</h2>
      <p>Museus e galerias estão cada vez mais interessados em exposições temáticas sobre sustentabilidade. O mercado de arte também está reconhecendo o valor dessas obras, não apenas pelo aspecto estético, mas pelo impacto social e ambiental que representam.</p>
    `,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200",
    date: "2025-09-08",
    author: "Ana Beatriz Costa",
    category: "Sustentabilidade",
    readTime: "6 min"
  },
  {
    id: 4,
    title: "Tradições Têxteis do Interior Brasileiro",
    excerpt: "Explore as técnicas tradicionais de tecelagem que resistem ao tempo e mantêm viva a cultura popular.",
    content: `
      <p>As tradições têxteis do interior brasileiro representam uma das mais ricas manifestações da cultura popular do país. Em pequenas cidades e comunidades rurais, técnicas ancestrais de tecelagem, bordado e tingimento natural são preservadas por mestres artesãos que dedicam suas vidas a esta arte.</p>
      
      <h2>Técnicas Regionais</h2>
      <p>Cada região do Brasil desenvolveu suas próprias técnicas e padrões distintivos. No Nordeste, o bordado em ponto cruz e richelieu decoram roupas de cama e mesa. No Sul, a tecelagem em tear manual produz cobertores e tapetes com motivos geométricos. Na Amazônia, fibras naturais como buriti e tucumã são transformadas em cestas e redes.</p>
      
      <h2>Tingimento Natural</h2>
      <p>Uma das práticas mais fascinantes é o uso de plantas, frutas e minerais para criar corantes naturais. O urucum produz tons avermelhados, o índigo gera azuis profundos, e a casca de cebola resulta em amarelos dourados. Essas técnicas não apenas criam cores únicas, mas também são ambientalmente sustentáveis.</p>
      
      <blockquote>
        "Cada fio conta uma história. Quando tece, a mulher está tecendo também a memória de sua família e de sua comunidade." - Dona Antônia, mestra tecelã
      </blockquote>
      
      <h2>Transmissão do Conhecimento</h2>
      <p>O aprendizado das técnicas têxteis tradicionalmente ocorre no ambiente familiar, com mães ensinando filhas desde a infância. Roda de conversa durante o trabalho também são momentos importantes de transmissão de conhecimentos e fortalecimento dos laços comunitários.</p>
      
      <h2>Desafios Contemporâneos</h2>
      <p>A globalização e a industrialização têm ameaçado essas tradições. Jovens migram para centros urbanos em busca de oportunidades, e a concorrência com produtos industrializados torna difícil a sustentabilidade econômica do artesanato tradicional.</p>
      
      <h2>Valorização e Preservação</h2>
      <p>Iniciativas de valorização, como feiras culturais e projetos de mapeamento cultural, são essenciais para manter vivas essas tradições. O reconhecimento do valor cultural e econômico do artesanato têxtil tradicional pode garantir sua continuidade para futuras gerações.</p>
    `,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200",
    date: "2025-09-06",
    author: "Carlos Roberto Silva",
    category: "Cultura",
    readTime: "4 min"
  },
  {
    id: 5,
    title: "Inovação no Artesanato: Design Contemporâneo e Tradição",
    excerpt: "Descubra como designers contemporâneos estão reinterpretando técnicas artesanais tradicionais.",
    content: `
      <p>A união entre design contemporâneo e artesanato tradicional está criando uma nova linguagem estética no Brasil. Designers formados em renomadas escuelas estão colaborando com artesãos locais, resultando em produtos que honram a tradição enquanto atendem às demandas do mercado moderno.</p>
      
      <h2>Parcerias Criativas</h2>
      <p>Essas colaborações vão além da simples comercialização. Designers trazem conhecimento sobre tendências globais, ergonomia e funcionalidade, enquanto artesãos compartilham técnicas ancestrais e conhecimento sobre materiais locais. O resultado são produtos únicos que contam histórias autênticas.</p>
      
      <h2>Novos Materiais, Técnicas Antigas</h2>
      <p>Experimentos com materiais contemporâneos aplicados a técnicas tradicionais estão produzindo resultados surpreendentes. Fibras sintéticas são incorporadas à tecelagem manual, resinas modernas são combinadas com madeiras nativas, e tecnologias de corte a laser são aplicadas a padrões tradicionais.</p>
      
      <h2>Mercado Global</h2>
      <p>Produtos que combinam design contemporâneo com artesanato brasileiro estão ganhando reconhecimento internacional. Feiras de design em Milão, Nova York e Tóquio têm dedicado espaços especiais para mostrar essas criações híbridas que representam a identidade cultural brasileira.</p>
      
      <blockquote>
        "Não se trata de modernizar o artesanato, mas de encontrar a linguagem contemporânea que já existe dentro da tradição." - Laura Gonzalez, designer
      </blockquote>
      
      <h2>Sustentabilidade Econômica</h2>
      <p>Esta abordagem tem se mostrado economicamente viável tanto para designers quanto para artesãos. Os produtos comandam preços premium no mercado, permitindo que artesãos recebam remuneração justa pelo seu trabalho e que designers desenvolvam carreiras sustentáveis.</p>
    `,
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200",
    date: "2025-09-03",
    author: "Fernanda Ribeiro",
    category: "Design",
    readTime: "5 min"
  },
  {
    id: 6,
    title: "Gastronomia Artesanal: Sabores que Contam História",
    excerpt: "Explore como pequenos produtores mantêm vivas receitas tradicionais da culinária brasileira.",
    content: `
      <p>A gastronomia artesanal brasileira é um tesouro cultural que vai muito além do sabor. Pequenos produtores espalhados pelo país mantêm vivas receitas centenárias, utilizando técnicas tradicionais e ingredientes nativos para criar produtos únicos que contam a história de suas regiões.</p>
      
      <h2>Tradições Familiares</h2>
      <p>Muitas receitas são passadas de geração em geração, como segredos de família guardados a sete chaves. Doces de leite de cabra do sertão nordestino, queijos minas de montanha, cachaças artesanais e conservas de frutas nativas são alguns exemplos dessa riqueza gastronômica.</p>
      
      <h2>Ingredientes Nativos</h2>
      <p>O uso de ingredientes nativos é uma característica marcante da gastronomia artesanal brasileira. Frutas como caju, buriti, pequi e jabuticaba são transformadas em doces, licores e conservas. Especiarias nativas como a pimenta biquinho e o cumaru adicionam sabores únicos aos pratos.</p>
      
      <h2>Técnicas Ancestrais</h2>
      <p>Métodos de conservação e preparo desenvolvidos ao longo de séculos continuam sendo utilizados. A defumação natural, a cura em sal marinho, a fermentação controlada e o cozimento lento em panelas de barro são algumas das técnicas que conferem características especiais aos produtos.</p>
      
      <blockquote>
        "Cada receita é uma história, cada sabor é uma memória. Quando preparo meus doces, estou honrando minha bisavó e todas as mulheres que vieram antes de mim." - Dona Sebastiana, doceira tradicional
      </blockquote>
      
      <h2>Valorização do Terroir</h2>
      <p>Assim como o vinho, os produtos gastronômicos artesanais brasileiros estão sendo reconhecidos pelo seu terroir - a combinação única de solo, clima e tradições locais que conferem características especiais aos alimentos.</p>
      
      <h2>Mercado em Expansão</h2>
      <p>O interesse por produtos artesanais e orgânicos está crescendo, criando oportunidades para pequenos produtores. Feiras gastronômicas, mercados especializados e vendas online estão permitindo que esses produtores alcancem novos mercados sem perder suas características artesanais.</p>
    `,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
    date: "2025-09-02",
    author: "João Mendes",
    category: "Gastronomia",
    readTime: "6 min"
  }
];

export const getPostById = (id: number): BlogPost | undefined => {
  return mockBlogPosts.find(post => post.id === id);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.category === category);
};

export const getRelatedPosts = (postId: number, limit: number = 3): BlogPost[] => {
  const currentPost = getPostById(postId);
  if (!currentPost) return [];
  
  const relatedPosts = mockBlogPosts
    .filter(post => post.id !== postId && post.category === currentPost.category)
    .slice(0, limit);
  
  // Se não houver posts suficientes na mesma categoria, preencha com outros posts
  if (relatedPosts.length < limit) {
    const additionalPosts = mockBlogPosts
      .filter(post => post.id !== postId && !relatedPosts.includes(post))
      .slice(0, limit - relatedPosts.length);
    
    relatedPosts.push(...additionalPosts);
  }
  
  return relatedPosts;
};

export const getRecentPosts = (limit: number = 4): BlogPost[] => {
  return mockBlogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getAllPosts = (): BlogPost[] => {
  return mockBlogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockExpositores: Expositor[] = [
  {
    id: 1,
    nome: "Maria Silva",
    descricao: "Artesã especializada em cerâmica decorativa, criando peças únicas que combinam tradição e modernidade.",
    especialidade: "Cerâmica",
    foto: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
    cidade: "São Paulo",
    estado: "SP",
    contato: {
      telefone: "(11) 99999-1234",
      email: "maria.ceramica@email.com",
      instagram: "@maria_ceramica_arte",
      whatsapp: "11999991234"
    },
    produtos: ["Vasos decorativos", "Pratos artesanais", "Esculturas", "Objetos utilitários"],
    anosExperiencia: 15,
    biografia: "Maria Silva iniciou sua jornada na cerâmica ainda na adolescência, quando descobriu sua paixão pela argila nas aulas de artes do colégio. Inspirada pelas técnicas tradicionais que aprendeu com sua avó, uma ceramista autodidata do interior de São Paulo, Maria desenvolveu ao longo de 15 anos um estilo único que mescla a sabedoria ancestral com elementos contemporâneos. Suas peças são conhecidas não apenas pela beleza estética, mas também pela funcionalidade e durabilidade. Cada criação conta uma história, refletindo sua conexão profunda com a natureza e sua paixão por preservar tradições artesanais brasileiras. Maria já participou de mais de 50 exposições, teve suas obras adquiridas por colecionadores de arte popular e mantém um ateliê aberto ao público onde oferece workshops e cursos para iniciantes.",
    destaques: ["Prêmio Artesão do Ano 2023", "Exposição no Museu de Arte Popular", "Mais de 500 peças vendidas"],
    galeria: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      "https://images.unsplash.com/photo-1558618900-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1525974160448-038dacadcc71?w=800"
    ]
  },
  {
    id: 2,
    nome: "João Santos",
    descricao: "Marceneiro tradicional que preserva técnicas ancestrais, criando móveis e objetos únicos em madeira sustentável.",
    especialidade: "Marcenaria",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    cidade: "Ouro Preto",
    estado: "MG",
    contato: {
      telefone: "(31) 98888-5678",
      email: "joao.madeira@email.com",
      instagram: "@joao_marceneiro",
      whatsapp: "31988885678"
    },
    produtos: ["Móveis rústicos", "Objetos decorativos", "Brinquedos de madeira", "Instrumentos musicais"],
    anosExperiencia: 20,
    biografia: "João Santos representa a terceira geração de uma família de marceneiros em Ouro Preto. Começou a trabalhar com madeira aos 12 anos, ao lado de seu pai e avô, aprendendo não apenas as técnicas tradicionais, mas também o respeito pela matéria-prima e pela natureza. Especialista em madeiras de reflorestamento, João desenvolveu métodos únicos de tratamento e acabamento que realçam a beleza natural de cada tipo de madeira. Seu trabalho é reconhecido pela durabilidade excepcional e pelos detalhes artesanais que tornam cada peça única. Além de móveis funcionais, João cria esculturas e objetos decorativos que celebram a rica cultura mineira. Seus brinquedos de madeira são especialmente apreciados por famílias que valorizam produtos sustentáveis e educativos. João também se dedica a ensinar jovens da comunidade, perpetuando tradições que estão em risco de desaparecer.",
    destaques: ["Família de artesãos há 3 gerações", "Uso exclusivo de madeira sustentável", "Cliente fiel há mais de 10 anos"],
    galeria: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=800",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
    ]
  },
  {
    id: 3,
    nome: "Ana Costa",
    descricao: "Designer têxtil especializada em fibras naturais e tingimento artesanal, criando peças sustentáveis e exclusivas.",
    especialidade: "Têxtil",
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    cidade: "Salvador",
    estado: "BA",
    contato: {
      telefone: "(71) 97777-9012",
      email: "ana.textil@email.com",
      instagram: "@ana_fibras_naturais",
      whatsapp: "71977779012"
    },
    produtos: ["Tecidos artesanais", "Roupas exclusivas", "Bolsas", "Acessórios"],
    anosExperiencia: 12,
    biografia: "Ana Costa formou-se em Design de Moda pela UFBA, mas sua verdadeira paixão despertou quando descobriu as técnicas ancestrais de tingimento com plantas nativas da Bahia. Há 12 anos, ela dedica-se exclusivamente ao desenvolvimento de tecidos artesanais usando fibras naturais como algodão orgânico, linho e fibras de banana. Suas pesquisas sobre plantas tintórias levaram-na a redescobrir receitas quase perdidas, passadas de geração em geração por mestras tintoras do Recôncavo Baiano. Ana mantém uma horta de plantas tintórias em seu ateliê e trabalha em parceria com cooperativas locais de fibras naturais. Suas criações são 100% sustentáveis e biodegradáveis, representando uma alternativa consciente à moda industrial. Além de criar suas próprias coleções, Ana oferece consultoria para marcas que desejam incorporar práticas sustentáveis e ministra workshops sobre tingimento natural em universidades e institutos de design.",
    destaques: ["Técnicas de tingimento 100% naturais", "Parceria com cooperativas locais", "Produtos sustentáveis"],
    galeria: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
      "https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800"
    ]
  },
  {
    id: 4,
    nome: "Pedro Oliveira",
    descricao: "Ourives especializado em joias artesanais, trabalha com metais preciosos e pedras brasileiras criando peças exclusivas.",
    especialidade: "Ourivesaria",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    cidade: "Belo Horizonte",
    estado: "MG",
    contato: {
      telefone: "(31) 96666-3456",
      email: "pedro.joias@email.com",
      instagram: "@pedro_ourivesaria",
      whatsapp: "31966663456"
    },
    produtos: ["Anéis", "Colares", "Brincos", "Pulseiras", "Peças sob medida"],
    anosExperiencia: 18,
    biografia: "Pedro Oliveira é ourives há quase duas décadas, especializado em criar joias que destacam a beleza das pedras brasileiras. Cada peça é única e conta uma história através de seus detalhes artesanais.",
    destaques: ["Especialista em pedras brasileiras", "Peças exclusivas sob medida", "Reconhecido nacionalmente"],
    galeria: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800",
      "https://images.unsplash.com/photo-1584302179602-e4389ef8835b?w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
    ]
  },
  {
    id: 5,
    nome: "Carla Mendes",
    descricao: "Artesã especializada em trabalhos com fibra de banana e palha, criando cestas, bolsas e objetos decorativos sustentáveis.",
    especialidade: "Fibras Naturais",
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    cidade: "Petrolina",
    estado: "PE",
    contato: {
      telefone: "(87) 95555-7890",
      email: "carla.fibras@email.com",
      instagram: "@carla_fibras_naturais",
      whatsapp: "87955557890"
    },
    produtos: ["Cestas", "Bolsas", "Chapéus", "Objetos decorativos"],
    anosExperiencia: 10,
    biografia: "Carla Mendes trabalha com fibras naturais da região nordestina, especialmente fibra de banana e palha de carnaúba. Suas criações são 100% sustentáveis e ajudam a valorizar materiais locais.",
    destaques: ["100% sustentável", "Matéria-prima local", "Técnicas tradicionais nordestinas"],
    galeria: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800",
      "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=800"
    ]
  },
  {
    id: 6,
    nome: "Roberto Silva",
    descricao: "Artesão especializado em esculturas de pedra sabão, mantendo viva a tradição mineira desta arte ancestral.",
    especialidade: "Escultura em Pedra",
    foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    cidade: "Congonhas",
    estado: "MG",
    contato: {
      telefone: "(31) 94444-2468",
      email: "roberto.pedra@email.com",
      instagram: "@roberto_escultor",
      whatsapp: "31944442468"
    },
    produtos: ["Esculturas decorativas", "Objetos utilitários", "Arte sacra", "Miniaturas"],
    anosExperiencia: 25,
    biografia: "Roberto Silva é um mestre escultor em pedra sabão, arte tradicional de Minas Gerais. Com 25 anos de experiência, suas obras são reconhecidas pela delicadeza dos detalhes e pela preservação das técnicas ancestrais.",
    destaques: ["Mestre em pedra sabão", "25 anos de experiência", "Arte tradicional mineira"],
    galeria: [
      "https://images.unsplash.com/photo-1544967890-1ad5dbaac10d?w=800",
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800",
      "https://images.unsplash.com/photo-1578662015687-4a4bcd9d5b95?w=800",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"
    ]
  },
  {
    id: 7,
    nome: "Lúcia Ferreira",
    descricao: "Especialista em bordados à mão e patch aplique, cria peças únicas que misturam tradição e modernidade.",
    especialidade: "Bordado",
    foto: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
    cidade: "Fortaleza",
    estado: "CE",
    contato: {
      telefone: "(85) 93333-1357",
      email: "lucia.bordados@email.com",
      instagram: "@lucia_bordados_arte",
      whatsapp: "85933331357"
    },
    produtos: ["Roupas bordadas", "Toalhas de mesa", "Almofadas", "Quadros decorativos"],
    anosExperiencia: 14,
    biografia: "Lúcia Ferreira aprendeu a arte do bordado com sua mãe e desenvolveu técnicas próprias que combinam tradição nordestina com design contemporâneo. Suas peças são verdadeiras obras de arte têxtil.",
    destaques: ["Técnicas familiares", "Design contemporâneo", "Bordados exclusivos"],
    galeria: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
      "https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800"
    ]
  },
  {
    id: 8,
    nome: "Marcos Souza",
    descricao: "Artesão especializado em trabalhos com couro, cria bolsas, carteiras e acessórios com técnicas tradicionais do sertão.",
    especialidade: "Couro",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    cidade: "Campina Grande",
    estado: "PB",
    contato: {
      telefone: "(83) 92222-4680",
      email: "marcos.couro@email.com",
      instagram: "@marcos_couro_arte",
      whatsapp: "83922224680"
    },
    produtos: ["Bolsas", "Carteiras", "Cintos", "Acessórios", "Sandálias"],
    anosExperiencia: 16,
    biografia: "Marcos Souza trabalha com couro há 16 anos, utilizando técnicas tradicionais do sertão nordestino. Seus produtos são conhecidos pela durabilidade e pelo acabamento artesanal de alta qualidade.",
    destaques: ["Técnicas do sertão", "Alta durabilidade", "Acabamento artesanal"],
    galeria: [
      "https://images.unsplash.com/photo-1544966503-7e44e1e03652?w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800",
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800"
    ]
  }
];

export const getExpositores = (): Expositor[] => {
  return mockExpositores;
};

export const getExpositorById = (id: number): Expositor | undefined => {
  return mockExpositores.find(expositor => expositor.id === id);
};

export const getExpositoresByEspecialidade = (especialidade: string): Expositor[] => {
  return mockExpositores.filter(expositor => expositor.especialidade === especialidade);
};

export const getFeaturedExpositores = (limit: number = 3): Expositor[] => {
  return mockExpositores.slice(0, limit);
};
