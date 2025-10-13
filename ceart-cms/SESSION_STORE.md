# 🔐 Session Store Configuration

## Problema Resolvido

O aviso original ao fazer deploy:
```
Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
```

## Solução Implementada

Substituímos o **MemoryStore** padrão por um **SQLite Session Store** usando o pacote `better-sqlite3-session-store`.

### Vantagens:

✅ **Produção-Ready**: Adequado para ambientes de produção  
✅ **Persistência**: Sessões sobrevivem a reinicializações do servidor  
✅ **Performance**: SQLite é rápido e eficiente  
✅ **Limpeza Automática**: Sessões expiradas são removidas automaticamente  
✅ **Sem Memória Leak**: Não há vazamento de memória  
✅ **Escalável**: Funciona com múltiplos processos (se necessário)

## Implementação

### Pacotes Instalados:
```bash
npm install better-sqlite3-session-store better-sqlite3
```

### Configuração no `server.js`:

```javascript
const session = require('express-session');
const SqliteStore = require('better-sqlite3-session-store')(session);
const Database = require('better-sqlite3');

// Criar banco de dados de sessões
const sessionDb = new Database('sessions.db');

app.use(session({
  store: new SqliteStore({
    client: sessionDb,
    expired: {
      clear: true,
      intervalMs: 900000 // Limpar sessões expiradas a cada 15 minutos
    }
  }),
  secret: process.env.SESSION_SECRET || 'ceart-cms-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));
```

## Arquivos Gerados

- `sessions.db` - Banco de dados SQLite que armazena as sessões
- Este arquivo é criado automaticamente na inicialização do servidor

## Variáveis de Ambiente

### Produção (Railway/Heroku):
```bash
DATA_DIR=/data  # Diretório para armazenar sessions.db e ceart_cms.db
SESSION_SECRET=sua_chave_secreta_forte_aqui
NODE_ENV=production
```

## Limpeza de Sessões

As sessões expiradas são automaticamente removidas a cada **15 minutos** (900000ms).

Você pode ajustar este intervalo modificando o parâmetro `intervalMs`:

```javascript
expired: {
  clear: true,
  intervalMs: 900000 // 15 minutos
}
```

## Backup

Para fazer backup das sessões:
```bash
cp sessions.db sessions_backup.db
```

## Monitoramento

Para verificar as sessões ativas no banco:
```bash
sqlite3 sessions.db "SELECT * FROM sessions;"
```

Para contar sessões ativas:
```bash
sqlite3 sessions.db "SELECT COUNT(*) FROM sessions;"
```

## Segurança

- ✅ Cookies com `httpOnly: true` (não acessíveis via JavaScript)
- ✅ Cookies com `secure: true` em produção (HTTPS only)
- ✅ Session Secret configurável via variável de ambiente
- ✅ Sessões persistidas em arquivo local (não na memória)

## Referências

- [better-sqlite3-session-store](https://www.npmjs.com/package/better-sqlite3-session-store)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [express-session](https://www.npmjs.com/package/express-session)

---

**Última atualização:** Janeiro 2025  
**Status:** ✅ Funcionando em produção
