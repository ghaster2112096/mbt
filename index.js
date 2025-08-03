const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: '6i9b.sdlf.fun',
  port: 25565,
  username: 'UPTBeacon',
  version: '1.21.4' 
});

function startBotActions() {
  console.log('✅ Бот подключился и живёт своей жизнью');
  console.log('📍 Позиция: ' + JSON.stringify(bot.entity.position) + ', onGround: ' + bot.entity.onGround);

  // Выполнение команды /l dfm44-55 с задержкой 2 секунды
  setTimeout(() => {
    bot.chat('/l dfm44-55');
    console.log('🔑 Бот отправил команду /l dfm44-55');
  }, 2000);

  // Проверка, безопасно ли действовать
  function isSafeToAct() {
    const pos = bot.entity.position;
    const blockAbove = bot.blockAt(pos.offset(0, 2, 0));
    return bot.entity.onGround && (!blockAbove || !blockAbove.boundingBox) && !bot.isInWater && !bot.isInLava;
  }

  // Основной цикл активности (без чата)
  setInterval(() => {
    if (!isSafeToAct()) {
      bot.clearControlStates();
      console.log('⚠️ Бот не на земле, в воде, лаве или заблокирован: onGround=' + bot.entity.onGround);
      return;
    }

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
      }, 600 + Math.random() * 600); // 0.6–1.2 секунды
    } else {
      // Удар рукой
      bot.swingArm();
      console.log('👊 Бот махнул рукой');
    }
  }, Math.floor(Math.random() * 12000) + 13000); // 13–25 секунд

  // Плавные повороты камеры
  setInterval(() => {
    if (!isSafeToAct()) {
      console.log('⚠️ Бот не на земле или заблокирован, пропускаем поворот');
      return;
    }
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.3; // Плавный разброс
    const pitch = Math.max(-0.8, Math.min(0.8, bot.entity.pitch + (Math.random() - 0.5) * 0.2));
    bot.look(yaw, pitch, true);
    console.log('👀 Бот повернул голову: yaw=' + yaw.toFixed(2) + ', pitch=' + pitch.toFixed(2));
  }, Math.floor(Math.random() * 15000) + 15000); // 15–30 секунд

  // Длинные паузы
  setInterval(() => {
    bot.clearControlStates();
    console.log('⏸️ Бот остановился');
  }, Math.floor(Math.random() * 40000) + 30000); // 30–70 секунд
}

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
