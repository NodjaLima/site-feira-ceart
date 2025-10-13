# 🗄️ Recomendações de Banco de Dados - Feira CEART

## ✅ Decisão: Continuar com SQLite

### Por que SQLite é a melhor escolha para este projeto:

#### 1. **Simplicidade Operacional** ⭐⭐⭐⭐⭐
- Zero configuração necessária
- Arquivo único (`ceart_cms.db`)
- Deploy simplificado (upload do arquivo)
- Backup = copiar arquivo

#### 2. **Custo-Benefício** 💰
- Sem custo adicional de servidor de BD
- Funciona em qualquer hospedagem Node.js
- Não precisa de servidor separado

#### 3. **Performance Adequada** ⚡
- Muito rápido para leitura (ideal para sites)
- Adequado para até 100 mil registros
- Perfeito para CMS com poucos editores

#### 4. **Características do Projeto** 📊
```
Uso típico do CMS Feira CEART:
- 📝 Poucos editores (1-3 administradores)
- 📄 Volume de dados pequeno/médio
- 👥 Poucos expositores (< 500)
- 📰 Posts ocasionais (< 1000)
- 🖼️ Galeria moderada (< 5000 imagens)
- 📖 Mais leitura que escrita (90% leitura)
```

## 🚀 Otimizações Implementadas

### 1. **WAL Mode** (Write-Ahead Logging)
```javascript
PRAGMA journal_mode = WAL
```
- Permite leitura durante escrita
- Melhora concorrência
- Performance até 100x melhor

### 2. **Cache Otimizado**
```javascript
PRAGMA cache_size = 10000
```
- Cache de 10MB para consultas
- Acelera leitura de dados frequentes

### 3. **Sincronização Normal**
```javascript
PRAGMA synchronous = NORMAL
```
- Balance entre segurança e performance

### 4. **Foreign Keys Ativadas**
```javascript
PRAGMA foreign_keys = ON
```
- Integridade referencial
- Previne dados órfãos

## 📦 Sistema de Backup

### Comando Manual:
```bash
npm run backup
```

### Backup Automático:
Recomendado executar:
- **Diariamente** durante desenvolvimento
- **Semanalmente** em produção
- **Antes de atualizações** importantes

### Configurar Backup Automático (Linux/Mac):
```bash
# Editar crontab
crontab -e

# Adicionar backup diário às 2h da manhã
0 2 * * * cd /caminho/para/ceart-cms && npm run backup:auto
```

### Configurar Backup Automático (Windows):
Use o Agendador de Tarefas do Windows para executar:
```
npm run backup
```

## 📈 Quando Considerar Migração

Migre para PostgreSQL **APENAS SE**:

### ✅ Indicadores de Necessidade:
- ✅ Mais de 5 editores simultâneos
- ✅ Mais de 100 mil registros
- ✅ Necessidade de replicação
- ✅ Múltiplas aplicações acessando o BD
- ✅ Relatórios complexos em tempo real

### ⚠️ Sinais de Alerta:
- ⚠️ Erros de "database is locked"
- ⚠️ Queries lentas (> 1 segundo)
- ⚠️ Arquivo .db > 1GB

## 🔄 Plano de Migração (Futuro)

Caso precise migrar, siga esta ordem:

### 1. **Preparação**
```bash
# 1. Fazer backup completo
npm run backup

# 2. Exportar dados para JSON
node scripts/export-to-json.js
```

### 2. **Instalação PostgreSQL**
```bash
npm install pg
npm uninstall sqlite3
```

### 3. **Migração de Schema**
```javascript
// Converter CREATE TABLE statements
// Ajustar tipos de dados
// Configurar conexão com PostgreSQL
```

### 4. **Import de Dados**
```bash
# Importar JSON para PostgreSQL
node scripts/import-from-json.js
```

## 📊 Comparativo de Custos

| Opção | Custo Mensal | Manutenção | Complexidade |
|-------|--------------|------------|--------------|
| **SQLite** (atual) | R$ 0 | Baixa | Simples |
| PostgreSQL (Heroku) | R$ 50-200 | Média | Média |
| PostgreSQL (AWS RDS) | R$ 100-500 | Alta | Alta |
| MySQL (Hostgator) | R$ 30-80 | Média | Média |

## 🎯 Conclusão

**Recomendação Final:** MANTER SQLite

### ✅ Vantagens para o Projeto:
1. **Simplicidade**: Foco no desenvolvimento, não na infraestrutura
2. **Custo**: Zero custos adicionais
3. **Performance**: Mais que adequada para o volume esperado
4. **Manutenção**: Mínima, apenas backups periódicos
5. **Deploy**: Simples e direto

### 📝 Ações Recomendadas:
- [x] Otimizações SQLite implementadas
- [x] Sistema de backup criado
- [ ] Configurar backup automático em produção
- [ ] Monitorar performance mensalmente
- [ ] Revisar necessidade de migração anualmente

## 📞 Suporte

Se tiver dúvidas sobre o banco de dados ou precisar de ajuda com a migração no futuro, consulte:
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node SQLite3](https://github.com/TryGhost/node-sqlite3)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Última atualização:** Outubro de 2025
