<script setup>
import { ref, onMounted } from 'vue';
import Background from '@/components/UI/bg.vue';
import Headers from '@/components/UI/header.vue';
import Footers from '@/components/UI/footer.vue';
import Ref from './ref.vue';
import Task from './task.vue';
import User from './user.vue';
import axios from 'axios';
const show = ref(0);
const totalMembers = ref('0000');
const showModal = ref(false);
onMounted(async () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.hide();
    window.Telegram.WebApp.BackButton.onClick(() => {
      show.value = 0;
      window.Telegram.WebApp.BackButton.hide();
    });
  }
  try {
    const response = await axios.get('https://work-2-tau.vercel.app/api/total-members');
    totalMembers.value = response.data.totalMembers.padStart(4, '0');
  } catch (error) {
    console.error('Error fetching total members:', error);
  }
});
const openRef = async () => {
  const user = window.Telegram.WebApp.initDataUnsafe.user;
  if (user?.username) {
    try {
      const response = await axios.post('https://work-2-tau.vercel.app/api/check-ambassador', {
        username: user.username
      });
      if (response.data.isAmbassador) {
        show.value = 1;
        window.Telegram.WebApp.BackButton.show();
      } else {
        showModal.value = true;
      }
      await axios.post('https://work-2-tau.vercel.app/api/log-action', {
        action: 'openRef',
        userId: user.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking ambassador status:', error);
      showModal.value = true;
    }
  } else {
    showModal.value = true;
  }
};
const openTask = async () => {
  show.value = 2;
  window.Telegram.WebApp.BackButton.show();
  try {
    await axios.post('https://work-2-tau.vercel.app/api/log-action', {
      action: 'openTask',
      userId: window.Telegram.WebApp.initDataUnsafe.user.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
const openUserProfile = async () => {
  show.value = 3;
  try {
    await axios.post('https://work-2-tau.vercel.app/api/log-action', {
      action: 'openUserProfile',
      userId: window.Telegram.WebApp.initDataUnsafe.user.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
const closeModal = () => {
  showModal.value = false;
};
</script>
<template>
  <Background />
  <Headers v-if="show != 3" :data="show" @profOpen="openUserProfile" />
  <main>
    <nav class="cnt">
      <div class="total">
        <h1 style="font-family: Inter; font-size: 19px; color: #f0f0f0;">Total members</h1>
      </div>
      <div class="count">
        <div><p>{{ totalMembers[0] }}</p></div>
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
  <User v-if="show === 3" />
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <p>Very soon</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>
<style scoped>
main{position:absolute;z-index:10;color:aliceblue;bottom:0;top:0;left:0;right:0;display:flex;align-items:center;justify-content:center}
.cnt{display:grid;gap:10px;padding:15px;backdrop-filter:blur(30px);border-radius:15px}
.total{display:flex;align-items:center;justify-content:center}
.count{display:flex;justify-content:space-between;align-items:center;min-width:170px;gap:20px}
.nums{display:flex;gap:10px;align-items:center;justify-content:space-between}
p{background:#ffffff;padding:12px;border-radius:5px;font-size:20px;color:#000;font-weight:700}
.modal{position:fixed;z-index:999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center}
.modal-content{background:white;padding:20px;border-radius:10px;text-align:center}
.modal-content p{margin-bottom:20px}
.modal-content button{padding:10px 20px;border:none;background:#007bff;color:white;border-radius:5px;cursor:pointer}
</style>
