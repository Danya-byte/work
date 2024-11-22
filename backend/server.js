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

app.get('/api/check-participant', async (req, res) => {
  const { username, telegram_id } = req.query;

  console.log('1. Received check request for:', { username, telegram_id });

  try {
    console.log('2. Constructing query for username:', username);

    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('username', username)
      .single();

    console.log('3. Query result:', { data, error });

    if (error && error.code !== 'PGRST116') { // Игнорируем ошибку "не найдено"
      console.error('4. Supabase error:', error);
      throw error;
    }

    const exists = !!data;
    console.log('5. User exists:', exists);

    res.json({ exists });

  } catch (error) {
    console.error('6. Error processing request:', error);
    res.json({ exists: false });
  }
});

app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body;
  const isAmbassador = AMBASSADORS.includes(username);
  logger.info(`Checking ambassador status for ${username}: ${isAmbassador}`);
  res.json({ isAmbassador });
});

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

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
