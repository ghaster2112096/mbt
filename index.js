const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Пинг-сервер для Render
app.get('/ping', (req, res) => {
  res.send('UPTBeacon is alive! 😎');
});
app.listen(PORT, () => {
  console.log(`🌐 Пинг-сервер запущен на порту ${PORT}`);
});

// Создание бота
let bot = mineflayer.createBot({
  host: '6i9b.sdlf.fun',
  port: 25565,
  username: 'UPTBeacon',
  version: '1.21.4'
});

// Запуск действий
function startBotActions() {
  console.log('✅ Бот подключился и живёт своей жизнью');
  console.log('📍 Позиция: ' + JSON.stringify(bot.entity.position));

  setTimeout(() => {
    bot.chat('/l dfm44-55');
    console.log('🔑 Бот отправил команду /l dfm44-55');
  }, 2000);

  // Активность
  setInterval(() => {
    const action = Math.random();
    if (action < 0.5) {
      bot.swingArm();
      console.log('👊 Бот махнул рукой');
    } else {
      const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.3;
      const pitch = Math.max(-0.8, Math.min(0.8, bot.entity.pitch + (Math.random() - 0.5) * 0.2));
      bot.look(yaw, pitch, true);
      console.log('👀 Бот повернул голову: yaw=' + yaw.toFixed(2) + ', pitch=' + pitch.toFixed(2));
    }
  }, Math.floor(Math.random() * 5000) + 5000);

  // Паузы
  setInterval(() => {
    bot.clearControlStates();
    console.log('⏸️ Бот остановился');
  }, Math.floor(Math.random() * 15000) + 15000);
}

// При спавне — начинаем действия
bot.on('spawn', startBotActions);

// Повторная авторизация, если бот выкинуло
bot.on('message', (message) => {
  const text = message.toString();
  if (text.includes('Incorrect password') || text.includes('Login timeout')) {
    console.log('❌ Ошибка входа, повторяем /l dfm44-55');
    setTimeout(() => bot.chat('/l dfm44-55'), 2000);
  }
});

// Авто-реконнект
bot.on('end', () => {
  console.log('🔌 Бот отключился, пытаемся переподключиться...');
  setTimeout(() => {
    bot.quit();
    bot = mineflayer.createBot({
      host: '6i9b.sdlf.fun',
      port: 25565,
      username: 'UPTBeacon',
      version: '1.21.4'
    });
    bot.on('spawn', startBotActions);
    bot.on('end', bot.on('end'));
    bot.on('message', (message) => {
      const text = message.toString();
      if (text.includes('Incorrect password') || text.includes('Login timeout')) {
        console.log('❌ Ошибка входа, повторяем /l dfm44-55');
        setTimeout(() => bot.chat('/l dfm44-55'), 2000);
      }
    });
  }, 5000);
});
