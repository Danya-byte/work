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
  <User v-if="show === 3" />
  <Join v-if="show === 4" />
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <p>You are not an ambassador.</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
  <div v-if="showJoinModal" class="join-modal">
    <div class="join-modal-content">
      <p v-if="userInfo">You are already in the database. Your position: {{ userInfo.position }}.</p>
      <p v-else>You are not in the database.</p>
      <button v-if="userInfo" @click="openUserProfile">Profile</button>
      <button v-else @click="joinEarly">Join</button>
    </div>
  </div>
</template>

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
      userInfo: null,
      showJoinModal: false,
    }
  },
  async mounted() {
    window.Telegram.WebApp.MainButton.hide()
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.show = 0
      window.Telegram.WebApp.BackButton.hide()
    })

    try {
      const response = await axios.get('http://localhost:3000/api/total-members')
      this.totalMembers = response.data.totalMembers.padStart(4, '0')
    } catch (error) {
      console.error('Error fetching total members:', error)
    }

    const username = window.Telegram.WebApp.initDataUnsafe.user.username
    try {
      const response = await axios.post('http://localhost:3000/api/check-ambassador', { username })
      this.isAmbassador = response.data.isAmbassador
    } catch (error) {
      console.error('Error checking ambassador status:', error)
    }

    await this.checkUserInDatabase()
  },
  methods: {
    openRef() {
      if (this.isAmbassador) {
        this.show = 1
        window.Telegram.WebApp.BackButton.show()
      } else {
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
    async checkUserInDatabase() {
      const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id
      try {
        const response = await axios.post('http://localhost:3000/api/check-user', { telegram_id: telegramId })
        if (response.data.position) {
          this.userInfo = response.data
          this.showJoinModal = true
        } else {
          this.showJoinModal = false
        }
      } catch (error) {
        console.error('Error checking user in database:', error)
      }
    },
    openUserProfile() {
      this.show = 3
    },
    joinEarly() {
      if (!this.showJoinModal) {
        this.show = 4
      }
    }
  }
}
</script>

<style scoped>
/* Styles remain unchanged */
</style>
