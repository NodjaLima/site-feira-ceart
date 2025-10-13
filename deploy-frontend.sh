#!/bin/bash

# Script de Deploy do Frontend para Vercel
# Uso: ./deploy-frontend.sh

set -e

echo "🚀 Deploy do Frontend para Vercel"
echo "=================================="

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "ceart-app-frontend" ]; then
    echo -e "${RED}❌ Erro: Diretório ceart-app-frontend não encontrado!${NC}"
    echo "Execute este script a partir da raiz do projeto."
    exit 1
fi

# Garantir que está usando a versão correta do Node
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    echo -e "${YELLOW}🔧 Carregando NVM...${NC}"
    source "$HOME/.nvm/nvm.sh"
    nvm use 22 2>/dev/null || nvm use default
    echo -e "${GREEN}✅ Node $(node -v)${NC}"
fi

# Entrar no diretório do frontend
cd ceart-app-frontend

echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install

echo -e "${YELLOW}🔨 Buildando projeto...${NC}"
npm run build

echo -e "${YELLOW}☁️  Fazendo deploy para Vercel...${NC}"
vercel --prod

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo -e "🌐 Acesse: ${YELLOW}https://ceart-app-frontend.vercel.app${NC}"
echo ""
