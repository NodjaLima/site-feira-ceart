import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById, getRelatedPosts, BlogPost } from '../../data/mockData';
import './PostPage.css';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // Simula um pequeno atraso para efeitos de carregamento
    setTimeout(() => {
      const fetchedPost = getPostById(Number(id));
      const fetchedRelatedPosts = getRelatedPosts(Number(id), 3);
      
      setPost(fetchedPost || null);
      setRelatedPosts(fetchedRelatedPosts);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="post-loading">
        <div className="loading-spinner"></div>
        <p>Carregando artigo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-not-found">
        <h2>Artigo não encontrado</h2>
        <p>O artigo que você está procurando não existe ou foi removido.</p>
        <Link to="/blog" className="back-button">Voltar para o Blog</Link>
      </div>
    );
  }

  return (
    <div className="post-page">
      <div className="post-container">
        <div className="post-header">
          <Link to="/blog" className="back-button">
            <span className="back-arrow">←</span> Voltar para o Blog
          </Link>
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">Publicado em {new Date(post.date).toLocaleDateString('pt-BR')}</span>
            <span className="post-author">Por {post.author}</span>
            <span className="post-read-time">{post.readTime} de leitura</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
        </div>
        
        <div className="post-featured-image">
          <img src={post.image} alt={post.title} />
        </div>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="post-share">
          <p>Compartilhe este artigo:</p>
          <div className="social-buttons">
            <button className="social-button facebook">Facebook</button>
            <button className="social-button twitter">Twitter</button>
            <button className="social-button whatsapp">WhatsApp</button>
          </div>
        </div>
        
        <div className="post-related">
          <h3>Artigos Relacionados</h3>
          <div className="related-posts">
            {relatedPosts.map(relatedPost => (
              <Link to={`/blog/post/${relatedPost.id}`} className="related-post-card" key={relatedPost.id}>
                <div className="related-post-image">
                  <img src={relatedPost.image} alt={relatedPost.title} />
                </div>
                <h4>{relatedPost.title}</h4>
                <p className="related-post-meta">
                  <span>{relatedPost.category}</span>
                  <span>{relatedPost.readTime}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
