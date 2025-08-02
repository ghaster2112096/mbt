const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.MC_HOST || 'localhost',
  port: parseInt(process.env.MC_PORT) || 25565,
  username: process.env.MC_USERNAME || 'AFK_Bot'
});

bot.on('spawn', () => {
  console.log('✅ Бот подключился и живёт своей жизнью');

  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, Math.floor(Math.random() * 10000) + 5000);

  setInterval(() => {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    bot.look(yaw, pitch, true);
  }, Math.floor(Math.random() * 10000) + 7000);
});
