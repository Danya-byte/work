<script>
import axios from 'axios';
import Background from '@/components/UI/bg.vue';
import Headers from '@/components/UI/header.vue';
import Footers from '@/components/UI/footer.vue';
import Ref from './ref.vue';
import Task from './task.vue';

export default {
  components: {
    Background,
    Headers,
    Footers,
    Ref,
    Task,
  },
  data() {
    return {
      show: 0,
      totalMembers: '0000', // Строка, где каждое число отобразится как отдельный символ
    };
  },
  async mounted() {
    // Прячем кнопки Telegram при загрузке
    window.Telegram.WebApp.MainButton.hide();
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.show = 0;
      window.Telegram.WebApp.BackButton.hide();
    });

    // Загружаем данные
    await this.fetchTotalMembers();
  },
  methods: {
    openRef() {
      this.show = 1;
      window.Telegram.WebApp.BackButton.show();
    },
    openTask() {
      this.show = 2;
      window.Telegram.WebApp.BackButton.show();
    },
    async fetchTotalMembers() {
      try {
        const response = await axios.get('https://your-api-url/api/total-members');
        this.totalMembers = response.data.totalMembers || '0000'; // Обрабатываем данные
        console.log('Total Members:', this.totalMembers);
      } catch (error) {
        console.error('Error fetching total members:', error);
      }
    },
  },
};
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
        <div v-for="(digit, index) in totalMembers" :key="index" class="digit">
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
  justify-content: center;
  align-items: center;
  gap: 5px; /* Уменьшите пространство между цифрами, если необходимо */
}

.digit {
  background: #ffffff;
  padding: 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  font-size: 24px; /* Увеличьте размер шрифта для лучшей видимости */
  font-weight: 700;
}

p {
  margin: 0;
  color: #000;
}
</style>
