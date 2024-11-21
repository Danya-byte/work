<script>
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Ref from './ref.vue'
import Task from './task.vue'
import User from './user.vue' // Импортируем компонент user.vue
import Join from './join.vue' // Импортируем компонент join.vue
import axios from 'axios'

export default {
  components: {
    Background,
    Headers,
    Footers,
    Ref,
    Task,
    User,
    Join
  },
  data() {
    return {
      show: 0,
      totalMembers: '0000', // По умолчанию отображаем 0000
      isAmbassador: false, // Флаг, указывающий, является ли пользователь амбассадором
      showModal: false, // Флаг для отображения модального окна
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
      const response = await axios.get('http://localhost:3000/api/total-members')
      this.totalMembers = response.data.totalMembers ? response.data.totalMembers.padStart(4, '0') : '0000' // Дополняем нулями до 4 символов
    } catch (error) {
      console.error('Error fetching total members:', error)
    }
  },
  methods: {
    async openRef() {
      const user = window.Telegram.WebApp.initDataUnsafe.user
      if (user && user.username) {
        try {
          const response = await axios.post('http://localhost:3000/api/check-ambassador', { username: user.username })
          this.isAmbassador = response.data.isAmbassador
          if (this.isAmbassador) {
            this.show = 1
            window.Telegram.WebApp.BackButton.show()
          } else {
            this.showModal = true
          }
        } catch (error) {
          console.error('Error checking ambassador status:', error)
        }
      } else {
        console.error('User data is not available or username is missing')
        this.showModal = true
      }
    },
    openTask() {
      this.show = 2
      window.Telegram.WebApp.BackButton.show()
    },
    closeModal() {
      this.showModal = false
    },
    openUserProfile() {
      this.show = 3 // Переключаем на окно user.vue
    },
    joinEarly() {
      this.show = 4 // Переключаем на окно join.vue
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
  <User v-if="show === 3" /> <!-- Отображаем компонент user.vue -->
  <Join v-if="show === 4" /> <!-- Отображаем компонент join.vue -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <p>Very soon</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
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

.modal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal-content p {
  margin-bottom: 20px;
}

.modal-content button {
  padding: 10px 20px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>



