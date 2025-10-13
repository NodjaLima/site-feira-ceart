# 🔐 Sistema de Autenticação - CEART CMS

## Credenciais Padrão

**Usuário:** `admin`  
**Senha:** `admin123`

> ⚠️ **IMPORTANTE**: Altere a senha padrão após o primeiro acesso!

## Como Acessar

1. Acesse: http://localhost:3001/login (desenvolvimento) ou https://seu-dominio.com/login (produção)
2. Digite o usuário e senha
3. Marque "Lembrar-me" se quiser permanecer logado por 30 dias
4. Clique em "Entrar"

## Recursos

- ✅ Autenticação com sessão segura
- ✅ Proteção de todas as rotas da API admin
- ✅ Senha criptografada com bcrypt
- ✅ Opção "Lembrar-me" (30 dias)
- ✅ Logout com confirmação
- ✅ Redirecionamento automático se não autenticado
- ✅ Interface moderna e responsiva

## Segurança

### Em Desenvolvimento
- Sessão expira em 24 horas (sem "lembrar-me")
- Cookie seguro desabilitado (HTTP)

### Em Produção
- Configure a variável de ambiente `SESSION_SECRET` com uma chave forte
- Configure `NODE_ENV=production` para ativar cookies seguros (HTTPS)
- Exemplo:
  ```bash
  export SESSION_SECRET="sua-chave-secreta-super-forte-aqui"
  export NODE_ENV="production"
  ```

## Alterar Senha Padrão

### Via Variável de Ambiente (antes do primeiro start)
```bash
export ADMIN_PASSWORD="sua-senha-forte"
npm start
```

### Via Banco de Dados
```bash
cd ceart-cms
node -e "
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ceart_cms.db');

const novaSenha = 'SUA_NOVA_SENHA_AQUI';
const hash = bcrypt.hashSync(novaSenha, 10);

db.run('UPDATE users SET password = ? WHERE username = ?', [hash, 'admin'], (err) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('✅ Senha atualizada com sucesso!');
  }
  db.close();
});
"
```

## Criar Novos Usuários

Atualmente, apenas o usuário admin pode ser criado. Para adicionar mais usuários, execute:

```bash
cd ceart-cms
node -e "
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ceart_cms.db');

const usuario = 'novo_usuario';
const senha = 'senha_forte';
const nome = 'Nome Completo';
const email = 'email@exemplo.com';

const hash = bcrypt.hashSync(senha, 10);

db.run(
  'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
  [usuario, hash, nome, email, 'admin'],
  (err) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('Username:', usuario);
      console.log('Password:', senha);
    }
    db.close();
  }
);
"
```

## Estrutura de Sessão

```javascript
{
  userId: 1,
  username: 'admin',
  name: 'Administrador',
  role: 'admin'
}
```

## Rotas Protegidas

Todas as rotas abaixo requerem autenticação:

- `GET /admin` - Painel administrativo
- `GET /api/auth/check` - Verificar autenticação
- Todas as rotas de modificação da API (`POST`, `PUT`, `DELETE`)

## Rotas Públicas

As seguintes rotas são públicas (não requerem autenticação):

- `GET /login` - Página de login
- `POST /api/auth/login` - Endpoint de login
- `POST /api/auth/logout` - Endpoint de logout
- `GET /api/*` - Todas as rotas GET da API (leitura pública)

## Troubleshooting

### "Não autenticado" após login
- Verifique se os cookies estão habilitados no navegador
- Limpe o cache e cookies do navegador
- Verifique se `credentials: 'include'` está configurado nas requisições

### Sessão expira rapidamente
- Verifique a configuração `cookie.maxAge` no `server.js`
- Em produção, certifique-se que `NODE_ENV=production` está configurado

### Erro de CORS
- Adicione a origem do seu frontend em `allowedOrigins` no `server.js`
- Certifique-se que `credentials: true` está configurado no CORS

## Melhorias Futuras

- [ ] Recuperação de senha por email
- [ ] Autenticação de dois fatores (2FA)
- [ ] Múltiplos níveis de permissão (admin, editor, visualizador)
- [ ] Log de atividades dos usuários
- [ ] Interface para gerenciar usuários no CMS
