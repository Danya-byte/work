<script>
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Task from './task.vue'
import Join from './Join.vue'
import Leaderboard from './leaderboard.vue'
import axios from 'axios';

const AMBASSADORS = ["kata1ana", "fulminatrex", "notlistinq", "balushka23",
               "SBTech_youtube", "Nik7102", "cryptohood_adv",
               "greenchtg", "Igor6i9", "LaLiPaP26", "eeeeergoo",
               "inside_cripto_pro", "msm031", "Kvar16", "nastushkaE17",
               "hc_tlg",
               "vilyam_tim",
               "AlexShamps",
               "Skilful221", "Izzzzznanka", "cooper_ad", "rstmcrew",
               "tropirich", "MR_FRIKOP", "E_E_E_NEON","makcum52","#",
               "oleksandr_567", "Homiakk2", "Aleksei_jdi", "pavelinvest",
              "Natashkacrypto", "sashaarmy20","aB_Var_666_999", "Floopi_STG",
             "VenusTraidingPro", "Artgog777", "reshe_tov", "ilyu4ik", "jam_qq", "sepata",
           "fuelghoir" ];

export default {
  components: {
    Background,
    Headers,
    Footers,
    Task,
    Join,
    Leaderboard
  },
  data() {
    return {
      show: 0,
      totalMembers: '0000', // Инициализация с четырьмя нулями
      position: null,
      referralNumber: null,
      isAmbassador: false,
      showLeaderboard: false, // Добавлено состояние для отображения лидерборда
      showProfile: false // Добавлено состояние для отображения профиля
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

    // Проверка пользователя
    try {
      const response = await axios.post('http://localhost:3000/api/check-user', { username: window.Telegram.WebApp.initDataUnsafe.user.username, telegram_id: window.Telegram.WebApp.initDataUnsafe.user.id });
      this.position = response.data.position;
      this.referralNumber = response.data.referral_number;
      this.isAmbassador = AMBASSADORS.includes(window.Telegram.WebApp.initDataUnsafe.user.username);

      // Сохранение состояния пользователя в localStorage
      localStorage.setItem('userState', JSON.stringify({
        position: this.position,
        referralNumber: this.referralNumber,
        isAmbassador: this.isAmbassador
      }));
    } catch (error) {
      console.error('Error checking user:', error);
    }
  },
  methods: {
    openRef() {
      const userState = JSON.parse(localStorage.getItem('userState'));
      if (userState && userState.position !== null) {
        this.showProfile = true;
      } else {
        this.show = 1;
        window.Telegram.WebApp.BackButton.show();
      }
    },
    openTask() {
      this.show = 2;
      window.Telegram.WebApp.BackButton.show();
    },
    openLeaderboard() {
      if (this.isAmbassador) {
        this.showLeaderboard = true;
      }
    },
    openProfile() {
      this.showProfile = true;
    }
  }
}
</script>

<template>
  <Background />
  <Headers :data="position" />
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
  <Footers @refOpen="openRef" @taskOpen="openTask" @leaderboardOpen="openLeaderboard" @openProfile="openProfile" />
  <Join v-if="show === 1" />
  <Task v-if="show === 2" />
  <Leaderboard v-if="showLeaderboard" />
  <Profile v-if="showProfile" :position="position" @close="showProfile = false" />
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
