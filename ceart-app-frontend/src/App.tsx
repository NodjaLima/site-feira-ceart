import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Admin from './pages/admin';
import Expositores from './pages/expositores';
import ExpositorPage from './pages/ExpositorPage';
import Blog from './pages/blog';
import Galeria from './pages/galeria';
import Contato from './pages/contato';
import Regulamento from './pages/regulamento';
import PostPage from './pages/post/PostPage';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

console.log('=== APP.TSX CARREGADO ===');

function App() {
  console.log('=== APP RENDERIZANDO ===');
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/expositores" element={<Expositores />} />
        <Route path="/expositores/:id" element={<ExpositorPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/post/:id" element={<PostPage />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/regulamento" element={<Regulamento />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
