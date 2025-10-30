import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, BlogPost } from "../../services/apiService";
import "./BlogSection.css";

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await apiService.getPostsPublicados();
        // Pega apenas os 4 primeiros para exibir na home
        setPosts(postsData.slice(0, 4));
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="blog-section">
        <div className="blog-container">
          <p>Carregando posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <h2 className="blog-title">NOTÍCIAS & ARTIGOS</h2>
          <p className="blog-subtitle">Fique por dentro das últimas novidades do mundo do artesanato e empreendedorismo cultural</p>
        </div>
        
        <div className="blog-posts">
          {posts.map((post) => (
            <div key={post.id} className="blog-card">
              <div className="blog-card-image">
                {post.imagem_destaque && (
                  <img src={post.imagem_destaque} alt={post.titulo} />
                )}
                <div className="blog-card-category">{post.categoria}</div>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-date">{new Date(post.data_publicacao).toLocaleDateString('pt-BR')}</span>
                  <span className="blog-card-author">Por {post.autor}</span>
                </div>
                <h3 className="blog-card-title">{post.titulo}</h3>
                <p className="blog-card-excerpt">{post.resumo}</p>
                <Link to={`/blog/post/${post.id}`} className="blog-card-btn">LEIA MAIS</Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="blog-view-all">
          <Link to="/blog" className="blog-view-all-btn">VER TODAS AS POSTAGENS</Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
