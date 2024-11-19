const express = require('express');
const { Pool } = require('pg');

const app = express();

// Подключение к базе данных
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'greenwoods',
  password: 'Dkflbvbhjdbx76',
  port: 5432,
});

// Проверка подключения к базе данных
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
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

    // Логирование данных перед отправкой ответа
    console.log('Total members:', totalMembers);
    console.log('Formatted members:', formattedMembers);

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
        ambassador_id INTEGER,
        referral_number INTEGER UNIQUE,
        invited_by TEXT,
        is_winner TEXT DEFAULT NULL,
        secret_key TEXT,
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
