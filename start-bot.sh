#!/bin/bash

echo "🚀 Iniciando Bot WhatsApp..."

# Carregar NVM se disponível
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Verificar se Node.js está disponível
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Execute: ./install.sh"
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Copiar config.env para .env se necessário
if [ ! -f ".env" ] && [ -f "config.env" ]; then
    cp config.env .env
    echo "📋 Arquivo .env criado a partir de config.env"
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado. Crie um arquivo .env com as configurações necessárias."
    exit 1
fi

echo "📱 Iniciando bot..."
echo "🔗 Para conectar:"
echo "1. Escaneie o QR Code que aparecerá abaixo"
echo "2. Use o WhatsApp Business da empresa (+5511914040120)"
echo "3. O bot criará o grupo 'VENDEDORES'"
echo "📞 Vendedores configurados:"
echo "   - +5569999465328"
echo "   - +5569999158790"
echo "⏹️  Para parar: Ctrl+C"
echo "=================================="

# Iniciar o bot
node src/server.js