const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: '6i9b.sdlf.fun',
  port: 25565,
  username: 'UPTBeacon'
});

bot.on('spawn', () => {
  console.log('✅ Бот подключился и живёт своей жизнью');

  // Выполнение команды /l dfm44-55 с задержкой 1 секунда
  setTimeout(() => {
    bot.chat('/l dfm44-55');
    console.log('🔑 Бот отправил команду /l dfm44-55');
  }, 1000);

  // Прыжки
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 600);
  }, Math.floor(Math.random() * 10000) + 5000); // 5–15 секунд

  // Повороты камеры
  setInterval(() => {
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.3;
    const pitch = Math.max(-1.5, Math.min(1.5, bot.entity.pitch + (Math.random() - 0.5) * 0.2));
    bot.look(yaw, pitch, true);
  }, Math.floor(Math.random() * 13000) + 7000); // 7–20 секунд

  // Случайное движение
  setInterval(() => {
    const move = ['forward', 'back', 'left', 'right'][Math.floor(Math.random() * 4)];
    bot.setControlState(move, true);
    setTimeout(() => bot.setControlState(move, false), 800);
  }, Math.floor(Math.random() * 15000) + 10000); // 10–25 секунд
});
