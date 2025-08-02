const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: '6i9b.sdlf.fun',   
  port: 25565,                  
  username: 'UPTBeacon'
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
