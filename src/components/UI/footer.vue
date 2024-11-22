<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const tg = window.Telegram?.WebApp

// Обработчик клика по кнопке
const handleJoinClick = async () => {
  if (!tg || !tg.initDataUnsafe?.user) {
    await logToServer('Telegram WebApp user data is unavailable.')
    router.push({ name: 'join' }) // Перенаправление на join.vue, если данных нет
    return
  }

  await checkUser()
}

// Проверка пользователя через API
const checkUser = async () => {
  const user = tg.initDataUnsafe.user
  const username = user.username || ''
  const telegram_id = user.id || ''

  try {
    await logToServer(`Checking user: username=${username}, telegram_id=${telegram_id}`)

    const response = await axios.get('https://work-2-tau.vercel.app/api/check-participant', {
      params: { username, telegram_id },
    })

    if (response.data.isRegistered) {
      await logToServer(`User ${telegram_id} is registered. Redirecting to profile.`)
      router.push({ name: 'profile', params: { userId: telegram_id } })
    } else {
      await logToServer(`User ${telegram_id} is not registered. Redirecting to join.`)
      router.push({ name: 'join' })
    }
  } catch (error) {
    await logToServer(`Error checking user: ${error.message}`)
    router.push({ name: 'join' }) // На случай ошибки API
  }
}

// Логирование на сервер
const logToServer = async (message) => {
  try {
    await axios.post('https://work-2-tau.vercel.app/api/log-action', {
      action: 'log',
      message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Игнорируем ошибки логирования
  }
}
</script>

<template>
  <footer>
    <div class="another">
      <button @click="handleJoinClick">Join earlyer</button>
    </div>
    <nav class="bar">
      <div class="nav-icon" @click="$emit('taskOpen')">
        <IconTask />
      </div>
      <div class="nav-icon">
        <IconMain />
      </div>
      <div class="nav-icon" @click="$emit('refOpen')">
        <IconRef />
      </div>
    </nav>
  </footer>
</template>

<style scoped>
footer {
  position: absolute;
  z-index: 100;
  bottom: 0;
  width: 100vw;
  min-height: 120px;
  backdrop-filter: blur(1px);
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.another {
  display: grid;
  align-items: center;
  justify-content: center;
}

.bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25%;
  width: 100vw;
  padding: 10px;
  background: #000000;
  box-shadow: 0px 9px 13px 12px #000;
}

.nav-icon {
  display: grid;
  align-items: center;
  justify-content: center;
  background: #000000;
  border-radius: 10px;
  padding: 3px;
}

.another button {
  height: fit-content;
  padding: 10px;
  width: 80vw;
  border: 0;
  background: #66cdaa;
  border-radius: 10px;
  font-size: 17px;
  font-family: Inter;
  font-weight: 600;
  border-bottom: 5px solid #539881;
  color: #0e0e0e;
}
</style>
