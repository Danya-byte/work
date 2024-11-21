<script>
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Ref from './ref.vue'
import Task from './task.vue'
import User from './user.vue'
import Join from './join.vue'
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
          const response = await axios.post('https://work-2-tau.vercel.app/api/check-user', { username: user.username })
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
    async joinEarly() {
      await this.fetchUserData()
      const user = window.Telegram.WebApp.initDataUnsafe.user
      if (user && (user.username || user.id)) {
        try {
          const response = await axios.post('https://work-2-tau.vercel.app/api/check-participant', {
            username: user.username,
            telegram_id: user.id
          })

          if (response.data.exists) {
            this.show = 3 // Перенаправляем на профиль пользователя
          } else {
            this.show = 4 // Перенаправляем на страницу регистрации
          }

          this.saveActionToLocalStorage('joinEarly')
          this.saveActionToServer('joinEarly')
        } catch (error) {
          console.error('Error checking participant:', error)
        }
      } else {
        console.error('User data is not available or username/telegram_id is missing')
      }
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
