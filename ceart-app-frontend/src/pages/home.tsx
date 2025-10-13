import CarrosselDestaque from "../components/carossel-destaque/CarrosselDestaque";
import BlogSection from "../components/blog-section/BlogSection";
import GaleriaSection from "../components/galeria-section/GaleriaSection";
import ExpositoresSection from "../components/expositores-section/ExpositoresSection";
import ContatoSection from "../components/contato-section/ContatoSection";

const Home = () => {
  return (
    <div>
      <header>
        <CarrosselDestaque />
      </header>
      
      <main>
        <GaleriaSection />
        <ExpositoresSection />
        <BlogSection />
        <ContatoSection />
      </main>
    </div>
  );
};

export default Home;
