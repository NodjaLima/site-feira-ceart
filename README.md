# 🎨 Feira CEART - Sistema de Gestão de Conteúdo

Sistema completo para gestão da Feira de Arte e Cultura CEART, incluindo CMS administrativo e site institucional.

## 📋 Sobre o Projeto

A Feira CEART é um evento que reúne artesãos, expositores e visitantes interessados em arte e cultura. Este sistema permite:

- ✅ Gerenciar expositores e seus produtos
- ✅ Publicar posts no blog
- ✅ Organizar galeria de fotos
- ✅ Controlar carrossel de destaques
- ✅ Upload de arquivos e documentos
- ✅ Configurações gerais do site

## 🛠️ Tecnologias

### Frontend
- ⚛️ React 19
- 📦 Vite 7
- 🎨 TypeScript
- 🎭 React Router
- 🔄 Fetch API

### Backend (CMS)
- 🟢 Node.js
- 🚂 Express.js
- 🗄️ SQLite3
- 📤 Multer (upload de arquivos)
- 🔒 CORS habilitado

## 📁 Estrutura do Projeto

```
site_feira/
├── ceart-app-frontend/     # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── styles/         # Estilos CSS
│   └── public/             # Arquivos estáticos
│
├── ceart-cms/              # Backend CMS
│   ├── server.js           # Servidor Express
│   ├── config/             # Configurações
│   ├── scripts/            # Scripts utilitários
│   │   ├── seed.js         # Popular banco
│   │   └── backup.js       # Backup automático
│   ├── public/             # Admin Panel
│   └── uploads/            # Arquivos enviados
│
└── docs/                   # Documentação
    ├── DEPLOY_GUIDE.md     # Guia de deploy
    └── DATABASE_RECOMMENDATIONS.md
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/feiraceart.git
cd feiraceart
```

2. **Instale as dependências do Frontend:**
```bash
cd ceart-app-frontend
npm install
```

3. **Instale as dependências do Backend:**
```bash
cd ../ceart-cms
npm install
```

4. **Popule o banco de dados:**
```bash
npm run seed
```

### Executar em Desenvolvimento

**Terminal 1 - Backend (CMS):**
```bash
cd ceart-cms
npm start
# CMS rodando em http://localhost:3001
# Admin Panel: http://localhost:3001/admin
```

**Terminal 2 - Frontend:**
```bash
cd ceart-app-frontend
npm run dev
# Frontend rodando em http://localhost:5173
```

## 📊 Banco de Dados

O projeto utiliza **SQLite** com as seguintes tabelas:

- `expositores` - Cadastro de artesãos
- `posts` - Posts do blog
- `galeria` - Imagens da galeria
- `carrossel` - Slides do carrossel
- `arquivos` - Documentos diversos
- `configuracoes` - Configurações do site

### Backup do Banco

```bash
cd ceart-cms
npm run backup
```

## 🎨 Funcionalidades

### Admin Panel (CMS)
- 📝 CRUD completo de expositores
- 📰 Gerenciamento de posts
- 🖼️ Upload de imagens para galeria
- 🎠 Configuração do carrossel
- 📄 Gestão de arquivos
- ⚙️ Configurações gerais

### Site Público
- 🏠 Home com carrossel de destaques
- 👥 Listagem de expositores
- 📝 Blog com posts
- 🖼️ Galeria de fotos
- 📞 Página de contato
- 📜 Regulamento

## 🌐 Deploy

O projeto está configurado para deploy em:

- **Frontend:** Vercel
- **Backend:** Railway

Veja o guia completo em [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

## 📚 Documentação

- [Guia de Deploy](./DEPLOY_GUIDE.md)
- [Recomendações de Banco de Dados](./ceart-cms/DATABASE_RECOMMENDATIONS.md)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Time CEART** - Desenvolvimento inicial

## 📞 Contato

Para dúvidas ou sugestões:
- Email: contato@feiraceart.com.br
- Website: https://feiraceart.com.br

---

**Desenvolvido com ❤️ para a Feira CEART**
