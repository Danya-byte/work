const express = require('express');
const cors = require('cors');
const supabase = require('./supabase'); // Импортируем подключение к Supabase

const app = express();
const port = process.env.PORT || 3000;

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
    const { data, error } = await supabase.from('participants').select('*');
    if (error) throw error;
    const totalMembers = data.length.toString();
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
    const { data, error } = await supabase
      .from('participants')
      .select('position, referral_number')
      .or(`username.eq.${username},telegram_id.eq.${telegram_id}`);

    if (error) throw error;

    if (data.length > 0) {
      res.json({ position: data[0].position, referral_number: data[0].referral_number });
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
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking participant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
