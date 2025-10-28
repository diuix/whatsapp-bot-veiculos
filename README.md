# Bot WhatsApp - Sistema de Redirecionamento para Empresa de Veículos

## 🎯 Funcionalidades

- ✅ **Detecção automática** de mensagens de clientes
- ✅ **Notificação organizada** no grupo VENDEDORES com numeração
- ✅ **Sistema de "pegar conversa"** por número (`PEGAR 1`)
- ✅ **Links wa.me** para conversa direta vendedor-cliente
- ✅ **Mensagem explicativa** para cliente sobre atendimento
- ✅ **Múltiplas conversas** simultâneas organizadas
- ✅ **Monitoramento** via interface web

## 🚀 Instalação

```bash
# Instalar dependências
./install.sh

# Iniciar bot
./start-bot.sh
```

## 📱 Como Funciona

### 1. Cliente envia mensagem
- Cliente envia para: **+5511914040120**
- Bot detecta e notifica grupo "VENDEDORES" com número [#1]

### 2. Vendedor pega conversa
- Vendedor responde no grupo: `PEGAR 1`
- Bot confirma e gera link wa.me para conversa direta

### 3. Conversa direta
- Cliente recebe mensagem explicativa sobre atendimento
- Vendedor clica no link wa.me gerado
- Vendedor conversa diretamente com cliente (sem bot no meio)
- Cliente conversa diretamente com vendedor

## 🔧 Configuração

Edite o arquivo `config.env`:

```env
NOME_EMPRESA=AutoCenter XYZ
VENDEDORES=5569999465328@c.us,5569999158790@c.us
PORT=3000
```

## 📊 Monitoramento

- **Status**: http://localhost:3000
- **Conversas**: http://localhost:3000/conversas
- **Status detalhado**: http://localhost:3000/status

## 🎯 Fluxo Completo

1. **Cliente** → WhatsApp empresa → **Bot detecta**
2. **Bot** → Notifica grupo com número [#1] → **Vendedores veem**
3. **Vendedor** → `PEGAR 1` → **Bot processa**
4. **Cliente** → Recebe mensagem explicativa sobre atendimento
5. **Vendedor** → Recebe link wa.me para conversa direta
6. **Vendedor** → Clica no link → **Conversa direta com cliente**
7. **Conversa natural** entre vendedor e cliente

## 💡 Vantagens do Sistema

- ✅ **Sem bagunça** - Cada conversa tem número único
- ✅ **Conversas diretas** - Vendedor fala direto com cliente
- ✅ **Múltiplas conversas** - Vendedor pode pegar quantos quiser
- ✅ **Simples** - Apenas `PEGAR 1` e clicar no link
- ✅ **Organizado** - Sistema de numeração clara
- ✅ **Eficiente** - Sem bot no meio da conversa

## 📱 Exemplo Prático

**Grupo VENDEDORES:**
```
🤖 NOVA CONVERSA [#1]
👤 Cliente: Inez Piovezan
📞 Telefone: 556999884752
💬 Mensagem: Oi, vi um carro
⏰ 21:35:45

⚠️ Aguardando atendimento...

Para pegar esta conversa, responda:
"PEGAR 1"
```

**Após Diego pegar:**
```
✅ Diego Piovesan pegou a conversa [#1] - Inez Piovezan

📱 Clique no link abaixo para conversar diretamente:
https://wa.me/556999884752

💡 Você pode pegar quantas conversas quiser!
```

## ✅ Sistema Completo e Funcional!