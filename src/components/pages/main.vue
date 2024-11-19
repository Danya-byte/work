<script>
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Ref from './ref.vue'
import Task from './task.vue'
import axios from 'axios';

export default {
  components: {
    Background,
    Headers,
    Footers,
    Ref,
    Task
  },
  data() {
    return {
      show: 0,
      totalMembers: '0000' // Инициализация с четырьмя нулями
    }
  },
  async mounted() {
    window.Telegram.WebApp.MainButton.hide()
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.show = 0
      window.Telegram.WebApp.BackButton.hide()
    })

    // Получение данных с бэкенда
    try {
      const response = await axios.get('http://localhost:3000/api/total-members');
      this.totalMembers = response.data.totalMembers.padStart(4, '0'); // Дополняем нулями до 4 символов
    } catch (error) {
      console.error('Error fetching total members:', error);
    }
  },
  methods: {
    openRef() {
      this.show = 1
      window.Telegram.WebApp.BackButton.show()
    },
    openTask() {
      this.show = 2
      window.Telegram.WebApp.BackButton.show()
    }
  }
}
</script>

<template>
  <Background />
  <Headers :data="show" />
  <main>
    <nav class="cnt">
      <div class="total">
        <h1 style="font-family: Inter; font-size: 19px; color: #f0f0f0;">Total members</h1>
      </div>
      <div class="count">
        <div>
          <p>{{ totalMembers[0] }}</p>
        </div>
        <div class="nums">
          <p>{{ totalMembers[1] }}</p>
          <p>{{ totalMembers[2] }}</p>
          <p>{{ totalMembers[3] }}</p>
        </div>
      </div>
    </nav>
  </main>
  <Footers @refOpen="openRef" @taskOpen="openTask" />
  <Ref v-if="show === 1" />
  <Task v-if="show === 2" />
</template>

<style scoped>
main {
  position: absolute;
    z-index: 10;
    color: aliceblue;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cnt {
  display: grid;
  gap: 10px;
  padding: 15px;
  backdrop-filter: blur(30px);
  border-radius: 15px;
}

.total {
  display: flex;
  align-items: center;
  justify-content: center;
}

.count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 170px;
  gap: 20px;
}

.nums {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

p {
  background: #ffffff;
  padding: 12px;
  border-radius: 5px;
  font-size: 20px;
  color: #000;
  font-weight: 700;
}
</style>
