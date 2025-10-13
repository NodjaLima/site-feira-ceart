#!/bin/bash

# Script para testar o projeto com a versão correta do Node.js

echo "🔧 Configurando ambiente de teste..."
echo ""

# Usar Node 22
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Ativar Node 22
nvm use 22

echo ""
echo "✅ Node.js $(node --version)"
echo "✅ NPM $(npm --version)"
echo ""

# Verificar se o backend está rodando
if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  Backend já está rodando na porta 3001"
else
    echo "🚀 Iniciando backend..."
    cd ceart-cms
    npm start &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
    sleep 3
fi

# Verificar se o frontend está rodando
if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  Frontend já está rodando na porta 5173"
else
    echo "🚀 Iniciando frontend..."
    cd ceart-app-frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
    sleep 3
fi

echo ""
echo "🎉 Servidores iniciados!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "⚙️  Admin Panel: http://localhost:3001/admin"
echo ""
echo "🔍 Acesse http://localhost:5173/galeria para testar as melhorias"
echo ""
echo "Press Ctrl+C para encerrar os servidores"
echo ""

# Manter o script rodando
wait
