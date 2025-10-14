#!/bin/bash

echo "🧪 TESTE DETALHADO DE EMAIL - RAILWAY"
echo "===================================="
echo ""

echo "⏰ $(date)"
echo "🌐 Testando: https://site-feira-ceart-production.up.railway.app"
echo ""

echo "📧 Enviando email de teste..."
response=$(curl --max-time 25 -s -w "HTTPCODE:%{http_code};TIME:%{time_total}" \
  -X POST https://site-feira-ceart-production.up.railway.app/api/contato/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Diagnóstico",
    "email": "diagnostico@example.com",
    "telefone": "11987654321",
    "mensagem": "Teste diagnóstico da configuração SMTP Railway - Porta 465"
  }')

# Extrair dados da resposta
body=$(echo "$response" | sed 's/HTTPCODE:.*$//')
httpcode=$(echo "$response" | sed 's/.*HTTPCODE://' | sed 's/;TIME:.*$//')
time=$(echo "$response" | sed 's/.*TIME://')

echo ""
echo "📋 RESULTADOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔢 Status HTTP: $httpcode"
echo "⏱️  Tempo Total: ${time}s"
echo "📨 Resposta: $body"
echo ""

# Análise do resultado
if [ "$httpcode" = "200" ]; then
    echo "✅ SUCESSO: Email enviado com sucesso!"
elif [ "$httpcode" = "500" ]; then
    echo "❌ ERRO 500: Falha interna do servidor"
    if (( $(echo "$time > 15.0" | bc -l) )); then
        echo "⚠️  DIAGNÓSTICO: Timeout SMTP (>15s) - Gmail lento no Railway"
        echo "💡 SUGESTÃO: Considerar SendGrid ou Mailgun"
    else
        echo "⚠️  DIAGNÓSTICO: Erro rápido - possível problema de configuração"
    fi
elif [ "$httpcode" = "000" ]; then
    echo "❌ TIMEOUT: Conexão expirou"
    echo "⚠️  DIAGNÓSTICO: Problema de conectividade de rede"
else
    echo "⚠️  Status inesperado: $httpcode"
fi

echo ""
echo "🏥 Para análise detalhada, verificar logs do Railway:"
echo "   https://railway.app/dashboard → seu-projeto → Logs"
echo ""