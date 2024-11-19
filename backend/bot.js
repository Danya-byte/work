const AMBASSADORS = ["kata1ana", "fulminatrex", "notlistinq", "balushka23",
               "SBTech_youtube", "Nik7102", "cryptohood_adv",
               "greenchtg", "Igor6i9", "LaLiPaP26", "eeeeergoo",
               "inside_cripto_pro", "msm031", "Kvar16", "nastushkaE17",
               "hc_tlg",
               "vilyam_tim",
               "AlexShamps",
               "Skilful221", "Izzzzznanka", "cooper_ad", "rstmcrew",
               "tropirich", "MR_FRIKOP", "E_E_E_NEON","makcum52","#",
               "oleksandr_567", "Homiakk2", "Aleksei_jdi", "pavelinvest",
              "Natashkacrypto", "sashaarmy20","aB_Var_666_999", "Floopi_STG",
             "VenusTraidingPro", "Artgog777", "reshe_tov", "ilyu4ik", "jam_qq", "sepata",
           "fuelghoir" ];

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Токен вашего Telegram-бота
const token = '8102571059:AAHLHrmuq3Dmu7rtEIKNn0PNPu07UeYnCTU';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const telegram_id = msg.from.id;

  try {
    const response = await axios.post('http://localhost:3000/api/check-user', { username, telegram_id });
    const { position, referral_number } = response.data;

    // Сохранение состояния пользователя в локальном хранилище
    const userState = {
      position: position !== null,
      referralNumber: referral_number,
      isAmbassador: AMBASSADORS.includes(username)
    };
    localStorage.setItem('userState', JSON.stringify(userState));

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
