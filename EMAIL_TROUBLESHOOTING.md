# 🔧 Troubleshooting - Envio de Emails

## Problema: Email não está chegando

### ✅ Checklist de Verificação

#### 1. Verificar Configuração Local (.env)

```bash
cd ceart-cms
cat .env
```

**O arquivo deve conter:**
```bash
EMAIL_USER=feiraceart@gmail.com
EMAIL_PASS=sua_senha_de_app_de_16_caracteres
```

⚠️ **IMPORTANTE:** A senha deve ser uma **Senha de App do Gmail**, não a senha normal!

---

#### 2. Gerar Senha de App do Gmail

**Passo a passo:**

1. Acesse: https://myaccount.google.com/security
2. Certifique-se de que **Verificação em duas etapas** está ATIVADA
3. Procure por **Senhas de app** (ou acesse diretamente: https://myaccount.google.com/apppasswords)
4. Clique em **Selecionar app** → **Outro (nome personalizado)**
5. Digite: `Site Feira CEART`
6. Clique em **GERAR**
7. **COPIE a senha de 16 caracteres** (sem espaços)
8. Cole no arquivo `.env` → `EMAIL_PASS=sua_senha_aqui`

---

#### 3. Testar Envio de Email

Execute o script de teste:

```bash
cd ceart-cms
node test-email.js
```

**Resultado esperado:**
```
✅ EMAIL ENVIADO COM SUCESSO!
```

Se aparecer erro, leia as instruções que o script exibe.

---

#### 4. Verificar Logs do Servidor

Ao testar o formulário no site, verifique os logs do backend:

**Desenvolvimento:**
```bash
cd ceart-cms
npm start
```

Procure por estas mensagens:
- `📧 Preparando envio de email para: [email]`
- `✅ Email enviado com sucesso de [nome] ([email]) para [destino]`

Se houver erro, aparecerá:
- `❌ Erro ao enviar email:`

---

#### 5. Testar API Diretamente

Teste a rota de API com curl:

```bash
curl -X POST http://localhost:3001/api/contato/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Manual",
    "email": "teste@example.com",
    "telefone": "(11) 99999-9999",
    "mensagem": "Testando envio direto via API"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Em breve entraremos em contato."
}
```

---

## 🔍 Erros Comuns

### Erro: "Invalid login"

**Causa:** Senha incorreta ou não é uma senha de app.

**Solução:**
1. Gere uma nova senha de app
2. Atualize o arquivo `.env`
3. Reinicie o servidor

---

### Erro: "Missing credentials"

**Causa:** `EMAIL_USER` ou `EMAIL_PASS` não configurados.

**Solução:**
1. Crie/edite o arquivo `.env` em `ceart-cms/`
2. Adicione as variáveis:
   ```bash
   EMAIL_USER=feiraceart@gmail.com
   EMAIL_PASS=sua_senha_de_app
   ```
3. Reinicie o servidor

---

### Erro: "Connection timeout"

**Causa:** Firewall ou problemas de rede.

**Solução:**
1. Verifique sua conexão com a internet
2. Tente desativar VPN se estiver usando
3. Verifique se o firewall não está bloqueando portas SMTP

---

### Email chega na SPAM

**Causa:** Gmail pode considerar como spam por ser uma conta nova ou pouco usada.

**Solução:**
1. Marque o email como "Não é spam"
2. Adicione o remetente aos contatos
3. Aguarde algumas horas e teste novamente

---

## 🚀 Configuração em Produção (Railway)

### 1. Adicionar Variáveis de Ambiente

No Railway:
1. Acesse seu projeto
2. Vá em **Variables**
3. Adicione:
   - `EMAIL_USER` = `feiraceart@gmail.com`
   - `EMAIL_PASS` = `[senha de app de 16 caracteres]`

### 2. Redeploy

Após adicionar as variáveis, faça um redeploy:
- O Railway faz automaticamente quando você altera variáveis

### 3. Verificar Logs

No Railway:
1. Vá em **Deployments**
2. Clique no deployment ativo
3. Veja os logs em tempo real
4. Procure por:
   - `📧 Preparando envio de email`
   - `✅ Email enviado com sucesso`

---

## 📝 Checklist Final

Antes de considerar o problema resolvido, confirme:

- [ ] Verificação em 2 etapas está ATIVADA no Gmail
- [ ] Senha de app foi gerada corretamente
- [ ] Arquivo `.env` existe e está configurado
- [ ] `dotenv` está instalado (`npm install dotenv`)
- [ ] Server.js tem `require('dotenv').config()` no topo
- [ ] Script de teste (`node test-email.js`) funciona
- [ ] Logs do servidor mostram "Email enviado com sucesso"
- [ ] Email de teste chegou (verifique spam também)

---

## 🆘 Ainda não funciona?

Se após seguir todos os passos o email ainda não chega:

1. **Verifique a conta do Gmail:**
   - Faça login em feiraceart@gmail.com
   - Vá em Configurações → Encaminhamento e POP/IMAP
   - Certifique-se de que IMAP está ATIVADO

2. **Teste com outro serviço de email:**
   - Considere usar SendGrid ou Mailgun
   - Eles são mais confiáveis para produção

3. **Verifique limites do Gmail:**
   - Gmail tem limite de ~500 emails/dia para contas gratuitas
   - Se ultrapassou, aguarde 24h

4. **Entre em contato:**
   - Verifique se há algum bloqueio na conta do Gmail
   - Acesse: https://support.google.com/mail/
