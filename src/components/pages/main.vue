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
      totalMembers: '0 0 0 0', // Изначально 4 нуля, разделенных пробелами
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
        const response = await axios.get('https://work-8enqno6vr-danyas-projects-f55a11c7.vercel.app/api/total-members');
        this.totalMembers = response.data.totalMembers || '0 0 0 0'; // Данные с сервера или "0 0 0 0" по умолчанию
        console.log('Total Members:', this.totalMembers);
      } catch (error) {
        console.error('Error fetching total members:', error);
        this.totalMembers = '0 0 0 0'; // Устанавливаем "0 0 0 0" в случае ошибки
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
        <!-- Разбиваем строку на отдельные цифры и рендерим -->
        <div v-for="(digit, index) in totalMembers.split(' ')" :key="index" class="digit">
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
  gap: 15px;
  padding: 20px;
  backdrop-filter: blur(20px);
  background-color: rgba(0, 0, 0, 0.7); /* Чёрный фон с прозрачностью */
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
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
  gap: 10px; /* Расстояние между цифрами */
}

.digit {
  background: #ffffff;
  padding: 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px; /* Ширина цифры */
  min-height: 40px; /* Высота цифры */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Тень для цифр */
}

p {
  font-size: 22px; /* Размер шрифта */
  color: #000;
  font-weight: 700;
  margin: 0;
}
</style>
