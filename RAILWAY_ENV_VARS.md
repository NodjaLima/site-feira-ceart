# Variáveis de Ambiente para Railway

## COPIAR E COLAR NO RAILWAY:

### Configuração Principal (OBRIGATÓRIO):
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
MAIL_USERNAME=nodjamoama.lima@gmail.com
MAIL_PASSWORD=benh cmic jzuz sbcu
MAIL_FROM=nodjamoama.lima@gmail.com

### Configuração do Ambiente:
NODE_ENV=production
FRONTEND_URL=https://site-feira-ceart.vercel.app
PORT=3001

### Fallback (Compatibilidade):
EMAIL_USER=nodjamoama.lima@gmail.com
EMAIL_PASS=benh cmic jzuz sbcu

## INSTRUÇÕES:

1. Acesse o Railway Dashboard
2. Vá para o seu projeto
3. Clique em "Variables" 
4. Adicione cada variável acima (uma por vez)
5. Clique em "Deploy" ou aguarde o auto-deploy

## IMPORTANTE:
- Use EXATAMENTE os valores acima
- MAIL_PASSWORD deve ser a senha de app do Gmail (16 caracteres)
- Certifique-se de que todas as variáveis foram adicionadas
- O deploy acontece automaticamente após adicionar as variáveis

## Verificação:
Após adicionar, você pode testar com:
curl -X POST https://site-feira-ceart-production.up.railway.app/api/contato/enviar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@example.com","telefone":"11999999999","mensagem":"Teste Railway"}'