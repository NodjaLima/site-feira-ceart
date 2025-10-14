#!/bin/bash

echo "🧪 Testando API de produção..."

response=$(curl -s -w "%{http_code}" -X POST https://site-feira-ceart-production.up.railway.app/api/contato/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Produção",
    "email": "teste@example.com",
    "telefone": "(11) 99999-9999",
    "mensagem": "Testando envio em produção"
  }')

http_code="${response: -3}"
body="${response%???}"

echo "📊 Status Code: $http_code"
echo "📄 Response Body: $body"

if [ "$http_code" = "200" ]; then
  echo "✅ Sucesso!"
elif [ "$http_code" = "503" ]; then
  echo "⚠️ Serviço indisponível - provavelmente EMAIL_USER/EMAIL_PASS não configurados no Railway"
else
  echo "❌ Erro $http_code"
fi