<template>
    <div class="task-board open">
      <div style="display: grid; align-items: center; justify-content: center;">
        <img width="65px" height="65px" src="https://em-content.zobj.net/source/telegram/386/sparkles_2728.webp" />
      </div>
      <div class="leader-title">
        <h1 style="color: #f0f0f0; text-align: center;">Tasks</h1>
      </div>
      <section class="tasks">
        <div class="option">
            <div class="eci">
                <div>
                    <img width="60px" height="60px" src="../../assets/ECI.png" />
                    <h3>ECI</h3>
                </div>
                <div>
                    <p>Earn ECI for <br> complete the tasks</p>
                </div>
            </div>
            <div class="ewi">
                <div>
                    <img width="60px" height="60px" src="../../assets/EWI.png" />
                    <h3>EWI</h3>
                </div>
                <div>
                    <p>Earn EWI for <br> complete the tasks</p>
                </div>
            </div>
            <div class="ewe">
                <div>
                    <img width="60px" height="60px" src="../../assets/EWE.png" />
                    <h3>EWE</h3>
                </div>
                <div>
                    <p>Earn EWE for <br> complete the tasks</p>
                </div>
            </div>
        </div>
        <ul class="refs">
            <li v-for="(item) in data" :key="item.id">
                <div class="about">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <img v-if="item.type == 'Channel'" style="border-radius: 50px;" width="40px" height="40px" src="../../assets/telegramlogo.jpeg" @click="close" />
                        <img v-if="item.type == 'Transaction'" style="border-radius: 50px;" width="40px" height="40px" src="../../assets/telegramlogo.jpeg" @click="close" />
                    </div>
                    <div>
                        <h3 style="font-family: Quicksand; color: #fff;">{{ item.type }}</h3>
                        <p style="padding: 0; font-size: 14px; color: #aaaaaa; background: 0;">{{ item.reward }}</p>
                    </div>
                </div>
                <div style="display: grid; align-items: center;">
                    <h1 style="font-family: Quicksand; font-size: 18px; font-weight: 600; color: #3390ec;">Start</h1>
                </div>
            </li>
        </ul>
    </section>
    </div>
</template>

<style scoped>
.task-board {
    display: none;
    position: absolute;
    width: 100vw;
    height: calc(100vh - 80px);
    z-index: 1000;
    background: #212121;
}

.task-board.open {
    display: block;
    animation: open 0.5s ease forwards;
    bottom: -200px;
}

.task-board.close {
    animation: close 0.5s ease forwards;
    bottom: -200px;
}

@keyframes open {
0% {
    transform: translateY(100%);
}
100% {
    transform: translateY(0);
    bottom: 0;
}
}

@keyframes close {
    from {
        transform: translateY(0);
        bottom: 0;
    }
    to {
        transform: translateY(100%);
        bottom: -200px;
    }
}

.refs {
    margin-top: 15px;
    display: grid;
    gap: 20px;
}

.refs li {
    padding: 0 5px 20px 5px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #181818;
}

.about {
    display: flex;
    gap: 10px;
    align-items: center;
}

.option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-x: auto;
    gap: 10px;
}

.tasks {
    padding: 10px;
    margin-top: 10px;
}

.ewe {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: linear-gradient(45deg, #fee4b4, #622020);
    border-radius: 10px;
    gap: 10px;
    min-width: 250px;
}

.ewe h3 {
    text-align: center;
    font-family: 'Quicksand';
    color: #faebd7;
}

.ewe p {
    text-align: center;
    color: #fff8dc;
    font-family: 'Quicksand';
    font-weight: 600;
}

.ewi {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: linear-gradient(45deg, #39596f, #c1f8fe);
    border-radius: 10px;
    gap: 10px;
    min-width: 250px;
}

.ewi h3 {
    text-align: center;
    font-family: 'Quicksand';
    color: #ffffff;
}

.ewi p {
    text-align: center;
    color: #ffffff;
    font-family: 'Quicksand';
    font-weight: 600;
}

.eci {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: linear-gradient(45deg, #f4c6af, #96836d);
    border-radius: 10px;
    gap: 10px;
    min-width: 250px;
}

.eci h3 {
    text-align: center;
    font-family: 'Quicksand';
    color: #ffffff;
}

.eci p {
    text-align: center;
    color: #ffffff;
    font-family: 'Quicksand';
    font-weight: 600;
}
</style>

<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    type: 'Channel',
                    reward: '+500 EWE'
                },
                {
                    id: 2,
                    type: 'Channel',
                    reward: '+1000 EWI'
                }
            ]
        }
    },
    methods: {
        close() {
            document.querySelector('.leader-board').classList.add('close')  
            setTimeout(() => {
                document.querySelector('#app').removeChild(document.querySelector('.leader-board'))
            }, 500)
        }
    }
}
</script>