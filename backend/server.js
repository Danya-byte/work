const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
const winston = require('winston');
const app = express();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
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
app.use((req, res, next) => {
  const { method, url, query, body } = req;
  logger.info(`Incoming request: ${method} ${url} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`);
  next();
});
const AMBASSADORS = ["#"]; // Убедитесь, что значение правильное

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
    res.json({ totalMembers: count.toString() });
  } catch (error) {
    logger.error(`Error fetching total members: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/check-participant', async (req, res) => {
  const { username, telegram_id } = req.query;

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`)
      .maybeSingle(); // Используем maybeSingle для предотвращения ошибок, если данные отсутствуют

    if (error) {
      logger.error(`Supabase error: ${error.message}`);
      throw error;
    }

    res.json({
      isRegistered: !!data, // true, если data не null
      position: data?.position || null,
      refNumber: data?.referral_number || null,
      referralsCount: data?.referrals_count || 0,
    });
  } catch (error) {
    logger.error(`Error checking participant: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body;
  const isAmbassador = AMBASSADORS.includes(username);
  res.json({ isAmbassador });
});

app.post('/api/log-action', async (req, res) => {
  const { action, userId, timestamp } = req.body;
  try {
    const { error } = await supabase
      .from('user_actions')
      .insert([{ action, user_id: userId, timestamp }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    logger.error(`Error logging action: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
