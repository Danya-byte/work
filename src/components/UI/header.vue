<script setup>
import { computed, ref } from 'vue'
import { tonConnectUI } from '@/api/ton.js'
import Profile from '@/components/Profile.vue'

const props = defineProps({
  data: {
    type: Number,
    required: true
  }
})

const f = ref(false)
const showProfile = ref(false)

const fetchClass = () => {
    return props.data === 0 ? 'm' : 'r'
}

const headerClass = computed(() => {
    return fetchClass()
})

const refWindow = () => {
    f.value = !f.value
    document.querySelector('.rw').style.display = f.value ? 'flex' : 'none'
}

const connect = () => {
    setTimeout(() => {
        if (!document.querySelector('tc-root')) {
            tonConnectUI()
        }
    }, 200)
}

const openProfile = () => {
    showProfile.value = true
}

const closeProfile = () => {
    showProfile.value = false
}
</script>

<template>
    <div :class="`view-info ${headerClass}`">
        <div style="display: flex; align-items: center; justify-content: center;">
            <div>
                <img id="profile" style="border-radius: 10px;" width="40px" height="40px" src="https://t.me/i/userpic/160/LowGas.jpg" @click="openProfile"/>
            </div>
        </div>
        <div v-bind="connect()">
            <div id="ton-connect"></div>
        </div>
        <div class="rw">
            <p>t.me/GreenwoodsBot..8927</p>
            <p v-if="props.data !== null">Your position: {{ props.data }}</p>
        </div>
    </div>
    <Profile v-if="showProfile" :position="props.data" @close="closeProfile" />
</template>

<style scoped>
.view-info {
  position: relative;
  z-index: 100;
  padding: 15px 20px;
  background: #000;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  box-shadow: 0px 10px 19px 0 #000000;
  transition: background 0.5s;
}

.r {
    background: #181818;
    box-shadow: inset 0 0 20px 0px #000;
}

.rw {
    padding: 5px;
    min-width: 150px;
    min-height: 50px;
    z-index: 999;
    position: absolute;
    margin-top: 90px;
    border-radius: 5px;
    backdrop-filter: contrast(0.3);
    display: none;
    align-items: center;
    animation: open 1s ease forwards;
}

p {
    color: #fff;
    font-weight: 600;
    font-family: Quicksand;
    font-size: 13px;
    text-align: center;
}

@keyframes open {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
