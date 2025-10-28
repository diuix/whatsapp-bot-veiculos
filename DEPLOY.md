# 🚀 Deploy no Railway - Instruções

## 📋 Passo a Passo:

### 1. Criar Repositório no GitHub
1. Acesse: https://github.com
2. Clique em "New repository"
3. Nome: `whatsapp-bot-veiculos`
4. Marque "Public"
5. Clique "Create repository"

### 2. Enviar Código para GitHub
```bash
# No terminal, dentro da pasta do projeto:
git init
git add .
git commit -m "Bot WhatsApp para empresa de veículos"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/whatsapp-bot-veiculos.git
git push -u origin main
```

### 3. Deploy no Railway
1. Acesse: https://railway.app
2. Clique "Login" → "Login with GitHub"
3. Clique "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório `whatsapp-bot-veiculos`
6. Clique "Deploy Now"

### 4. Configurar Variáveis de Ambiente
1. No Railway, clique no projeto
2. Vá em "Variables"
3. Adicione:
   - `NOME_EMPRESA` = `AutoCenter XYZ`
   - `VENDEDORES` = `5569999465328@c.us,5569999158790@c.us`
   - `NODE_ENV` = `production`

### 5. Escanear QR Code
1. Vá em "Deployments" → "View Logs"
2. Procure por "📱 Escaneie o QR Code"
3. Escaneie com WhatsApp Business (+5511914040120)
4. Bot estará funcionando!

## ✅ Pronto!
O bot estará online 24/7 gratuitamente no Railway!
