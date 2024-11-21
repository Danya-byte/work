const express = require('express');
const cors = require('cors');
const supabase = require('./supabase'); // Импортируем подключение к Supabase
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Настройка CORS для разрешения запросов с любого домена
app.use(cors());
app.use(express.json());

// Функция для записи логов в файл
const logToFile = (message) => {
  const logFilePath = path.join(__dirname, 'server.log');
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

// Логирование всех запросов
app.use((req, res, next) => {
  const { method, url, body } = req;
  const logMessage = `Incoming request: ${method} ${url} ${JSON.stringify(body)}`;
  logToFile(logMessage);
  next();
});

// Список амбассадоров
const AMBASSADORS = ["backend_creator"];

// Роут для получения общего количества участников
app.get('/api/total-members', async (req, res) => {
  try {
    const { data, error } = await supabase.from('participants').select('*');
    if (error) throw error;
    const totalMembers = data.length.toString();
    res.json({ totalMembers });
    logToFile(`Total members fetched: ${totalMembers}`);
  } catch (error) {
    console.error('Error fetching total members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    logToFile(`Error fetching total members: ${error.message}`);
  }
});

// Роут для проверки пользователя по username или telegram_id
app.post('/api/check-user', async (req, res) => {
  const { username, telegram_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('position, referral_number')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`);

    if (error) throw error;

    if (data.length > 0) {
      res.json({ position: data[0].position, referral_number: data[0].referral_number });
      logToFile(`User checked: ${username || telegram_id}, position: ${data[0].position}, referral_number: ${data[0].referral_number}`);
    } else {
      res.json({ position: null, referral_number: null });
      logToFile(`User not found: ${username || telegram_id}`);
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    logToFile(`Error checking user: ${error.message}`);
  }
});

// Роут для проверки, является ли пользователь амбассадором
app.post('/api/check-ambassador', (req, res) => {
  const { username } = req.body;

  if (AMBASSADORS.includes(username)) {
    res.json({ isAmbassador: true });
    logToFile(`Ambassador checked: ${username}, isAmbassador: true`);
  } else {
    res.json({ isAmbassador: false });
    logToFile(`Ambassador checked: ${username}, isAmbassador: false`);
  }
});

// Роут для проверки существования пользователя
app.post('/api/check-participant', async (req, res) => {
  const { username, telegram_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('position, referral_number')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`);

    if (error) throw error;

    if (data.length > 0) {
      res.json({ exists: true, position: data[0].position, referral_number: data[0].referral_number });
      logToFile(`Participant checked: ${username || telegram_id}, exists: true, position: ${data[0].position}, referral_number: ${data[0].referral_number}`);
    } else {
      res.json({ exists: false });
      logToFile(`Participant checked: ${username || telegram_id}, exists: false`);
    }
  } catch (error) {
    console.error('Error checking participant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    logToFile(`Error checking participant: ${error.message}`);
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
