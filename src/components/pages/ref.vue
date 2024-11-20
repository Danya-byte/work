<template>
  <div class="leader-board open">
  <RouterLink to="/main"><button class="back">Х</button></RouterLink>
    <div style="display: grid; align-items: center; justify-content: center;">
      <img
        width="65px"
        height="65px"
        src="https://em-content.zobj.net/source/telegram/386/gem-stone_1f48e.webp"
      >
    </div>
    <div class="leader-title">
      <h1 style="color: #f0f0f0; text-align: center;">Leaderboard <br> TOP 10</h1>
    </div>
    <ul class="refs">
      <li>
        <div class="about">
          <div>
            <div style="width: 40px; height: 40px; background: red; border-radius: 20px" @click="close"></div>
          </div>
          <div>
            <h3 style="font-family: Quicksand; color: #fff;">Pavel Durov</h3>
            <p style="padding: 0; font-size: 14px; color: #aaaaaa; background: 0;">N1</p>
          </div>
        </div>
        <div style="display: grid; align-items: center;">
          <h1 style="font-family: Quicksand; font-size: 20px; font-weight: 500; color: #fff;">20</h1>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.back {
  background-color: #444444;
  border-radius: 50%;
  border: none;
  color: white;
  width: 8vw;
  height: 8vw;
  float: right;
  margin-top: 5vw;
  margin-right: 2vw;
}
.leader-board {
  display: none;
  position: absolute;
  width: 100vw;
  height: calc(100vh - 80px);
  z-index: 1000;
  background: #212121;
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
  background: #181818;
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
