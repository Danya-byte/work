<template>
    <div class="user">
        <button class="back" @click="back">Back</button>
        <div style="text-align: center;">
            <img src="https://em-content.zobj.net/source/telegram/386/people-hugging_1fac2.webp" width="150vw">
        </div>
        <h2 style="font-family: Quicksand; text-align: center; color: #fff;">Your Referals</h2>
        <div class="refbtn">
            <button class="invite">Invite Ref</button>
            <button class="copy"><img src="https://i.postimg.cc/kXtBSBw0/1-FAAF8-BE-B308-4-DD9-AFC6-F42-C1-ACDEEF4.png" width="25vw"></button>
        </div>
    </div>
</template>

<style scoped>
.back {
  background-color: #444444;
  border-radius: 50%;
  border: none;
  color: white;
  width: 8vw;
  height: 8vw;
  float: right;
  margin-top: 5vw;
  margin-right: 2vw;
}
.refbtn {
    position: absolute;
    bottom: 0;
    margin-bottom: 20px;
}
.invite {
    background-color: rgb(102, 204, 170, 1.00);
    width: 65vw;
    height: 50px;
    border-radius: 15px;
    border: none;
    font-family: Inter;
    color: white;
    font-size: 16px;
    cursor: pointer;
}
.copy {
    background-color: rgb(102, 204, 170, 1.00);
    position: absolute;
    bottom: 0;
    width: 15vw;
    height: 50px;
    border-radius: 15px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
}

.user {
    padding: 10%;
    position: relative;
    z-index: 999;
    height: 100vh;
    background: #212121;
    animation: open 0.5s ease forwards;
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
</style>
