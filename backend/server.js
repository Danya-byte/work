const express = require('express');
const cors = require('cors');
const supabase = require('./supabase'); // Импортируем подключение к Supabase
const fs = require('fs');
const path = require('path');
const winston = require('winston'); // Добавляем библиотеку для логирования

const app = express();
const port = process.env.PORT || 3000;

// Настройка CORS для разрешения запросов с любого домена
app.use(cors());
app.use(express.json());

// Настройка логирования с использованием Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Логирование всех запросов
app.use((req, res, next) => {
  const { method, url, query, body } = req;
  const logMessage = `Incoming request: ${method} ${url} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`;
  logger.info(logMessage);
  next();
});

// Список амбассадоров
const AMBASSADORS = ["#"];

// Роут для получения общего количества участников
app.get('/api/total-members', async (req, res) => {
  try {
    const { data, error } = await supabase.from('participants').select('*');
    if (error) throw error;
    const totalMembers = data.length.toString();
    res.json({ totalMembers });
    logger.info(`Total members fetched: ${totalMembers}`);
  } catch (error) {
    logger.error(`Error fetching total members: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Роут для проверки пользователя по username или telegram_id
app.get('/api/check-user', async (req, res) => {
  const { username, telegram_id } = req.query;

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('position, referral_number')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`);

    if (error) throw error;

    if (data.length > 0) {
      res.json({ position: data[0].position, referral_number: data[0].referral_number });
      logger.info(`User checked: ${username || telegram_id}, position: ${data[0].position}, referral_number: ${data[0].referral_number}`);
    } else {
      res.json({ position: null, referral_number: null });
      logger.info(`User not found: ${username || telegram_id}`);
    }
  } catch (error) {
    logger.error(`Error checking user: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Роут для проверки, является ли пользователь амбассадором
// Роут для проверки, является ли пользователь амбассадором
app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body; // Извлекаем username из тела запроса

  if (!username) {
    logger.error('Username is missing in the request body');
    return res.status(400).json({ error: 'Username is required' });
  }

  if (AMBASSADORS.includes(username)) {
    res.json({ isAmbassador: true });
    logger.info(`Ambassador checked: ${username}, isAmbassador: true`);
  } else {
    res.json({ isAmbassador: false });
    logger.info(`Ambassador checked: ${username}, isAmbassador: false`);
  }
});

// Роут для проверки существования пользователя
app.get('/api/check-participant', async (req, res) => {
  const { username, telegram_id } = req.query;

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('position, referral_number')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`);

    if (error) throw error;

    if (data.length > 0) {
      res.json({ exists: true, position: data[0].position, referral_number: data[0].referral_number });
      logger.info(`Participant checked: ${username || telegram_id}, exists: true, position: ${data[0].position}, referral_number: ${data[0].referral_number}`);
    } else {
      res.json({ exists: false });
      logger.info(`Participant checked: ${username || telegram_id}, exists: false`);
    }
  } catch (error) {
    logger.error(`Error checking participant: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Запуск сервера
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
