#!/bin/bash

# Script de instalação do Node.js usando NVM (sem sudo)
echo "🚀 Instalando Node.js via NVM..."

# Instalar NVM
echo "📦 Instalando NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Carregar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Instalar Node.js LTS
echo "📦 Instalando Node.js LTS..."
nvm install --lts
nvm use --lts

# Verificar instalação
echo "✅ Verificando instalação..."
node --version
npm --version

# Instalar dependências do projeto
echo "📦 Instalando dependências do projeto..."
cd /home/dlpiovesan/Documentos/robotics-app
npm install

echo "🎉 Instalação concluída!"
echo "📱 Para executar o bot, use: npm start"






