<template>
  <Background />
  <Headers :data="show" />
  <main>
    <nav class="cnt">
      <div class="total">
        <h1 style="font-family: Inter; font-size: 19px; color: #f0f0f0;">
          Total members
        </h1>
      </div>
      <div class="count">
        <div v-for="(digit, index) in formattedMembers" :key="index" class="digit">
          <p class="des">{{ digit }}</p>
        </div>
      </div>
    </nav>
  </main>
  <Footers @refOpen="openRef" @taskOpen="openTask" />
  <Ref v-if="show === 1" />
  <Task v-if="show === 2" />
</template>

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
    Task
  },
  data() {
    return {
      show: 0,
      totalMembers: "0000", // Изначально 4 нуля
    };
  },
  computed: {
    formattedMembers() {
      const membersArray = this.totalMembers.toString().split('').map(Number);
      while (membersArray.length < 4) {
        membersArray.unshift(0);
      }
      return membersArray;
    }
  },
  async mounted() {
    window.Telegram.WebApp.MainButton.hide();
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.show = 0;
      window.Telegram.WebApp.BackButton.hide();
    });

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
        const response = await axios.get(
          'https://work-kb8vsybsy-danyas-projects-f55a11c7.vercel.app/api/total-members'
        );
        this.totalMembers = response.data.totalMembers.toString().padStart(4, '0'); // Дополняем нулями до 4 символов
        console.log('Total Members:', this.totalMembers);
      } catch (error) {
        console.error('There was an error fetching the total members!', error);
        this.totalMembers = "0000"; // Устанавливаем "0000" в случае ошибки
      }
    }
  }
};
</script>

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

.des {
  color: rgba(255, 255, 255, 0.807);
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
  gap: 10px;
}

.digit {
  background: #01bbee9a;
  padding: 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  width: max-content;
  height: max-content;
}

p {
  font-size: 20px;
  color: #000;
  font-weight: 700;
  margin: 0;
}
</style>
