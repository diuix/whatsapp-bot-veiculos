const express = require('express');
const WhatsAppBot = require('./bot');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new WhatsAppBot();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Bot WhatsApp funcionando!',
        timestamp: new Date().toISOString(),
        empresa: process.env.NOME_EMPRESA
    });
});

app.get('/conversas', (req, res) => {
    res.json({
        conversasAtivas: Array.from(bot.conversasAtivas.entries()).map(([chatId, data]) => ({
            chatId,
            cliente: data.cliente,
            timestamp: data.timestamp,
            status: data.status,
            vendedor: data.vendedor || null
        })),
        conversasEncaminhadas: Array.from(bot.conversasEncaminhadas.entries()).map(([vendedorId, data]) => ({
            vendedorId,
            cliente: data.cliente,
            timestamp: data.timestamp
        }))
    });
});

app.get('/status', (req, res) => {
    res.json({
        bot: bot.client ? 'conectado' : 'desconectado',
        grupo: bot.grupoId ? 'configurado' : 'não configurado',
        conversasAtivas: bot.conversasAtivas.size,
        conversasEncaminhadas: bot.conversasEncaminhadas.size
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
});

bot.iniciar().catch(console.error);

process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando aplicação...');
    await bot.parar();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Encerrando aplicação...');
    await bot.parar();
    process.exit(0);
});