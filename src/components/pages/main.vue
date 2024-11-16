<script>
import Background from '@/components/UI/bg.vue'
import Headers from '@/components/UI/header.vue'
import Footers from '@/components/UI/footer.vue'
import Ref from './ref.vue'

export default {
  components: {
    Background,
    Headers,
    Footers,
    Ref
  },
  data() {
    return {
      show: 0,
    }
  },
  mounted() {
    if(this.show == 0) {
      window.Telegram.WebApp.BackButton.hide()
    } else {
      window.Telegram.WebApp.BackButton.show()
      window.Telegram.WebApp.BackButton.onClick(() => {
        this.show = 0
      })
    }
  },
  methods: {
    openRef() {
      this.show = 1
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
          <p>2</p>
        </div>
        <div class="nums">
          <p>8</p>
          <p>9</p>
          <p>0</p>
        </div>
      </div>
    </nav>
  </main>
  <Footers @refOpen="openRef" />
  <Ref v-if="show === 1" />
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