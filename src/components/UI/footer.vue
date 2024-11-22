<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const tg = window.Telegram.WebApp

const checkUser = async () => {
  const username = tg.initDataUnsafe?.user?.username || ''
  const telegram_id = tg.initDataUnsafe?.user?.id || ''

  try {
    const response = await axios.get(`https://work-2-tau.vercel.app/api/check-participant?username=${username}&telegram_id=${telegram_id}`)
    const data = response.data

    if (data.exists) {
      // Если пользователь существует, перенаправляем на профиль
      router.push({ name: 'profile', params: { userId: telegram_id } })
    } else {
      // Если пользователя нет, перенаправляем на страницу регистрации
      router.push({ name: 'join' })
    }
  } catch (error) {
    console.error('Error checking user:', error)
    // В случае ошибки также перенаправляем на страницу регистрации
    router.push({ name: 'join' })
  }
}
</script>

<template>
  <div class="join-board open">
    <div class="centered-content">
      <div class="image-container">
        <img width="80px" height="80px" src="https://em-content.zobj.net/source/telegram/386/admission-tickets_1f39f-fe0f.webp" alt="reg" />
      </div>
      <div class="leader-title">
        <h1 v-html="headerText" class="header-text"></h1>
      </div>
    </div>
  </div>
  <footer>
    <div class="another">
      <RouterLink to="/join" @click="checkUser">
        <button>Join earlyer</button>
      </RouterLink>
    </div>
    <nav class="bar">
      <div style="display: grid;align-items: center;justify-content: center;background: #000000;border-radius: 10px;padding: 3px;" @click="$emit('taskOpen')">
        <IconTask />
      </div>
      <div style="display: grid;align-items: center;justify-content: center;background: #000000;border-radius: 10px;padding: 3px;">
        <IconMain />
      </div>
      <div style="display: grid;align-items: center;justify-content: center;background: #000000;border-radius: 10px;padding: 3px;" @click="$emit('refOpen')">
        <IconRef />
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.join-board {
  display: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: #212121;
}

.join-board.open {
  display: flex;
  animation: open 0.5s ease forwards;
  align-items: center;
  justify-content: center;
}

.centered-content {
  display: grid;
  align-items: center;
  justify-content: center;
}

.image-container {
  display: grid;
  align-items: center;
  justify-content: center;
}

.header-text {
  color: #f0f0f0;
  text-align: center;
}

@keyframes open {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

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

