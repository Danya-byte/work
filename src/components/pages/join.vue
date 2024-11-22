<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const count = ref(0)
const tg = window.Telegram.WebApp
const isLoading = ref(true)

onMounted(async () => {
    await checkUserStatus()
})

const checkUserStatus = async () => {
    const username = tg.initDataUnsafe?.user?.username || ''
    const telegram_id = tg.initDataUnsafe?.user?.id || ''

    try {
        const response = await axios.get(`https://work-2-tau.vercel.app/api/check-participant?username=${username}&telegram_id=${telegram_id}`)

        if (response.data.exists) {
            router.push({ name: 'profile', params: { userId: telegram_id } })
            return
        }

        initTelegramButton()
    } catch (error) {
        console.error('Error checking user:', error)
        initTelegramButton()
    } finally {
        isLoading.value = false
    }
}

const initTelegramButton = () => {
    tg.MainButton.show()
    tg.MainButton.text = "Subscribe"
    tg.onEvent('mainButtonClicked', handleMainButtonClick)
}

const handleMainButtonClick = () => {
    count.value++
    switch (count.value) {
        case 1:
            updateButton("Join", 'https://t.me/Greenwoods_Community')
            break
        case 2:
            updateButton("Start", 'https://t.me/GreenWoodsGlobal')
            break
        default:
            router.push('/')
    }
}

const updateButton = (text, url) => {
    tg.MainButton.text = text
    tg.openTelegramLink(url)
}

const headerText = computed(() => {
    if (count.value === 0) return "Subscribe <br> to channel"
    if (count.value === 1) return "Join <br> to community"
    return ""
})
</script>

<template>
  <div v-if="!isLoading" class="join-board open">
    <div class="centered-content">
      <div class="image-container">
        <img width="80px" height="80px" src="https://em-content.zobj.net/source/telegram/386/admission-tickets_1f39f-fe0f.webp" alt="reg" />
      </div>
      <div class="leader-title">
        <h1 v-html="headerText" class="header-text"></h1>
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
