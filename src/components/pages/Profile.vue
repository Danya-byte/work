<template>
  <div class="profile-board open">
    <div class="centered-content">
      <div class="image-container">
        <img width="80px" height="80px" src="https://em-content.zobj.net/source/telegram/386/admission-tickets_1f39f-fe0f.webp" alt="reg" />
      </div>
      <div class="leader-title">
        <h1 class="header-text">Your Profile</h1>
      </div>
    </div>
    <div>
      <p>Your position: {{ position }}</p>
      <button @click="copyReferralLink">Copy Referral Link</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Number,
      required: true
    }
  },
  methods: {
    copyReferralLink() {
      // Логика для копирования реферальной ссылки
      alert('Referral link copied!');
    }
  }
}
</script>

<style scoped>
.profile-board {
  display: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: #212121;
}

.profile-board.open {
  display: flex;
  animation: open 0.5s ease forwards;
  align-items: center;
  justify-content: center;
}

.centered-content {
  display: grid;
  align-items: center;
  justify-content: center;
}

.image-container {
  display: grid;
  align-items: center;
  justify-content: center;
}

.header-text {
  color: #f0f0f0;
  text-align: center;
}

@keyframes open {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
