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
  logger.info(`Incoming request: ${method} ${url}`);
  next();
});
const AMBASSADORS = ["#"];
app.get('/api/total-members', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('participants')
      .select('*', { count: 'exact' });
    if (error) throw error;
    res.json({ totalMembers: count.toString() });
  } catch (error) {
    logger.error(`Error fetching total members: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/check-user', async (req, res) => {
  const { username, telegram_id } = req.query;
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`)
      .single();
    if (error) throw error;
    if (data) {
      res.json({
        isRegistered: true,
        position: data.position,
        refNumber: data.referral_number,
        referralsCount: data.referrals_count,
      });
    } else {
      res.json({
        isRegistered: false,
        position: null,
        refNumber: null,
        referralsCount: 0,
      });
    }
  } catch (error) {
    logger.error(`Error checking user: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body;
  const isAmbassador = AMBASSADORS.includes(username);
  res.json({ isAmbassador });
});
app.get('/api/check-participant', async (req, res) => {
  const { username, telegram_id } = req.query;
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`)
      .single();
    if (error) throw error;
    res.json({
      exists: !!data,
      position: data?.position,
      referral_number: data?.referral_number,
    });
  } catch (error) {
    logger.error(`Error checking participant: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
