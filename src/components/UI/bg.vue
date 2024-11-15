<template>
    <section class="bg">
        <!-- bg -->
    </section>
</template>

<style scoped>
section {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  overflow: hidden;
}

section::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(#000,#0f0,#000);
  animation: animate 5s linear infinite;
}

@keyframes animate {
  0%
  {
    transform: translateY(-100%);
  }
  100%
  {
    transform: translateY(100%);
  }
}
</style>

<script>
function render() {
    const section = document.querySelector('.bg')
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < 300; i++) {
        const span = document.createElement('span')
        span.classList.add('sp')
        Object.assign(span.style, {
            position: "relative",
            display: "block",
            background: '#181818',
            width: 'calc(16vw)',
            height: "calc(15vw)",
            zIndex: '2'
        });
        fragment.appendChild(span)
    }

    section.appendChild(fragment)
}
setTimeout(() => {
    render()
}, 100)
</script>