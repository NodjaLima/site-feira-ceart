# 🚀 Guia de Deploy - Feira CEART

## Opção Recomendada: Vercel (Frontend) + Railway (Backend)

### 📦 Preparação

#### 1. **Separar Repositórios (Recomendado)**
```bash
# Criar dois repositórios no GitHub:
# 1. feiraceart-frontend (React)
# 2. feiraceart-backend (Node.js)
```

#### 2. **Ou Usar Monorepo** (Alternativa)
```bash
# Manter tudo no mesmo repositório
# Configurar deploy paths diferentes
```

---

## 🎨 FRONTEND - Deploy na Vercel

### Passo 1: Preparar o Frontend

1. **Criar arquivo de configuração de build:**

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
})
```

2. **Configurar variáveis de ambiente:**

```bash
# .env.production
VITE_API_URL=https://seu-backend.railway.app/api
```

3. **Atualizar apiService.ts:**

```typescript
// src/services/apiService.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Passo 2: Deploy no Vercel

1. **Acesse:** https://vercel.com
2. **Clique em:** "Add New Project"
3. **Importe:** seu repositório do GitHub
4. **Configure:**
   - Framework Preset: `Vite`
   - Root Directory: `ceart-app-frontend` (ou deixe em branco se for repositório separado)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: 
     - `VITE_API_URL` = URL do seu backend Railway

5. **Deploy!** 🚀

### Configuração Adicional Vercel

```json
// vercel.json (na raiz do frontend)
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🔧 BACKEND - Deploy no Railway

### Passo 1: Preparar o Backend

1. **Criar arquivo de configuração:**

```javascript
// railway.json (opcional)
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Atualizar package.json:**

```json
{
  "name": "ceart-cms",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seed.js",
    "backup": "node scripts/backup.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

3. **Configurar CORS para permitir Vercel:**

```javascript
// server.js
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://seu-site.vercel.app',
  'https://*.vercel.app' // Permite preview deploys
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp(allowed.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

4. **Preparar diretórios persistentes:**

```javascript
// server.js - Ajustar caminhos para volume Railway
const path = require('path');
const fs = require('fs');

// Diretório para banco de dados
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'ceart_cms.db');

// Diretório para uploads
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

// Criar diretórios se não existirem
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Usar caminhos configurados
const db = new sqlite3.Database(DB_PATH);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  // ... resto da config
});

// Servir uploads
app.use('/uploads', express.static(UPLOADS_DIR));
```

### Passo 2: Deploy no Railway

1. **Acesse:** https://railway.app
2. **Clique em:** "New Project"
3. **Escolha:** "Deploy from GitHub repo"
4. **Selecione:** seu repositório
5. **Configure:**
   - Root Directory: `ceart-cms` (se monorepo)
   - Start Command: `npm start`

6. **Adicionar Volume Persistente:**
   - Clique em seu service
   - Vá em "Settings" → "Volumes"
   - Adicione volume: `/app/data` (para banco)
   - Adicione volume: `/app/uploads` (para arquivos)

7. **Configurar Variáveis de Ambiente:**
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `DATA_DIR` = `/app/data`
   - `UPLOADS_DIR` = `/app/uploads`

8. **Deploy!** 🚀

### Passo 3: Popular o Banco de Dados

```bash
# Após primeiro deploy, execute seed via Railway CLI
railway run npm run seed

# Ou crie uma rota temporária no server.js
app.get('/admin/seed', (req, res) => {
  // Apenas em desenvolvimento ou com autenticação!
  require('./scripts/seed.js');
  res.send('Seed executado!');
});
```

---

## 🔐 Configurações de Segurança

### 1. **Adicionar Rate Limiting:**

```bash
npm install express-rate-limit
```

```javascript
// server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});

app.use('/api/', limiter);
```

### 2. **Adicionar Helmet para Segurança:**

```bash
npm install helmet
```

```javascript
// server.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: false, // Ajustar conforme necessário
  crossOriginEmbedderPolicy: false
}));
```

### 3. **Variáveis de Ambiente Sensíveis:**

```bash
# No Railway, adicionar:
JWT_SECRET=seu-secret-super-secreto-aqui
ADMIN_PASSWORD=senha-do-admin
```

---

## 📊 Monitoramento e Backup

### Railway - Backups Automáticos

```javascript
// Adicionar script de backup agendado
// Usar GitHub Actions ou Railway Cron

// .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Todo dia às 2h
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Download Database
        run: |
          # Usar Railway CLI para baixar banco
          railway run npm run backup
```

### Vercel - Analytics

```javascript
// Adicionar Vercel Analytics (gratuito)
// package.json
"dependencies": {
  "@vercel/analytics": "^1.0.0"
}

// main.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

---

## 💰 Resumo de Custos

| Serviço | Plano | Custo/Mês | Recursos |
|---------|-------|-----------|----------|
| **Vercel** | Hobby | **GRÁTIS** | Frontend ilimitado, SSL, CDN |
| **Railway** | Developer | **$5** | 500h compute, volumes persistentes |
| **Domínio** | Registro.br | **R$ 40/ano** | .com.br |
| **Total** | - | **~R$ 25-30** | Tudo incluso |

---

## 🎯 Checklist de Deploy

### Antes do Deploy:
- [ ] Testar build local (`npm run build`)
- [ ] Configurar variáveis de ambiente
- [ ] Atualizar URLs da API
- [ ] Configurar CORS corretamente
- [ ] Adicionar segurança (helmet, rate-limit)
- [ ] Criar backups do banco de dados

### Após o Deploy:
- [ ] Testar todas as funcionalidades
- [ ] Popular banco com seed
- [ ] Configurar domínio custom
- [ ] Configurar SSL (automático)
- [ ] Testar upload de arquivos
- [ ] Configurar backup automático
- [ ] Adicionar monitoramento

---

## 🆘 Troubleshooting Comum

### Frontend não conecta com Backend:
```javascript
// Verificar CORS
// Verificar URL da API nas env vars
// Verificar se backend está rodando
```

### Uploads não persistem:
```javascript
// Railway: Verificar se volume está montado
// Verificar permissões de diretório
// Usar caminhos absolutos
```

### Banco de dados perde dados:
```javascript
// Railway: SEMPRE usar volume persistente
// Não usar /tmp ou diretórios efêmeros
// Fazer backups regulares
```

### Deploy falha:
```javascript
// Verificar logs no Railway
// Verificar versão do Node (engines no package.json)
// Verificar se todas dependências estão no package.json
// Não usar devDependencies para prod
```

---

## 📞 Recursos Úteis

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Vercel Deploy Logs:** Dashboard → Project → Deployments
- **Railway Logs:** Dashboard → Project → Logs
- **Vercel Support:** https://vercel.com/support
- **Railway Discord:** https://discord.gg/railway

---

**Última atualização:** Outubro 2025
