const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: '6i9b.sdlf.fun',
  port: 25565,
  username: 'UPTBeacon'
});

function startBotActions() {
  console.log('✅ Бот подключился и живёт своей жизнью');

  // Выполнение команды /l dfm44-55 с задержкой 1.5 секунды
  setTimeout(() => {
    bot.chat('/l dfm44-55');
    console.log('🔑 Бот отправил команду /l dfm44-55');
  }, 1500);

  // Основной цикл активности с имитацией игрока
  setInterval(() => {
    const action = Math.random();
    if (action < 0.3) {
      // Прыжок
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
        console.log('⬆️ Бот прыгнул');
      }, 600);
    } else if (action < 0.6) {
      // Движение
      const move = ['forward', 'back', 'left', 'right'][Math.floor(Math.random() * 4)];
      bot.setControlState(move, true);
      setTimeout(() => {
        bot.setControlState(move, false);
        console.log('🚶 Бот двинулся: ' + move);
      }, 1000 + Math.random() * 1000); // 1–2 секунды
    } else {
      // Случайный удар по воздуху
      bot.swingArm();
      console.log('👊 Бот махнул рукой');
    }
  }, Math.floor(Math.random() * 8000) + 6000); // 6–14 секунд

  // Плавные повороты камеры
  setInterval(() => {
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.6; // Умеренный разброс
    const pitch = Math.max(-1.2, Math.min(1.2, bot.entity.pitch + (Math.random() - 0.5) * 0.4));
    bot.look(yaw, pitch, true);
    console.log('👀 Бот повернул голову: yaw=' + yaw.toFixed(2) + ', pitch=' + pitch.toFixed(2));
  }, Math.floor(Math.random() * 10000) + 8000); // 8–18 секунд

  // Случайные остановки для естественности
  setInterval(() => {
    bot.clearControlStates();
    console.log('⏸️ Бот остановился');
  }, Math.floor(Math.random() * 20000) + 15000); // 15–35 секунд
}

// Старт действий при спавне
bot.on('spawn', startBotActions);

// Авто-реконнект при дисконнекте
bot.on('end', () => {
  console.log('🔌 Бот отключился, пытаемся переподключиться...');
  setTimeout(() => {
    bot.quit();
    const newBot = mineflayer.createBot({
      host: '6i9b.sdlf.fun',
      port: 25565,
      username: 'UPTBeacon'
    });
    newBot.on('spawn', startBotActions);
    newBot.on('end', bot.on('end')); // Повторяем реконнект
    bot = newBot; // Обновляем ссылку
  }, 5000); // Задержка 5 секунд
});

// Обработка ошибок входа
bot.on('message', (message) => {
  const text = message.toString();
  if (text.includes('Incorrect password') || text.includes('Login timeout')) {
    console.log('❌ Ошибка входа, повторяем /l dfm44-55');
    setTimeout(() => bot.chat('/l dfm44-55'), 1500);
  }
});
