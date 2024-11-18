<script>
import axios from 'axios';
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Ref from './ref.vue'
import Task from './task.vue'

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
      totalMembers: 0, // Добавляем переменную для хранения общего количества участников
      totalMembersDigits: [], // Массив для хранения символов числа
    }
  },
  async mounted() {
    window.Telegram.WebApp.MainButton.hide()
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.show = 0
      window.Telegram.WebApp.BackButton.hide()
    })

    // Вызываем метод для получения данных при монтировании компонента
    await this.fetchTotalMembers();
  },
  methods: {
    openRef() {
      this.show = 1
      window.Telegram.WebApp.BackButton.show()
    },
    openTask() {
      this.show = 2
      window.Telegram.WebApp.BackButton.show()
    },
    async fetchTotalMembers() {
      // Замените URL на ваш реальный URL для получения данных
      try {
        const response = await axios.get('http://your-vercel-app-url.vercel.app/api/total-members');
        this.totalMembers = response.data.totalMembers; // Предполагаем, что ответ содержит общее количество участников
        this.totalMembersDigits = this.padNumber(this.totalMembers, 5); // Заполняем число нулями до 5 символов
        console.log('Total Members Digits:', this.totalMembersDigits); // Отладочный вывод
      } catch (error) {
        console.error('There was an error fetching the total members!', error);
      }
    },
    padNumber(num, size) {
      let s = num.toString();
      while (s.length < size) s = "0" + s;
      return s.split('');
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
        <div v-for="(digit, index) in totalMembersDigits" :key="index" class="digit">
          <p>{{ digit }}</p>
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

.digit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px; /* Ширина каждой клетки */
  height: 30px; /* Высота каждой клетки */
  background: #ffffff;
  border-radius: 5px;
  font-size: 20px;
  color: #000;
  font-weight: 700;
}

p {
  margin: 0;
}
</style>
