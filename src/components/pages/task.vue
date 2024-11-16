<template>
    <div class="leader-board open">
      <div style="display: grid; align-items: center; justify-content: center;">
        <img
          width="65px"
          height="65px"
          src="https://em-content.zobj.net/source/telegram/386/sparkles_2728.webp"
        >
      </div>
      <div class="leader-title">
        <h1 style="color: #353535; text-align: center;">Tasks</h1>
      </div>
      <ul class="refs">
        <li v-for="(item) in data" :key="item.id">
          <div class="about">
            <div style="display: flex; align-items: center; justify-content: center;">
              <img v-if="item.type == 'Channel'" style="border-radius: 50px;" width="40px" height="40px" src="../../assets/telegramlogo.jpeg" @click="close" />
              <img v-if="item.type == 'Transaction'" style="border-radius: 50px;" width="40px" height="40px" src="../../assets/telegramlogo.jpeg" @click="close" />
            </div>
            <div>
              <h3 style="font-family: Quicksand">{{ item.type }}</h3>
              <p style="padding: 0; font-size: 14px; color: #aaaaaa; background: 0;">{{ item.reward }}</p>
            </div>
          </div>
          <div style="display: grid; align-items: center;">
            <h1 style="font-family: Quicksand; font-size: 18px; font-weight: 600; color: #3390ec;">Start</h1>
          </div>
        </li>
      </ul>
    </div>
</template>

<style scoped>
.leader-board {
display: none;
position: absolute;
width: 100vw;
height: calc(100vh - 80px);
z-index: 1000;
background: #ffffff;
}

.leader-board.open {
display: block;
animation: open 0.5s ease forwards;
bottom: -200px;
}

.leader-board.close {
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
    border: 2px solid #f0f0f0;
    border-radius: 15px;
}

.about {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>

<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    type: 'Channel',
                    reward: '+500 EWE'
                },
                {
                    id: 2,
                    type: 'Channel',
                    reward: '+1000 EWI'
                }
            ]
        }
    },
    methods: {
        close() {
            document.querySelector('.leader-board').classList.add('close')  
            setTimeout(() => {
                document.querySelector('#app').removeChild(document.querySelector('.leader-board'))
            }, 500)
        }
    }
}
</script>