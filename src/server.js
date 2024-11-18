const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

// Подключение к базе данных
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'greenwoods',
  password: 'Dkflbvbhjdbx76',
  port: 5432,
});

// Функция для форматирования числа
function formatNumber(num) {
  return num.toString().padStart(4, '0'); // Возвращаем строку с нулями
}

// Получение общего количества участников
app.get('/api/total-members', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM participants');
    const totalMembers = parseInt(result.rows[0].count, 10) || 0; // Получаем общее количество
    const formattedMembers = formatNumber(totalMembers); // Форматируем как строку
    console.log(`Total members: ${totalMembers}, Formatted: ${formattedMembers}`);
    res.json({ totalMembers: formattedMembers }); // Отправляем строку
  } catch (error) {
    console.error('Error fetching total members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Инициализация базы данных
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
    console.log('Database initialized');
  } finally {
    client.release();
  }
}

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDatabase();
});
