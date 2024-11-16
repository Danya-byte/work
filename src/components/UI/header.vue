<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Number,
    required: true
  }
})

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
</script>

<template>
    <div :class="`view-info ${headerClass}`">
        <div style="display: flex; align-items: center; justify-content: center;">
            <div>
                <img id="profile" style="border-radius: 10px;" width="40px" height="40px" src="https://t.me/i/userpic/160/LowGas.jpg">
            </div>
        </div>
        <div v-bind="connect()">
            <div id="ton-connect"></div>
        </div>
    </div>
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