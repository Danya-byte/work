<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const tg = window.Telegram.WebApp
const isLoading = ref(true)

onMounted(async () => {
    await checkUserStatus()
})

const handleJoinClick = async (e) => {
    e.preventDefault()
    await checkUserStatus()
}

const checkUserStatus = async () => {
    const username = tg.initDataUnsafe?.user?.username || ''
    const telegram_id = tg.initDataUnsafe?.user?.id || ''

    try {
        const response = await axios.get(`https://work-2-tau.vercel.app/api/check-participant?username=${username}&telegram_id=${telegram_id}`)

        if (response.data.exists) {
            router.push({ name: 'profile', params: { userId: telegram_id } })
        } else {
            router.push({ name: 'join' })
        }
    } catch (error) {
        console.error('Error checking user:', error)
        router.push({ name: 'join' })
    } finally {
        isLoading.value = false
    }
}

const showJoinButton = computed(() => {
    return router.currentRoute.value.name !== 'join'
})
</script>

<template>
  <footer v-if="!isLoading">
    <div class="another" v-if="showJoinButton">
      <RouterLink to="/join" @click="handleJoinClick">
        <button>Join earlier</button>
      </RouterLink>
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
