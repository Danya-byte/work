const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

// Список амбассадоров
const AMBASSADORS = ["backend_creator"];

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

// Роут для проверки, является ли пользователь амбассадором
app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body;

  if (AMBASSADORS.includes(username)) {
    res.json({ isAmbassador: true });
  } else {
    res.json({ isAmbassador: false });
  }
});

// Роут для сохранения состояния пользователя в файл с другим названием
app.post('/api/save-user-state', (req, res) => {
  const userState = req.body;
  const filePath = path.join(__dirname, 'userStateNew.json'); // Укажите новое название файла

  // Проверяем, существует ли файл
  if (fs.existsSync(filePath)) {
    // Если файл существует, читаем его содержимое
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let userStates = [];
      try {
        userStates = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Добавляем новое состояние пользователя
      userStates.push(userState);

      // Записываем обновленный массив обратно в файл
      fs.writeFile(filePath, JSON.stringify(userStates, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'User state saved successfully' });
      });
    });
  } else {
    // Если файл не существует, создаем новый файл с первым состоянием пользователя
    const userStates = [userState];
    fs.writeFile(filePath, JSON.stringify(userStates, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'User state saved successfully' });
    });
  }
});

// Роут для сохранения действия пользователя в файл
app.post('/api/save-action', (req, res) => {
  const action = req.body;
  const filePath = path.join(__dirname, 'userActions.json'); // Укажите новое название файла для действий

  // Проверяем, существует ли файл
  if (fs.existsSync(filePath)) {
    // Если файл существует, читаем его содержимое
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let actions = [];
      try {
        actions = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Добавляем новое действие
      actions.push(action);

      // Записываем обновленный массив обратно в файл
      fs.writeFile(filePath, JSON.stringify(actions, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Action saved successfully' });
      });
    });
  } else {
    // Если файл не существует, создаем новый файл с первым действием
    const actions = [action];
    fs.writeFile(filePath, JSON.stringify(actions, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'Action saved successfully' });
    });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
