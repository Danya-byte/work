<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const count = ref(0)
const tg = window.Telegram.WebApp
const userState = ref({
  isRegistered: false,
  position: null,
  refNumber: null,
  referralsCount: null,
  isAmbassador: false
})

tg.MainButton.show();
tg.MainButton.text = "Subscribe"

const handleMainButtonClick = async () => {
    count.value++;
    await fetchUserData()
    switch (count.value) {
        case 1:
            updateButton("Join", 'https://t.me/Greenwoods_Community')
            break
        case 2:
            updateButton("Start", 'https://t.me/GreenWoodsGlobal')
            break
        default:
            redirectToHome()
    }
}

const fetchUserData = async () => {
    const user = window.Telegram.WebApp.initDataUnsafe.user
    if (user && user.username) {
        try {
            console.log('Fetching user data for username:', user.username)
            const response = await axios.post('https://work-2-tau.vercel.app/api/check-user', { username: user.username })
            userState.value = response.data
            console.log('User data fetched:', response.data)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    } else {
        console.error('User data is not available or username is missing')
    }
}

const updateButton = (text, url) => {
    tg.MainButton.text = text
    tg.openTelegramLink(url)
}

const redirectToHome = () => {
    window.location.href = '/'
}

tg.onEvent('mainButtonClicked', handleMainButtonClick);

const headerText = computed(() => {
    if (count.value === 0) return "Subscribe <br> to channel"
    if (count.value === 1) return "Join <br> to community"
    return "";
})

const joinEarly = async () => {
    await fetchUserData()
    const user = window.Telegram.WebApp.initDataUnsafe.user
    if (user && (user.username || user.id)) {
        try {
            const response = await axios.post('https://work-2-tau.vercel.app/api/check-participant', {
                username: user.username,
                telegram_id: user.id
            })

            if (response.data.exists) {
                this.show = 3 // Перенаправляем на профиль пользователя
            } else {
                this.show = 4 // Перенаправляем на страницу регистрации
            }

            this.saveActionToLocalStorage('joinEarly')
            this.saveActionToServer('joinEarly')
        } catch (error) {
            console.error('Error checking participant:', error)
        }
    } else {
        console.error('User data is not available or username/telegram_id is missing')
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
      <div v-if="userState.isRegistered">
        <p>Position: {{ userState.position }}</p>
        <p>Ref Number: {{ userState.refNumber }}</p>
        <p>Referrals Count: {{ userState.referralsCount }}</p>
        <p v-if="userState.isAmbassador">You are an Ambassador</p>
      </div>
    </div>
  </div>
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
</style>
