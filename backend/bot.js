const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Токен вашего бота
const token = '8102571059:AAHLHrmuq3Dmu7rtEIKNn0PNPu07UeYnCTU';

// Создание экземпляра бота
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Проверка, находится ли пользователь в базе данных
    const response = await axios.post('http://localhost:3000/api/check-user', { telegram_id: userId });
    const position = response.data.position;
    const referralNumber = response.data.referral_number;

    if (position) {
      // Пользователь уже находится в базе данных
      bot.sendMessage(chatId, `Welcome back! You are at position ${position}.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open Mini App', url: 'https://work-2-tau.vercel.app/' }]
          ]
        }
      });
    } else {
      // Пользователь не находится в базе данных
      bot.sendMessage(chatId, 'Welcome! Please join our community.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open Mini App', url: 'https://work-2-tau.vercel.app/' }]
          ]
        }
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});

// Обработка нажатия на кнопку в мини-приложении
bot.on('callback_query', async (query) => {
  const userId = query.from.id;

  try {
    // Проверка, находится ли пользователь в базе данных
    const response = await axios.post('http://localhost:3000/api/check-user', { telegram_id: userId });
    const position = response.data.position;
    const referralNumber = response.data.referral_number;

    if (position) {
      // Пользователь уже находится в базе данных
      bot.answerCallbackQuery(query.id, {
        text: `You are at position ${position}. Your referral link: https://t.me/Greenwoods_Community?start=${referralNumber}`
      });
    } else {
      // Пользователь не находится в базе данных
      bot.answerCallbackQuery(query.id, {
        text: 'You are not registered yet. Please complete the registration process.'
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.answerCallbackQuery(query.id, {
      text: 'An error occurred while processing your request.'
    });
  }
});
