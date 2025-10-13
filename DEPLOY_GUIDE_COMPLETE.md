# 🚀 Guia de Deploy - Feira CEART

## Deploy Automático vs Manual

### 🔄 Deploy Automático (Recomendado)

Para ativar o deploy automático no Vercel:

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `ceart-app-frontend`
3. Vá em **Settings** → **Git**
4. Configure:
   - ✅ **Repository**: `NodjaLima/site-feira-ceart`
   - ✅ **Production Branch**: `main`
   - ✅ **Root Directory**: `ceart-app-frontend`
   - ✅ **Auto Deploy**: Habilitado
5. Salve as configurações

**Com isso configurado**, todo push para `main` fará deploy automático! 🎉

---

## 📦 Deploy Manual

### Frontend (Vercel)

#### Opção 1: Usando o Script (Mais Fácil)

```bash
# Na raiz do projeto
./deploy-frontend.sh
```

#### Opção 2: Via Vercel CLI

```bash
# Entrar no diretório do frontend
cd ceart-app-frontend

# Instalar dependências
npm install

# Build
npm run build

# Deploy para produção
vercel --prod
```

#### Opção 3: Via Dashboard do Vercel

1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto `ceart-app-frontend`
3. Vá em **Deployments**
4. Clique em **Redeploy** no último deploy
5. Selecione **Use existing Build Cache** ou **Rebuild**

---

### Backend (Railway)

O backend no Railway faz deploy automático quando você faz push para o GitHub.

Para forçar um redeploy:

1. Acesse: https://railway.app/dashboard
2. Selecione o projeto `ceart-cms`
3. Clique em **Deploy** → **Redeploy**

Ou via CLI:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## 🔧 Configuração Inicial do Vercel CLI

### Primeira vez usando o Vercel CLI:

```bash
# 1. Instalar Vercel CLI globalmente
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Entrar no diretório do frontend
cd ceart-app-frontend

# 4. Linkar com o projeto existente
vercel link

# Siga as instruções:
# - Set up and deploy? N (Não)
# - Link to existing project? Y (Sim)
# - Escolha: NodjaLima/site-feira-ceart
# - Found project "ceart-app-frontend"? Y (Sim)

# 5. Agora pode usar o script de deploy
cd ..
./deploy-frontend.sh
```

---

## 🌐 URLs de Produção

- **Frontend (Vercel):** https://ceart-app-frontend.vercel.app
- **Backend (Railway):** https://[seu-projeto].up.railway.app
- **Admin Panel:** https://[seu-projeto].up.railway.app/admin

---

## 📝 Variáveis de Ambiente

### Frontend (Vercel)

Configure no Dashboard do Vercel em **Settings** → **Environment Variables**:

```
VITE_API_URL=https://[seu-backend].up.railway.app/api
```

### Backend (Railway)

Configure no Dashboard do Railway:

```
PORT=3001
NODE_ENV=production
SESSION_SECRET=sua_chave_secreta_forte_aqui
FRONTEND_URL=https://ceart-app-frontend.vercel.app
DATA_DIR=/data
UPLOADS_DIR=/uploads
```

---

## 🐛 Troubleshooting

### Frontend não atualiza no Vercel

1. **Verifique se o commit foi enviado:**
   ```bash
   git log --oneline -5
   git push origin main
   ```

2. **Force um redeploy:**
   ```bash
   ./deploy-frontend.sh
   ```

3. **Limpe o cache do Vercel:**
   - Dashboard → Deployments → Redeploy (sem cache)

### Backend não atualiza no Railway

1. **Verifique os logs:**
   - Dashboard → Deployments → View Logs

2. **Force um redeploy:**
   - Dashboard → Deploy → Redeploy

3. **Verifique as variáveis de ambiente**

### Build falha

1. **Verifique as dependências:**
   ```bash
   cd ceart-app-frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Verifique erros no código:**
   ```bash
   npm run lint
   ```

---

## 📊 Monitoramento

### Vercel

- **Dashboard:** https://vercel.com/dashboard
- **Analytics:** Métricas de performance e uso
- **Logs:** Ver logs de build e runtime

### Railway

- **Dashboard:** https://railway.app/dashboard
- **Metrics:** CPU, memória, network
- **Logs:** Logs em tempo real do servidor

---

## 🔐 Segurança

### Checklist antes de cada deploy:

- ✅ Variáveis de ambiente configuradas
- ✅ SESSION_SECRET forte em produção
- ✅ CORS configurado corretamente
- ✅ HTTPS habilitado (automático no Vercel/Railway)
- ✅ Senhas do admin alteradas
- ✅ Backup do banco de dados realizado

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vite Docs](https://vitejs.dev)
- [Express.js Docs](https://expressjs.com)

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0 com Autenticação
