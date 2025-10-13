# CEART CMS - Sistema de Gerenciamento de Conteúdo

Sistema de gerenciamento de conteúdo para a Feira Cultural de Arte e Artesanato (CEART), desenvolvido em Node.js com Express e SQLite.

## 🚀 Características

- **Interface de Administração Intuitiva**: Painel web responsivo para gerenciar conteúdo
- **API RESTful**: Endpoints para integração com o frontend React
- **Upload de Imagens**: Sistema de upload para fotos de expositores e posts
- **Banco SQLite**: Base de dados leve e portátil
- **Dados de Exemplo**: Script de seed para popular o banco com dados de teste

## 📁 Estrutura do Projeto

```
ceart-cms/
├── server.js              # Servidor Express principal
├── package.json           # Dependências e scripts
├── ceart_cms.db          # Banco de dados SQLite (criado automaticamente)
├── public/               # Interface de administração
│   ├── index.html        # Painel administrativo
│   └── admin.js          # JavaScript do painel
├── uploads/              # Diretório de uploads de imagens
└── scripts/
    └── seed.js           # Script para popular banco com dados de exemplo
```

## 🛠️ Instalação e Configuração

### 1. Instalar dependências
```bash
cd ceart-cms
npm install
```

### 2. Popular banco com dados de exemplo
```bash
npm run seed
```

### 3. Iniciar o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

### 4. Acessar o painel
- **Painel Admin**: http://localhost:3001/admin
- **API Base**: http://localhost:3001/api

## 📊 API Endpoints

### Expositores
- `GET /api/expositores` - Listar todos os expositores
- `GET /api/expositores/:id` - Buscar expositor por ID
- `POST /api/expositores` - Criar novo expositor (com upload de foto)

### Posts do Blog
- `GET /api/posts` - Listar posts (com filtros opcionais)
- `GET /api/posts/:id` - Buscar post por ID
- `POST /api/posts` - Criar novo post (com upload de imagem)

### Configurações
- `GET /api/configuracoes` - Buscar configurações do site

### Upload
- `POST /api/upload` - Upload de arquivos de imagem

## 💾 Estrutura do Banco de Dados

### Tabela: expositores
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
nome TEXT NOT NULL
especialidade TEXT NOT NULL
cidade TEXT
estado TEXT
telefone TEXT
email TEXT
instagram TEXT
descricao TEXT
foto TEXT
galeria TEXT (JSON)
ativo INTEGER DEFAULT 1
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Tabela: posts
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
titulo TEXT NOT NULL
conteudo TEXT NOT NULL
categoria TEXT NOT NULL
imagem TEXT
data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP
autor TEXT DEFAULT 'Admin CEART'
publicado INTEGER DEFAULT 1
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Tabela: configuracoes
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
chave TEXT UNIQUE NOT NULL
valor TEXT
descricao TEXT
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

## 🎨 Painel de Administração

O painel administrativo oferece:

### Dashboard
- **Estatísticas gerais**: Total de expositores, posts e informações da feira
- **Navegação por abas**: Interface organizada e intuitiva

### Gerenciamento de Expositores
- ✅ Cadastro completo com dados pessoais e profissionais
- ✅ Upload de foto de perfil
- ✅ Especialidades predefinidas
- 🚧 Edição e exclusão (em desenvolvimento)

### Blog Posts
- ✅ Criação de posts com editor de texto
- ✅ Categorização (Artesanato, Empreendedorismo, Sustentabilidade, etc.)
- ✅ Upload de imagem de destaque
- 🚧 Edição e exclusão (em desenvolvimento)

### Configurações
- 🚧 Configurações gerais do site (em desenvolvimento)

## 🔄 Integração com Frontend

Para integrar com o frontend React, utilize os endpoints da API:

```javascript
// Exemplo: Buscar expositores
const response = await fetch('http://localhost:3001/api/expositores');
const data = await response.json();
const expositores = data.data;

// Exemplo: Buscar posts do blog
const response = await fetch('http://localhost:3001/api/posts?categoria=Artesanato');
const data = await response.json();
const posts = data.data;
```

## 🚧 Funcionalidades em Desenvolvimento

- [ ] Edição de expositores existentes
- [ ] Exclusão de expositores
- [ ] Edição de posts do blog
- [ ] Exclusão de posts
- [ ] Sistema de autenticação/login
- [ ] Galeria de imagens para expositores
- [ ] Configurações avançadas do site
- [ ] Backup automático do banco
- [ ] Logs de auditoria

## 📱 Responsividade

O painel administrativo é totalmente responsivo e funciona em:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🔒 Segurança

Medidas implementadas:
- ✅ Validação de tipos de arquivo no upload
- ✅ Limitação de tamanho de arquivos (5MB)
- ✅ Sanitização de inputs
- 🚧 Sistema de autenticação (em desenvolvimento)

## 🌟 Próximos Passos

1. **Deploy em Produção**
   - Configurar em VPS (DigitalOcean, Vultr, etc.)
   - Configurar domínio (api.feiraceart.com.br)
   - Configurar SSL (Let's Encrypt)

2. **Integração Completa**
   - Adaptar frontend React para consumir API
   - Migrar dados mockados para API real
   - Implementar cache e otimizações

3. **Funcionalidades Avançadas**
   - Sistema de usuários e permissões
   - Dashboard com métricas avançadas
   - Notificações por email
   - Integração com redes sociais

## 🤝 Contribuição

Este é um projeto da Feira CEART 2025. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License.

---

**Desenvolvido com ❤️ para a comunidade artesanal brasileira**