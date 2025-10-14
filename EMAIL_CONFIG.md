# Configuração de Envio de Emails

Este guia explica como configurar o sistema de envio de emails do formulário de contato.

## 📧 Funcionalidade

Quando um visitante preenche o formulário de contato no site, um email é enviado automaticamente para o **email configurado no CMS** (campo `site_email` nas configurações) com as seguintes informações:

- Nome do visitante
- Email do visitante
- Telefone do visitante
- Mensagem (opcional)

**Nota:** O email de destino é dinâmico e pode ser alterado no painel admin do CMS, na seção de Configurações. Se não houver email configurado no CMS, o sistema usa o email padrão definido na variável de ambiente `EMAIL_USER`.

## 🔧 Configuração

### 1. Criar Senha de App do Gmail

Como o Gmail exige autenticação de dois fatores para aplicativos, você precisa gerar uma **Senha de App**:

1. Acesse sua conta do Gmail (feiraceart@gmail.com)
2. Vá para: **Conta do Google** → **Segurança**
3. Certifique-se de que a **Verificação em duas etapas** está ativada
4. Procure por **Senhas de app** (App Passwords)
5. Selecione **Outro (nome personalizado)** e digite: `Site Feira CEART`
6. Clique em **Gerar**
7. **Copie a senha gerada** (16 caracteres sem espaços)

### 2. Configurar Variáveis de Ambiente

#### Desenvolvimento Local

Crie um arquivo `.env` na pasta `ceart-cms/` com:

```bash
EMAIL_USER=feiraceart@gmail.com
EMAIL_PASS=sua_senha_de_app_aqui
```

#### Produção (Railway)

1. Acesse o projeto no Railway
2. Vá em **Variables**
3. Adicione as seguintes variáveis:
   - `EMAIL_USER` = `feiraceart@gmail.com`
   - `EMAIL_PASS` = `sua_senha_de_app_de_16_caracteres`

### 3. Testar Localmente

```bash
cd ceart-cms
npm start
```

Em outro terminal:
```bash
cd ceart-app-frontend
npm run dev
```

Acesse `http://localhost:5173/contato` e teste o formulário.

## 📋 Formato do Email

O email enviado tem o seguinte formato:

```
Assunto: 📧 Novo contato do site - [Nome do Visitante]

Conteúdo:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Novo Contato do Site

Nome: João da Silva
Email: joao@example.com
Telefone: (11) 99999-9999
Mensagem: 
Gostaria de participar da próxima feira...
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este email foi enviado automaticamente através do formulário de contato do site Feira CEART.
```

## 🔍 Debugging

Se o email não está sendo enviado:

1. **Verifique os logs do servidor:**
   - Deve aparecer: `📧 Email enviado com sucesso de [Nome] ([email])`
   - Se houver erro, aparecerá: `❌ Erro ao enviar email:`

2. **Verifique as credenciais:**
   - Confirme que `EMAIL_USER` e `EMAIL_PASS` estão corretos
   - A senha deve ser a **Senha de App**, não a senha normal do Gmail

3. **Verifique a conta do Gmail:**
   - Certifique-se de que a verificação em duas etapas está ativada
   - Confirme que a Senha de App foi gerada corretamente

4. **Teste a API diretamente:**
   ```bash
   curl -X POST http://localhost:3001/api/contato/enviar \
     -H "Content-Type: application/json" \
     -d '{
       "nome": "Teste",
       "email": "teste@example.com",
       "telefone": "(11) 99999-9999",
       "mensagem": "Mensagem de teste"
     }'
   ```

## 🚀 Deploy

Após fazer o deploy no Railway:

1. Configure as variáveis `EMAIL_USER` e `EMAIL_PASS`
2. Faça um redeploy do backend
3. Teste o formulário no site em produção

## 🔒 Segurança

- **NUNCA** commite o arquivo `.env` com credenciais reais
- Use sempre **Senhas de App**, nunca a senha principal da conta
- As senhas de app podem ser revogadas a qualquer momento
- Mantenha o arquivo `.env.example` atualizado (sem credenciais reais)

## 📝 Notas

- O email de resposta (Reply-To) é configurado automaticamente para o email do visitante
- Mensagens de sucesso/erro são exibidas no formulário
- O formulário é limpo automaticamente após envio bem-sucedido
- Feedback visual durante o envio (botão desabilitado, texto "ENVIANDO...")
