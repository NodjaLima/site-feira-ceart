#!/bin/bash

echo "🧪 Teste rápido da API de produção..."

# Teste com timeout de 10 segundos
echo "⏱️  Teste com timeout de 10s:"
curl --max-time 10 -X POST https://site-feira-ceart-production.up.railway.app/api/contato/enviar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste 10s","email":"teste@example.com","telefone":"11999999999","mensagem":"Teste timeout 10s"}' \
  -w "\nTempo: %{time_total}s | Status: %{http_code}\n" \
  --silent --show-error

echo -e "\n" && sleep 2

# Teste com timeout de 20 segundos  
echo "⏱️  Teste com timeout de 20s:"
curl --max-time 20 -X POST https://site-feira-ceart-production.up.railway.app/api/contato/enviar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste 20s","email":"teste@example.com","telefone":"11999999999","mensagem":"Teste timeout 20s"}' \
  -w "\nTempo: %{time_total}s | Status: %{http_code}\n" \
  --silent --show-error

echo -e "\n✅ Testes concluídos"
