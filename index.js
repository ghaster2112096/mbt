const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Пинг-endpoint для Render
app.get('/ping', (req, res) => {
  res.send('UPTBeacon is alive! 😎');
});
app.listen(PORT, () => {
  console.log(`🌐 Сервер пинга работает на порту ${PORT}`);
});

const bot = mineflayer.createBot({
  host: '6i9b.sdlf.fun',
  port: 25565,
  username: 'UPTBeacon',
  version: '1.20.1' // Укажи версию сервера (1.20–1.21.7)
});

function startBotActions() {
  console.log('✅ Бот подключился и живёт своей жизнью');
  console.log('📍 Позиция: ' + JSON.stringify(bot.entity.position));

  // Выполнение команды /l dfm44-55
  setTimeout(() => {
    bot.chat('/l dfm44-55');
    console.log('🔑 Бот отправил команду /l dfm44-55');
  }, 2000);

  // Основной цикл активности
  setInterval(() => {
    const action = Math.random();
    if (action < 0.3) {
      // Прыжок
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
        console.log('⬆️ Бот прыгнул');
      }, 600);
    } else if (action < 0.7) {
      // Движение
      const move = ['forward', 'back', 'left', 'right'][Math.floor(Math.random() * 4)];
      bot.setControlState(move, true);
      setTimeout(() => {
        bot.setControlState(move, false);
        console.log('🚶 Бот двинулся: ' + move);
      }, 500 + Math.random() * 500); // 0.5–1 секунда
    } else {
      // Удар рукой
      bot.swingArm();
      console.log('👊 Бот махнул рукой');
    }
  }, Math.floor(Math.random() * 5000) + 5000); // 5–10 секунд

  // Плавные повороты камеры
  setInterval(() => {
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.3; // Плавный разброс
    const pitch = Math.max(-0.8, Math.min(0.8, bot.entity.pitch + (Math.random() - 0.5) * 0.2));
    bot.look(yaw, pitch, true);
    console.log('👀 Бот повернул голову: yaw=' + yaw.toFixed(2) + ', pitch=' + pitch.toFixed(2));
  }, Math.floor(Math.random() * 6000) + 6000); // 6–12 секунд

  // Паузы
  setInterval(() => {
    bot.clearControlStates();
    console.log('⏸️ Бот остановился');
  }, Math.floor(Math.random() * 15000) + 15000); // 15–30 секунд
});

// Старт действий при спавне
bot.on('spawn', startBotActions);

// Авто-реконнект
bot.on('end', () => {
  console.log('🔌 Бот отключился, пытаемся переподключиться...');
  setTimeout(() => {
    bot.quit();
    const newBot = mineflayer.createBot({
      host: '6i9b.sdlf.fun',
      port: 25565,
      username: 'UPTBeacon',
      version: '1.20.1' // Укажи версию сервера
    });
    newBot.on('spawn', startBotActions);
    newBot.on('end', bot.on('end'));
    newBot.on('message', bot.on('message'));
    bot = newBot;
  }, 5000);
});

// Обработка ошибок входа
bot.on('message', (message) => {
  const text = message.toString();
  if (text.includes('Incorrect password') || text.includes('Login timeout')) {
    console.log('❌ Ошибка входа, повторяем /l dfm44-55');
    setTimeout(() => bot.chat('/l dfm44-55'), 2000);
  }
});
