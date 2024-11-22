<script>
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Ref from './ref.vue'
import Task from './task.vue'
import User from './user.vue'
import axios from 'axios'

export default {
  components: {
    Background,
    Headers,
    Footers,
    Ref,
    Task,
    User
  },
  data() {
    return {
      show: 0,
      totalMembers: '0000',
      isAmbassador: false,
      showModal: false,
      userState: {
        isRegistered: false,
        position: null,
        refNumber: null,
        referralsCount: null,
        isAmbassador: false
      }
    }
  },
  async mounted() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.MainButton.hide()
      window.Telegram.WebApp.BackButton.onClick(() => {
        this.show = 0
        window.Telegram.WebApp.BackButton.hide()
      })
    }

    try {
      const response = await axios.get('https://work-2-tau.vercel.app/api/total-members')
      this.totalMembers = response.data.totalMembers ? response.data.totalMembers.padStart(4, '0') : '0000'
    } catch (error) {
      console.error('Error fetching total members:', error)
    }

    // Загрузка состояния пользователя из localStorage
    this.loadUserStateFromLocalStorage()
  },
  methods: {
    async fetchUserData() {
      const user = window.Telegram.WebApp.initDataUnsafe.user
      if (user && user.username) {
        try {
          const response = await axios.get(`https://work-2-tau.vercel.app/api/check-user?username=${user.username}`)
          this.userState = response.data
          this.saveUserStateToLocalStorage(this.userState)
          this.saveUserStateToServer(this.userState)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        console.error('User data is not available or username is missing')
      }
    },
    async openRef() {
      await this.fetchUserData()
      const user = window.Telegram.WebApp.initDataUnsafe.user
      if (user && user.username) {
        try {
          const response = await axios.post('https://work-2-tau.vercel.app/api/check-ambassador', { username: user.username })
          this.isAmbassador = response.data.isAmbassador
          if (this.isAmbassador) {
            this.show = 1
            window.Telegram.WebApp.BackButton.show()
          } else {
            this.showModal = true
          }
          this.saveActionToLocalStorage('openRef')
          this.saveActionToServer('openRef')
        } catch (error) {
          console.error('Error checking ambassador status:', error)
        }
      } else {
        console.error('User data is not available or username is missing')
        this.showModal = true
      }
    },
    async openTask() {
      await this.fetchUserData()
      this.show = 2
      window.Telegram.WebApp.BackButton.show()
      this.saveActionToLocalStorage('openTask')
      this.saveActionToServer('openTask')
    },
    async openUserProfile() {
      await this.fetchUserData()
      this.show = 3
      this.saveActionToLocalStorage('openUserProfile')
      this.saveActionToServer('openUserProfile')
    },
    closeModal() {
      this.showModal = false
    },
    saveUserStateToLocalStorage(userState) {
      localStorage.setItem('userState', JSON.stringify(userState))
    },
    loadUserStateFromLocalStorage() {
      const userState = localStorage.getItem('userState')
      if (userState) {
        this.userState = JSON.parse(userState)
      }
    },
    saveActionToLocalStorage(action) {
      const actions = JSON.parse(localStorage.getItem('userActions') || '[]')
      actions.push({ action, timestamp: new Date().toISOString() })
      localStorage.setItem('userActions', JSON.stringify(actions))
    },
    async saveUserStateToServer(userState) {
      try {
        await axios.post('https://work-2-tau.vercel.app/api/save-user-state', userState)
      } catch (error) {
        console.error('Error saving user state to server:', error)
      }
    },
    async saveActionToServer(action) {
      try {
        await axios.post('https://work-2-tau.vercel.app/api/save-action', { action, timestamp: new Date().toISOString() })
      } catch (error) {
        console.error('Error saving action to server:', error)
      }
    }
  }
}
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
  <User v-if="show === 3" />
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
