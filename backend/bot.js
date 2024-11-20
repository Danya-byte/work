const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');

const AMBASSADORS = ["backend_creator"];

const token = '8102571059:AAHLHrmuq3Dmu7rtEIKNn0PNPu07UeYnCTU';
const bot = new TelegramBot(token, { polling: true });

// Настройки подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'greenwoods',
  password: 'Dkflbvbhjdbx76',
  port: 5432,
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const telegram_id = msg.from.id;

  try {
    // Проверка наличия пользователя в базе данных
    const checkUserQuery = 'SELECT position, referral_number FROM participants WHERE username = $1 OR telegram_id = $2';
    const checkUserResult = await pool.query(checkUserQuery, [username, telegram_id]);
    const { position, referral_number } = checkUserResult.rows[0] || { position: null, referral_number: null };

    // Сохранение состояния пользователя в файл
    const userState = {
      username,
      position: position !== null,
      referralNumber: referral_number,
      isAmbassador: AMBASSADORS.includes(username)
    };
    fs.writeFileSync(path.join(__dirname, 'userState.json'), JSON.stringify(userState));

    if (position !== null) {
      bot.sendMessage(chatId, `Welcome back! You are at position ${position}.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Join', web_app: { url: 'https://work-2-tau.vercel.app' } }]
          ]
        }
      });
    } else {
      bot.sendMessage(chatId, 'Welcome! Please complete the following steps to join:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Join', web_app: { url: 'https://work-2-tau.vercel.app' } }]
          ]
        }
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});
