#!/bin/bash

echo "🚀 Instalando dependências do Bot WhatsApp..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando..."
    
    # Instalar Node.js via NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Carregar NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Instalar Node.js LTS
    nvm install --lts
    nvm use --lts
fi

echo "✅ Node.js $(node --version) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo "✅ Instalação concluída!"
echo ""
echo "📱 Para iniciar o bot:"
echo "   ./start-bot.sh"
echo ""
echo "🔧 Para configurar:"
echo "   Edite o arquivo config.env com os dados da empresa"