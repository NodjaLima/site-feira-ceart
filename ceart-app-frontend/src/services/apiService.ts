// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://site-feira-ceart-production.up.railway.app/api';
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

// Helper para completar URLs de imagem
export function getFullImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/avatar-placeholder.svg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return `${BACKEND_BASE_URL}${imagePath}`;
  return `${BACKEND_BASE_URL}/${imagePath}`;
}

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
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  galeria_imagens?: string; // JSON string com array de URLs
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

// Interface para Regulamento
export interface Regulamento {
  id: number;
  titulo: string;
  subtitulo: string;
  conteudo: string;
  arquivo_pdf?: string;
  ano: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
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
    return items
      .filter(item => item.ativo)
      .sort((a, b) => a.ordem - b.ordem)
      .map(item => ({
        ...item,
        imagem: getFullImageUrl(item.imagem)
      }));
  }

  // Métodos para Expositores
  async getExpositores(): Promise<Expositor[]> {
    const expositores = await this.request<Expositor[]>('/expositores');
    // Completar URLs das imagens
    return expositores.map(exp => {
      let galeriaImagens = exp.galeria_imagens;
      
      // Parse e corrige URLs da galeria
      if (galeriaImagens) {
        try {
          const galeria = JSON.parse(galeriaImagens);
          if (Array.isArray(galeria)) {
            galeriaImagens = JSON.stringify(galeria.map(img => getFullImageUrl(img)));
          }
        } catch {
          // Se não for JSON válido, mantém como está
        }
      }
      
      return {
        ...exp,
        imagem: getFullImageUrl(exp.imagem),
        galeria_imagens: galeriaImagens
      };
    });
  }

  async getExpositoresAtivos(): Promise<Expositor[]> {
    return this.getExpositores();
  }

  async getExpositorById(id: number): Promise<Expositor | null> {
    try {
      const exp = await this.request<Expositor>(`/expositores/${id}`);
      
      let galeriaImagens = exp.galeria_imagens;
      
      // Parse e corrige URLs da galeria
      if (galeriaImagens) {
        try {
          const galeria = JSON.parse(galeriaImagens);
          if (Array.isArray(galeria)) {
            galeriaImagens = JSON.stringify(galeria.map(img => getFullImageUrl(img)));
          }
        } catch {
          // Se não for JSON válido, mantém como está
        }
      }
      
      return {
        ...exp,
        imagem: getFullImageUrl(exp.imagem),
        galeria_imagens: galeriaImagens
      };
    } catch {
      return null;
    }
  }

  // Métodos para Posts do Blog
  async getPosts(): Promise<BlogPost[]> {
    const posts = await this.request<BlogPost[]>('/posts');
    return posts.map(post => ({
      ...post,
      imagem_destaque: getFullImageUrl(post.imagem_destaque)
    }));
  }

  async getPostsPublicados(): Promise<BlogPost[]> {
    const posts = await this.getPosts();
    return posts.filter(post => post.publicado).sort((a, b) => 
      new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime()
    );
  }

  async getPostById(id: number): Promise<BlogPost | null> {
    try {
      const post = await this.request<BlogPost>(`/posts/${id}`);
      return {
        ...post,
        imagem_destaque: getFullImageUrl(post.imagem_destaque)
      };
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
    const itens = await this.request<GaleriaItem[]>(`/galerias/${galeriaId}/itens`);
    return itens.map(item => ({
      ...item,
      imagem: getFullImageUrl(item.imagem)
    }));
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

  // Métodos para Regulamento
  async getRegulamentoAtivo(): Promise<Regulamento> {
    const reg = await this.request<Regulamento>('/regulamento');
    return {
      ...reg,
      arquivo_pdf: reg.arquivo_pdf ? getFullImageUrl(reg.arquivo_pdf) : undefined
    };
  }

  async getRegulamentos(): Promise<Regulamento[]> {
    const regs = await this.request<Regulamento[]>('/regulamentos');
    return regs.map(reg => ({
      ...reg,
      arquivo_pdf: reg.arquivo_pdf ? getFullImageUrl(reg.arquivo_pdf) : undefined
    }));
  }

  async getRegulamentoById(id: number): Promise<Regulamento> {
    const reg = await this.request<Regulamento>(`/regulamento/${id}`);
    return {
      ...reg,
      arquivo_pdf: reg.arquivo_pdf ? getFullImageUrl(reg.arquivo_pdf) : undefined
    };
  }

  // Método para buscar informações gerais do site
  // Método para enviar formulário de contato
  async enviarContato(dados: { nome: string; email: string; telefone: string; mensagem?: string }) {
    try {
      // Criar AbortController para timeout de 25 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(`${API_BASE_URL}/contato/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao enviar mensagem');
      }

      return result;
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout: O envio está demorando muito. Tente novamente em alguns minutos.');
        }
        throw error;
      }
      
      throw new Error('Erro desconhecido ao enviar mensagem');
    }
  }

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
      // Novas configurações de branding
      navbar_logo: configMap.navbar_logo ? getFullImageUrl(configMap.navbar_logo) : '/logo.png',
      footer_logo: configMap.footer_logo ? getFullImageUrl(configMap.footer_logo) : '',
      org_name: configMap.org_name || 'ACE',
      org_description: configMap.org_description || 'Associação Comercial e Empresarial',
      feira_description: configMap.feira_description || 'Uma iniciativa da ACE - Associação Comercial e Empresarial',
      site_email: configMap.site_email || 'contato@feiraceart.com.br',
      site_phone: configMap.site_phone || '(11) 9999-9999',
      site_address: configMap.site_address || 'São Paulo, SP',
      // Redes sociais
      site_instagram: configMap.site_instagram || '',
      site_facebook: configMap.site_facebook || '',
      site_youtube: configMap.site_youtube || '',
      site_url: configMap.site_url || '',
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

export const useRegulamento = () => {
  return {
    getRegulamentoAtivo: () => apiService.getRegulamentoAtivo(),
  };
};