<script setup>
import { computed, ref } from 'vue'
import User from '../pages/user.vue'

const props = defineProps({
  data: {
    type: Number,
    required: true
  }
})

const f = ref(false)

const fetchClass = () => {
    if(props.data == 0) {
        return 'm'
    } else {
        return 'r'
    }
}

const headerClass = computed(() => {
    return fetchClass()
})

const refWindow = () => {
    if (f.value == false) {
        f.value = true
    } else {
        f.value = false
    }
}
</script>

<template>
    <template v-if="!f">
        <div :class="`view-info ${headerClass}`">
            <div style="display: flex; align-items: center; justify-content: center;">
                <div>
                    <img id="profile" style="border-radius: 10px;" width="40px" height="40px" src="https://t.me/i/userpic/160/LowGas.jpg" @click="refWindow()"/>
                </div>
            </div>
            <div v-bind="connect()">
                <div id="ton-connect"></div>
            </div>
        </div>
    </template>
    <template v-else>
        <User />
    </template>
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

<script>
import { tonConnectUI } from '@/api/ton.js'

export default {
    methods: {
        connect() {
            setTimeout(() => {
                if (!document.querySelector('tc-root')) {
                    tonConnectUI()
                }
            }, 200)
        }
    }
}
</script>
