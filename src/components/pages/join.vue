<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const tg = window.Telegram.WebApp

tg.MainButton.show();
tg.MainButton.text = "Subscribe"

const handleMainButtonClick = () => {
    count.value++;
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
