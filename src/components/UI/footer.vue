<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const tg = window.Telegram.WebApp;

const handleJoinClick = async (e) => {
  e.preventDefault();

  const user = tg.initDataUnsafe?.user;

  if (!user || !user.username || !user.id) {
    console.error('Telegram user data is missing or incomplete:', user);
    return;
  }

  try {
    console.log('Checking participant:', { username: user.username, telegram_id: user.id });

    const { data } = await axios.get('https://work-2-tau.vercel.app/api/check-participant', {
      params: {
        username: user.username,
        telegram_id: user.id,
      },
    });

    console.log('API Response:', data);

    if (data.exists) {
      console.log(`User exists, redirecting to /profile/${user.id}`);
      await router.push(`/profile/${user.id}`);
    } else {
      console.log('User not found, redirecting to /join');
      await router.push('/join');
    }
  } catch (error) {
    console.error('Error checking user:', error);
    await router.push('/join');
  }
};

const showJoinButton = computed(() => router.currentRoute.value.path !== '/join');
</script>

<template>
  <footer>
      <button class="join-btn" @click="handleJoinClick">Join Earlier</button>
    <nav class="nav-bar">
      <div class="nav-icon" @click="$emit('taskOpen')">
        <IconTask />
      </div>
      <div class="nav-icon" @click="router.push('/')">
        <IconMain />
      </div>
      <div class="nav-icon" @click="$emit('refOpen')">
        <IconRef />
      </div>
    </nav>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
}

.join-section {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.join-btn {
  background-color: #00aaff;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.join-btn:hover {
  background-color: #0088cc;
}

.nav-bar {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 0;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #1a1a1a;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.nav-icon:hover {
  transform: scale(1.1);
}

.nav-icon svg {
  width: 24px;
  height: 24px;
  fill: #ffffff;
}
</style>
