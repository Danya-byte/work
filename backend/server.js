const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Настройки подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'greenwoods',
  password: 'Dkflbvbhjdbx76',
  port: 5432,
});

// Настройка CORS
const corsOptions = {
  origin: 'https://work-2-tau.vercel.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Роут для получения общего количества участников
app.get('/api/total-members', async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) FROM participants';
    const result = await pool.query(query);
    const totalMembers = result.rows[0].count.toString();
    res.json({ totalMembers });
  } catch (error) {
    console.error('Error fetching total members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Роут для проверки пользователя по username или telegram_id
app.post('/api/check-user', async (req, res) => {
  const { username, telegram_id } = req.body;

  try {
    const query = 'SELECT position, referral_number FROM participants WHERE username = $1 OR telegram_id = $2';
    const result = await pool.query(query, [username, telegram_id]);

    if (result.rows.length > 0) {
      res.json({ position: result.rows[0].position, referral_number: result.rows[0].referral_number });
    } else {
      res.json({ position: null, referral_number: null });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
