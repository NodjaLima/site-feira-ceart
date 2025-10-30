import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, BlogPost } from '../services/apiService';
import '../styles/Blog.css';

const Blog = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const postsPerPage = 6;

  // Carregar dados iniciais
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await apiService.getPostsPublicados();
        setAllPosts(postsData);
        
        // Extrair categorias únicas
        const categoriasUnicas = ['Todos', ...new Set(postsData.map(post => post.categoria))];
        setCategories(categoriasUnicas);
        
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrar posts
  useEffect(() => {
    let filteredPosts = allPosts;

    // Filtrar por categoria
    if (selectedCategory !== 'Todos') {
      filteredPosts = allPosts.filter(post => post.categoria === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post =>
        post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setPosts(filteredPosts);
    setCurrentPage(1);
  }, [allPosts, selectedCategory, searchTerm]);

  // Paginação
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-page-container">
          <p>Carregando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Header da página */}
      <div className="blog-page-header">
        <div className="blog-page-header-content">
          <h1 className="blog-page-title">BLOG CEART</h1>
          <p className="blog-page-subtitle">
            Descubra histórias inspiradoras, técnicas tradicionais e inovações no mundo do artesanato e empreendedorismo cultural
          </p>
        </div>
      </div>

      <div className="blog-page-container">
        {/* Filtros e busca */}
        <div className="blog-filters">
          <div className="blog-search">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="blog-search-input"
            />
          </div>
          
          <div className="blog-categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`blog-category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="blog-results">
          <p className="blog-results-count">
            {posts.length} {posts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </p>
        </div>

        {/* Grid de posts */}
        <div className="blog-posts-grid">
          {currentPosts.map((post) => (
            <div key={post.id} className="blog-post-card">
              <div className="blog-post-image">
                {post.imagem_destaque && (
                  <img src={post.imagem_destaque} alt={post.titulo} />
                )}
                <div className="blog-post-category">{post.categoria}</div>
              </div>
              <div className="blog-post-content">
                <div className="blog-post-meta">
                  <span className="blog-post-date">
                    {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="blog-post-author">Por {post.autor}</span>
                </div>
                <h3 className="blog-post-title">{post.titulo}</h3>
                <p className="blog-post-excerpt">{post.resumo}</p>
                <div className="blog-post-footer">
                  <Link to={`/blog/post/${post.id}`} className="blog-post-btn">
                    Leia Mais
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {posts.length === 0 && (
          <div className="blog-no-results">
            <h3>Nenhum artigo encontrado</h3>
            <p>Tente ajustar os filtros ou termos de busca.</p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="blog-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="blog-pagination-btn"
            >
              ← Anterior
            </button>
            
            <div className="blog-pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={pageNumber === currentPage ? 'active' : ''}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="blog-pagination-btn"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
