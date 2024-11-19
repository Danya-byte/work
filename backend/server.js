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
app.use(cors());

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

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
