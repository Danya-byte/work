const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

// Настройки подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'greenwoods',
  password: 'Dkflbvbhjdbx76',
  port: 5432,
});

// Инициализация таблиц в базе данных
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        position INTEGER NOT NULL,
        ambassador_username TEXT,
        referral_number INTEGER UNIQUE,
        invited_by TEXT,
        is_winner TEXT DEFAULT NULL,
        secret_key TEXT,
        ambassador_id INTEGER,
        telegram_id BIGINT,
        EWE BIGINT,
        EWI BIGINT,
        ECI BIGINT
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ambassadors (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        chat_id BIGINT NOT NULL
      )
    `);
    console.log('Database initialized');
  } finally {
    client.release();
  }
}

// Получение общего количества участников
app.get('/api/total-members', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM participants');
    const totalMembers = parseInt(result.rows[0].count, 10);
    console.log(`Total members: ${totalMembers}`);
    res.json({ totalMembers });
  } catch (error) {
    console.error('Error fetching total members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDatabase();
});
