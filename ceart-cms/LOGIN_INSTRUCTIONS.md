# 🔐 Instruções de Login - CEART CMS

## Acesso ao Painel Administrativo

Para acessar o painel administrativo do CMS, você precisa estar autenticado.

### Credenciais Padrão

**Usuário:** `admin`  
**Senha:** `admin123`

> ⚠️ **IMPORTANTE**: Altere a senha padrão após o primeiro acesso em produção!

---

## Como Acessar

1. Acesse a URL do CMS: `http://localhost:3001` (desenvolvimento) ou a URL de produção
2. Você será automaticamente redirecionado para `/login` se não estiver autenticado
3. Digite o usuário e senha
4. Marque "Lembrar-me" se quiser manter a sessão ativa por 30 dias (caso contrário, sessão expira em 24h)
5. Clique em "Entrar"

---

## Segurança

### Alterando a Senha do Administrador

**Opção 1: Usando Variável de Ambiente (Recomendado)**

Defina a variável de ambiente `ADMIN_PASSWORD` antes de iniciar o servidor:

```bash
# Linux/Mac
export ADMIN_PASSWORD="sua_senha_segura"
npm start

# Windows (CMD)
set ADMIN_PASSWORD=sua_senha_segura
npm start

# Windows (PowerShell)
$env:ADMIN_PASSWORD="sua_senha_segura"
npm start
```

**Opção 2: Editando Diretamente no Banco**

```bash
# Acesse o banco de dados SQLite
sqlite3 ceart_cms.db

# Gerar hash bcrypt da nova senha (use uma ferramenta online ou Node.js)
# Depois atualize no banco:
UPDATE users SET password = 'seu_hash_bcrypt_aqui' WHERE username = 'admin';
```

### Configuração da Session Secret

Para produção, defina uma chave secreta forte:

```bash
export SESSION_SECRET="uma_chave_muito_segura_e_aleatoria_aqui"
```

---

## Funcionalidades de Autenticação

### Rotas Protegidas

Todas as operações de escrita (POST, PUT, DELETE) estão protegidas e exigem autenticação:

- ✅ Criar, editar e excluir **Expositores**
- ✅ Gerenciar **Galeria de Fotos** dos expositores
- ✅ Criar, editar e excluir **Posts/Blog**
- ✅ Gerenciar **Galerias** e seus itens
- ✅ Gerenciar **Carrossel** de imagens
- ✅ Gerenciar **Regulamentos**
- ✅ Atualizar **Configurações** do sistema

### Rotas Públicas (Sem Autenticação)

As operações de leitura (GET) permanecem públicas para que o frontend funcione:

- 📖 Listar e visualizar expositores
- 📖 Listar e visualizar posts
- 📖 Visualizar galerias
- 📖 Visualizar carrossel
- 📖 Visualizar regulamentos
- 📖 Visualizar configurações

---

## Sessão e Cookies

- **Duração Padrão**: 24 horas
- **Com "Lembrar-me"**: 30 dias
- **Cookie**: httpOnly (não acessível via JavaScript), secure em produção (HTTPS)
- **Logout**: Clique no botão "Sair" no cabeçalho do painel admin

---

## Solução de Problemas

### Não consigo fazer login

1. Verifique se as credenciais estão corretas
2. Verifique se o servidor está rodando
3. Limpe os cookies do navegador e tente novamente
4. Verifique os logs do servidor para erros

### Redirecionado para login após autenticar

1. Verifique se os cookies estão habilitados no navegador
2. Em produção, certifique-se de usar HTTPS
3. Verifique se a SESSION_SECRET está configurada

### Sessão expira muito rápido

- Marque a opção "Lembrar-me" ao fazer login
- Ou aumente o `maxAge` no código do servidor (arquivo `server.js`)

---

## Criando Novos Usuários (Futuro)

> 🚧 Funcionalidade em desenvolvimento

Atualmente, apenas o usuário `admin` é criado automaticamente. Para adicionar novos usuários:

1. Acesse o banco de dados diretamente
2. Insira um novo registro na tabela `users` com senha hasheada usando bcrypt
3. Exemplo:

```javascript
const bcrypt = require('bcryptjs');
const password = 'senha_do_novo_usuario';
const hash = bcrypt.hashSync(password, 10);
// Insira o hash no banco
```

---

## Suporte

Para questões ou problemas relacionados ao sistema de autenticação, entre em contato com o desenvolvedor.

---

**Última atualização:** Janeiro 2025  
**Versão do Sistema:** 1.0 com Autenticação
