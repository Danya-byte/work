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

// Форматирование числа с пробелами
function formatNumberWithSpaces(num) {
  const numStr = num.toString().padStart(4, '0'); // Приводим к длине 4 с ведущими нулями
  return numStr.split('').join(' '); // Разделяем цифры пробелами
}

// Получение общего количества участников
app.get('/api/total-members', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM participants');
    const totalMembers = parseInt(result.rows[0].count, 10) || 0; // Количество участников
    const formattedMembers = formatNumberWithSpaces(totalMembers); // Форматируем с пробелами
    console.log(`Total members: ${totalMembers}, Formatted: ${formattedMembers}`);

    // Логирование запроса
    const requestUrl = req.headers.referer || req.headers.origin || 'Unknown';
    const logQuery = 'INSERT INTO request_logs (request_url, request_time) VALUES ($1, $2)';
    await client.query(logQuery, [requestUrl, new Date()]);

    res.json({ totalMembers: formattedMembers }); // Возвращаем строку с пробелами
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

    // Создание таблицы для логирования запросов
    await client.query(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id SERIAL PRIMARY KEY,
        request_url TEXT NOT NULL,
        request_time TIMESTAMP NOT NULL
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
