const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

class WhatsAppBot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });
        
        this.grupoId = null;
        this.conversasAtivas = new Map();
        this.conversasEncaminhadas = new Map();
        this.proximoNumero = 1;
        
        this.setupEvents();
    }

    setupEvents() {
        this.client.on('qr', (qr) => {
            console.log('📱 Escaneie o QR Code com seu WhatsApp Business:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('✅ Bot WhatsApp conectado!');
            this.setupGrupo();
        });

        this.client.on('message', async (message) => {
            await this.processarMensagem(message);
        });

        this.client.on('disconnected', (reason) => {
            console.log('❌ Bot desconectado:', reason);
        });
    }

    async setupGrupo() {
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const grupos = await this.client.getChats();
            const grupo = grupos.find(g => g.name === 'VENDEDORES');
            
            if (grupo) {
                this.grupoId = grupo.id._serialized || grupo.id;
                console.log('✅ Grupo VENDEDORES encontrado:', this.grupoId);
                
                // Enviar mensagem de teste
                await this.client.sendMessage(this.grupoId, '🤖 Bot configurado e funcionando!');
            } else {
                console.log('❌ Grupo VENDEDORES não encontrado');
            }
        } catch (error) {
            console.error('❌ Erro ao configurar grupo:', error);
        }
    }

    async processarMensagem(message) {
        try {
            if (message.fromMe) return;
            
            const textoMensagem = message.body || 'Mensagem sem texto';
            
            // Se é mensagem do grupo de vendedores
            if (message.from.includes('@g.us') && message.from === this.grupoId) {
                await this.processarMensagemGrupo(message);
                return;
            }
            
            // Se é mensagem de cliente individual
            if (!message.from.includes('@g.us')) {
                await this.processarMensagemCliente(message);
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
        }
    }

    async processarMensagemCliente(message) {
        const chatId = message.from;
        const clienteNome = await this.obterNomeCliente(chatId);
        const textoMensagem = message.body || 'Mensagem sem texto';
        
        // Ignorar mensagens muito antigas (mais de 5 minutos)
        const agora = new Date();
        const timestampMensagem = new Date(message.timestamp * 1000);
        const diferencaMinutos = (agora - timestampMensagem) / (1000 * 60);
        
        if (diferencaMinutos > 5) {
            console.log(`⏰ Ignorando mensagem antiga de ${clienteNome} (${diferencaMinutos.toFixed(1)} min atrás)`);
            return;
        }
        
        console.log(`📨 Mensagem de ${clienteNome}: "${textoMensagem}"`);
        
        // Verificar se é nova conversa ou conversa encerrada
        if (!this.conversasAtivas.has(chatId) || this.conversasAtivas.get(chatId).status === 'encerrada') {
            await this.notificarNovaConversa(chatId, clienteNome, textoMensagem);
        } else {
            // Atualizar última mensagem da conversa existente
            const conversa = this.conversasAtivas.get(chatId);
            conversa.ultimaMensagem = textoMensagem;
            conversa.timestamp = new Date();
            
            // Se já foi atendida, notificar apenas no grupo
            if (conversa.status === 'atendida' && conversa.vendedorId) {
                const vendedorNome = conversa.vendedor;
                await this.client.sendMessage(this.grupoId, 
                    `📨 [#${conversa.numero}] ${conversa.cliente} respondeu: "${textoMensagem}"`
                );
                console.log(`📨 [#${conversa.numero}] ${conversa.cliente} respondeu para ${vendedorNome}: "${textoMensagem}"`);
            }
        }
    }

    async notificarNovaConversa(chatId, clienteNome, mensagem) {
        try {
            if (!this.grupoId) {
                console.log('❌ Grupo não configurado');
                return;
            }

            const timestamp = new Date().toLocaleTimeString('pt-BR');
            const numeroCliente = chatId.replace('@c.us', '');
            const numeroConversa = this.proximoNumero++;
            
            const notificacao = `🤖 NOVA CONVERSA [#${numeroConversa}]
👤 Cliente: ${clienteNome}
📞 Telefone: ${numeroCliente}
💬 Mensagem: ${mensagem}
⏰ ${timestamp}

⚠️ Aguardando atendimento...

Para pegar esta conversa, responda:
"PEGAR ${numeroConversa}"

Para encerrar uma conversa ativa, responda:
"ENCERRAR [número]"`;

            await this.client.sendMessage(this.grupoId, notificacao);
            
            // Marcar como conversa ativa
            this.conversasAtivas.set(chatId, {
                cliente: clienteNome,
                timestamp: new Date(),
                status: 'aguardando',
                ultimaMensagem: mensagem,
                numero: numeroConversa
            });
            
            console.log(`✅ Notificação enviada para grupo - Conversa #${numeroConversa}`);
            
        } catch (error) {
            console.error('❌ Erro ao notificar:', error);
        }
    }

    async processarMensagemGrupo(message) {
        try {
            const textoMensagem = message.body.toUpperCase();
            
            // Verificar se é clique em botão
            if (message.hasQuotedMsg && message._data.quotedMsg) {
                const quotedMsg = await message.getQuotedMessage();
                if (quotedMsg.body.includes('NOVA CONVERSA')) {
                    // Extrair número da conversa do texto
                    const match = quotedMsg.body.match(/\[#(\d+)\]/);
                    if (match) {
                        const numeroConversa = parseInt(match[1]);
                        await this.processarPegarConversa(message, numeroConversa);
                        return;
                    }
                }
            }
            
            // Processar comando manual (fallback)
            if (textoMensagem.startsWith('PEGAR ')) {
                const numeroConversa = parseInt(textoMensagem.replace('PEGAR ', '').trim());
                await this.processarPegarConversa(message, numeroConversa);
            } else if (textoMensagem.startsWith('ENCERRAR ')) {
                const numeroConversa = parseInt(textoMensagem.replace('ENCERRAR ', '').trim());
                await this.processarEncerrarConversa(message, numeroConversa);
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar mensagem do grupo:', error);
        }
    }

    async processarPegarConversa(message, numeroConversa) {
        try {
            // Buscar conversa pelo número
            let conversaEncontrada = null;
            let chatIdEncontrado = null;
            
            for (const [chatId, conversa] of this.conversasAtivas.entries()) {
                if (conversa.numero === numeroConversa && conversa.status === 'aguardando') {
                    conversaEncontrada = conversa;
                    chatIdEncontrado = chatId;
                    break;
                }
            }
            
            if (conversaEncontrada) {
                const vendedorNome = await this.obterNomeCliente(message.author);
                const vendedorId = message.author;
                
                // Atualizar status
                conversaEncontrada.status = 'atendida';
                conversaEncontrada.vendedor = vendedorNome;
                conversaEncontrada.vendedorId = vendedorId;
                
                // Enviar mensagem para o cliente
                await this.client.sendMessage(chatIdEncontrado, 
                    `Olá! Meu nome é ${vendedorNome} e vou te atender agora.

📱 Em instantes você receberá uma mensagem direta do meu WhatsApp pessoal para continuarmos nossa conversa.

💬 Aguarde um momento que já estou preparando seu atendimento!`
                );
                
                // Configurar encaminhamento
                this.conversasEncaminhadas.set(vendedorId, {
                    chatIdCliente: chatIdEncontrado,
                    cliente: conversaEncontrada.cliente,
                    timestamp: new Date(),
                    numero: conversaEncontrada.numero
                });
                
                // Gerar link wa.me para conversa direta
                const numeroCliente = chatIdEncontrado.replace('@c.us', '');
                const linkConversa = `https://wa.me/${numeroCliente}`;
                
                // Notificar no grupo principal
                await this.client.sendMessage(this.grupoId, 
                    `✅ ${vendedorNome} pegou a conversa [#${conversaEncontrada.numero}] - ${conversaEncontrada.cliente}
                    
📱 Clique no link abaixo para conversar diretamente:
${linkConversa}

💡 Você pode pegar quantas conversas quiser!`
                );
                
                console.log(`✅ ${vendedorNome} pegou a conversa [#${conversaEncontrada.numero}] - ${conversaEncontrada.cliente}`);
            } else {
                // Mostrar conversas ativas para ajudar
                const conversasAtivas = Array.from(this.conversasAtivas.entries())
                    .filter(([_, conversa]) => conversa.status === 'aguardando')
                    .map(([chatId, conversa]) => 
                        `• [#${conversa.numero}] ${conversa.cliente} (${chatId.replace('@c.us', '')})`
                    ).join('\n');
                
                await this.client.sendMessage(this.grupoId, 
                    `❌ Conversa #${numeroConversa} não encontrada\n\n` +
                    `📋 Conversas ativas:\n${conversasAtivas}\n\n` +
                    `💡 Use: PEGAR [número] ou clique no botão`
                );
            }
        } catch (error) {
            console.error('❌ Erro ao processar pegar conversa:', error);
        }
    }

    async processarEncerrarConversa(message, numeroConversa) {
        try {
            // Buscar conversa pelo número
            let conversaEncontrada = null;
            let chatIdEncontrado = null;
            
            for (const [chatId, conversa] of this.conversasAtivas.entries()) {
                if (conversa.numero === numeroConversa && conversa.status === 'atendida') {
                    conversaEncontrada = conversa;
                    chatIdEncontrado = chatId;
                    break;
                }
            }
            
            if (conversaEncontrada) {
                const vendedorNome = await this.obterNomeCliente(message.author);
                
                // Marcar como encerrada
                conversaEncontrada.status = 'encerrada';
                conversaEncontrada.timestampEncerramento = new Date();
                
                // Remover da lista de conversas encaminhadas
                this.conversasEncaminhadas.delete(conversaEncontrada.vendedorId);
                
                // Enviar mensagem de despedida para o cliente
                await this.client.sendMessage(chatIdEncontrado, 
                    `Obrigado pelo contato! Se precisar de mais alguma coisa, estamos aqui para ajudar.`
                );
                
                // Notificar no grupo
                await this.client.sendMessage(this.grupoId, 
                    `🔚 ${vendedorNome} encerrou a conversa [#${conversaEncontrada.numero}] com ${conversaEncontrada.cliente}`
                );
                
                console.log(`🔚 ${vendedorNome} encerrou a conversa [#${conversaEncontrada.numero}] com ${conversaEncontrada.cliente}`);
            } else {
                // Mostrar conversas ativas para ajudar
                const conversasAtivas = Array.from(this.conversasAtivas.entries())
                    .filter(([_, conversa]) => conversa.status === 'atendida')
                    .map(([chatId, conversa]) => 
                        `• [#${conversa.numero}] ${conversa.cliente} (${chatId.replace('@c.us', '')})`
                    ).join('\n');
                
                await this.client.sendMessage(this.grupoId, 
                    `❌ Conversa #${numeroConversa} não encontrada ou não está sendo atendida\n\n` +
                    `📋 Conversas ativas (sendo atendidas):\n${conversasAtivas}\n\n` +
                    `💡 Use: ENCERRAR [número]`
                );
            }
        } catch (error) {
            console.error('❌ Erro ao processar encerrar conversa:', error);
        }
    }

    async obterNomeCliente(chatId) {
        try {
            const contact = await this.client.getContactById(chatId);
            return contact.pushname || contact.name || 'Cliente';
        } catch (error) {
            return 'Cliente';
        }
    }

    async iniciar() {
        console.log('🚀 Iniciando bot WhatsApp...');
        await this.client.initialize();
    }

    async parar() {
        console.log('🛑 Parando bot...');
        await this.client.destroy();
    }
}

module.exports = WhatsAppBot;