const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
const winston = require('winston');
const app = express();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Настройка логгера
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

// Middleware для логирования запросов
app.use((req, res, next) => {
  const { method, url, query, body } = req;
  logger.info(`Incoming request: ${method} ${url} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`);
  next();
});

const AMBASSADORS = [
  "vitmosk",
  "DjekillHayd",
  "eeeergoo",
  "Kvari6",
  "plazma787vvv",
  "borcuxa1996",
  "Igor6i9"
];

// Кэширование для total-members
let totalMembersCache = null;
let lastTotalMembersFetchTime = null;
const CACHE_DURATION = 60000; // 1 минута

// Получение общего количества участников
app.get('/api/total-members', async (req, res) => {
  const now = Date.now();
  if (totalMembersCache && (now - lastTotalMembersFetchTime < CACHE_DURATION)) {
    logger.info(`Total members fetched from cache: ${totalMembersCache}`);
    return res.json({ totalMembers: totalMembersCache.toString() });
  }

  try {
    const { count, error } = await supabase
      .from('participants')
      .select('*', { count: 'exact' });

    if (error) throw error;

    totalMembersCache = count;
    lastTotalMembersFetchTime = now;
    logger.info(`Total members fetched from database: ${count}`);
    res.json({ totalMembers: count.toString() });
  } catch (error) {
    logger.error(`Error fetching total members: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Проверка участника
app.get('/api/check-participant', async (req, res) => {
  const { username, telegram_id } = req.query;

  console.log('1. Received check request for:', { username, telegram_id });
  logger.info(`Checking participant: username=${username}, telegram_id=${telegram_id}`);

  try {
    console.log('2. Constructing query for username:', username);

    const query = supabase
      .from('participants')
      .select('*')
      .or(`username.ilike.${username},telegram_id.eq.${telegram_id}`)
      .maybeSingle();

    console.log('3. Query:', query.toString());

    const { data, error } = await query;

    console.log('4. Query result:', { data, error });

    if (error) {
      console.error('5. Supabase error:', error);
      logger.error(`Supabase error: ${error.message}`);
      throw error;
    }

    const exists = !!data;
    console.log('6. User exists:', exists);
    logger.info(`Check participant result: ${exists}`);

    res.json({
      exists,
      data: data || null
    });

  } catch (error) {
    console.error('7. Error processing request:', error);
    logger.error(`Error checking participant: ${error.message}`);
    res.json({ exists: false, data: null });
  }
});

// Проверка амбассадора
app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body;
  const isAmbassador = AMBASSADORS.includes(username);
  logger.info(`Checking ambassador status for ${username}: ${isAmbassador}`);
  res.json({ isAmbassador });
});

// Логирование действий пользователя
app.post('/api/log-action', async (req, res) => {
  const { action, userId, timestamp } = req.body;
  logger.info(`Logging user action: ${action} for user ${userId}`);
  try {
    const { error } = await supabase
      .from('user_actions')
      .insert([{ action, user_id: userId, timestamp }]);

    if (error) throw error;

    logger.info('Action logged successfully');
    res.json({ success: true });
  } catch (error) {
    logger.error(`Error logging action: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Клиентское логирование
app.post('/api/client-log', async (req, res) => {
  const { action, message, timestamp } = req.body;

  if (action === 'log') {
    logger.info(`[Client Log] ${timestamp}: ${message}`);
    res.json({ success: true });
  } else {
    logger.warn(`Invalid client log action: ${action}`);
    res.status(400).json({ error: 'Invalid action' });
  }
});

// Запуск сервера
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
