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
      firstDigit: '0', // Первая цифра числа
      otherDigits: ['0', '0', '0'], // Остальные цифры числа
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
        const response = await axios.get('https://work-kb8vsybsy-danyas-projects-f55a11c7.vercel.app/api/total-members');
        this.totalMembers = response.data.totalMembers; // Предполагаем, что ответ содержит общее количество участников
        this.updateDigits(this.totalMembers);
        console.log('Total Members:', this.totalMembers); // Отладочный вывод
      } catch (error) {
        console.error('There was an error fetching the total members!', error);
      }
    },
    updateDigits(num) {
      const numStr = num.toString().padStart(4, '0'); // Заполняем нулями до 4 символов
      this.firstDigit = numStr[0];
      this.otherDigits = numStr.slice(1).split('');
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
          <p>{{ firstDigit }}</p>
        </div>
        <div class="nums">
          <p v-for="(digit, index) in otherDigits" :key="index">{{ digit }}</p>
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
