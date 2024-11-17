<script setup>
import { ref } from 'vue'

const count = ref(0)
const tg = window.Telegram.WebApp

tg.MainButton.show()
tg.MainButton.text = "Subscribe"

tg.onEvent('mainButtonClicked', () => {
    count.value ++
    if (count.value == 1) {
        tg.MainButton.text = "Join"
        tg.openTelegramLink('https://t.me/Greenwoods_Community')
    } else if (count.value == 2) {
        tg.MainButton.text = "Start"
        tg.openTelegramLink('https://t.me/GreenWoodsGlobal')
    } else {
        window.location.href = '/'
    }
})

</script>

<template>
    <div class="join-board open">
        <div style="display: grid; align-items: center; justify-content: center;">
            <div style="display: grid; align-items: center; justify-content: center;">
                <img width="65px" height="65px" src="https://em-content.zobj.net/source/telegram/386/admission-tickets_1f39f-fe0f.webp" />
            </div>
            <div class="leader-title">
                <h1 v-if="count == 0" style="color: #f0f0f0; text-align: center;">Subscribe <br> to channel</h1>
                <h1 v-if="count == 1" style="color: #f0f0f0; text-align: center;">Join <br> to community</h1>
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
    bottom: -200px;
    align-items: center;
    justify-content: center;
}

.join-board.close {
    animation: close 0.5s ease forwards;
    bottom: -200px;
}

@keyframes open {
0% {
    transform: translateY(100%);
}
100% {
    transform: translateY(0);
    bottom: 0;
}
}

@keyframes close {
from {
    transform: translateY(0);
    bottom: 0;
}
to {
    transform: translateY(100%);
    bottom: -200px;
}
}

.refs {
margin-top: 15px;
}

.refs li {
margin: 10px;
padding: 10px;
display: flex;
justify-content: space-between;
background: #181818;
border-radius: 15px;
}

.about {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>