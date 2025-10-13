// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://site-feira-ceart-production.up.railway.app/api';

// Interface para Carrossel
export interface CarrosselItem {
  id: number;
  titulo: string;
  imagem: string;
  ordem: number;
  ativo: boolean;
}

// Interface para Expositor
export interface Expositor {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  imagem: string;
  contato?: string;
  telefone?: string;
  email?: string;
  site?: string;
  created_at: string;
  updated_at: string;
}

// Interface para Post do Blog
export interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  resumo: string;
  imagem_destaque: string;
  categoria: string;
  autor: string;
  data_publicacao: string;
  publicado: boolean;
}

// Interface para Item da Galeria
// Interface para Galeria (coleção/edição)
export interface Galeria {
  id: number;
  titulo: string;
  descricao: string;
  data_evento: string;
  ativo: boolean;
  ordem: number;
}

// Interface para Item de Galeria (foto)
export interface GaleriaItem {
  id: number;
  galeria_id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  ordem: number;
}

// Interface para Configurações
export interface Configuracao {
  id: number;
  chave: string;
  valor: string;
  descricao?: string;
  ativo: boolean;
}

// Classe para gerenciar chamadas da API
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos para Carrossel
  async getCarrossel(): Promise<CarrosselItem[]> {
    return this.request<CarrosselItem[]>('/carrossel');
  }

  async getCarrosselAtivo(): Promise<CarrosselItem[]> {
    const items = await this.getCarrossel();
    return items.filter(item => item.ativo).sort((a, b) => a.ordem - b.ordem);
  }

  // Helper para completar URLs de imagem
  private getFullImageUrl(imagePath: string | null): string {
    if (!imagePath) return '/logo.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://site-feira-ceart-production.up.railway.app${imagePath}`;
  }

  // Métodos para Expositores
  async getExpositores(): Promise<Expositor[]> {
    const expositores = await this.request<Expositor[]>('/expositores');
    // Completar URLs das imagens
    return expositores.map(exp => ({
      ...exp,
      imagem: this.getFullImageUrl(exp.imagem)
    }));
  }

  async getExpositoresAtivos(): Promise<Expositor[]> {
    return this.getExpositores();
  }

  async getExpositorById(id: number): Promise<Expositor | null> {
    try {
      return await this.request<Expositor>(`/expositores/${id}`);
    } catch {
      return null;
    }
  }

  // Métodos para Posts do Blog
  async getPosts(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/posts');
  }

  async getPostsPublicados(): Promise<BlogPost[]> {
    const posts = await this.getPosts();
    return posts.filter(post => post.publicado).sort((a, b) => 
      new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime()
    );
  }

  async getPostById(id: number): Promise<BlogPost | null> {
    try {
      return await this.request<BlogPost>(`/posts/${id}`);
    } catch {
      return null;
    }
  }

  async getPostsPorCategoria(categoria: string): Promise<BlogPost[]> {
    const posts = await this.getPostsPublicados();
    return posts.filter(post => post.categoria.toLowerCase() === categoria.toLowerCase());
  }

  // Métodos para Galerias (coleções)
  async getGalerias(): Promise<Galeria[]> {
    return this.request<Galeria[]>('/galerias');
  }

  async getGaleriasAtivas(): Promise<Galeria[]> {
    return this.request<Galeria[]>('/galerias/ativas');
  }

  async getGaleriaById(id: number): Promise<Galeria> {
    return this.request<Galeria>(`/galerias/${id}`);
  }

  // Métodos para Itens de Galeria (fotos)
  async getGaleriaItens(galeriaId: number): Promise<GaleriaItem[]> {
    return this.request<GaleriaItem[]>(`/galerias/${galeriaId}/itens`);
  }

  // Para compatibilidade, retorna itens da primeira galeria ativa
  async getGaleriaAtiva(): Promise<GaleriaItem[]> {
    const galerias = await this.getGaleriasAtivas();
    if (galerias.length > 0) {
      return this.getGaleriaItens(galerias[0].id);
    }
    return [];
  }

  // Métodos para Configurações
  async getConfiguracoes(): Promise<Configuracao[]> {
    return this.request<Configuracao[]>('/configuracoes');
  }

  async getConfiguracao(chave: string): Promise<string | null> {
    try {
      const configuracao = await this.request<Configuracao>(`/configuracoes/${chave}`);
      return configuracao.valor;
    } catch {
      return null;
    }
  }

  // Método para buscar informações gerais do site
  async getInfoSite() {
    const configuracoes = await this.getConfiguracoes();
    const configMap: Record<string, string> = {};
    
    configuracoes.forEach(config => {
      configMap[config.chave] = config.valor;
    });

    return {
      nome_feira: configMap.nome_feira || 'Feira CEART',
      data_evento: configMap.data_evento || '15 a 17 de Novembro de 2025',
      local_evento: configMap.local_evento || 'Centro Cultural CEART',
      descricao_feira: configMap.descricao_feira || 'A maior feira de arte e cultura da região',
      contato_email: configMap.contato_email || 'contato@feiraceart.com',
      contato_telefone: configMap.contato_telefone || '(11) 99999-9999',
      endereco_completo: configMap.endereco_completo || 'Rua das Artes, 123 - Centro',
      horario_funcionamento: configMap.horario_funcionamento || '9h às 18h',
    };
  }
}

// Instância única do serviço
export const apiService = new ApiService();

// Hooks personalizados para React
export const useCarrossel = () => {
  return {
    getCarrosselAtivo: () => apiService.getCarrosselAtivo(),
  };
};

export const useExpositores = () => {
  return {
    getExpositoresAtivos: () => apiService.getExpositoresAtivos(),
    getExpositorById: (id: number) => apiService.getExpositorById(id),
  };
};

export const useBlog = () => {
  return {
    getPostsPublicados: () => apiService.getPostsPublicados(),
    getPostById: (id: number) => apiService.getPostById(id),
    getPostsPorCategoria: (categoria: string) => apiService.getPostsPorCategoria(categoria),
  };
};

export const useGaleria = () => {
  return {
    getGalerias: () => apiService.getGalerias(),
    getGaleriasAtivas: () => apiService.getGaleriasAtivas(),
    getGaleriaById: (id: number) => apiService.getGaleriaById(id),
    getGaleriaItens: (galeriaId: number) => apiService.getGaleriaItens(galeriaId),
    getGaleriaAtiva: () => apiService.getGaleriaAtiva(),
  };
};

export const useConfiguracoes = () => {
  return {
    getInfoSite: () => apiService.getInfoSite(),
    getConfiguracao: (chave: string) => apiService.getConfiguracao(chave),
  };
};