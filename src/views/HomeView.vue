<template>
  <div 
    class="home" 
    id="background" 
    tabindex="0" 
    @keydown.space="shoot"
    @keydown.left="state.mouseDown ? null : goLeft()"
    @keydown.right="state.mouseDown ? null : goRight()"
    @keydown.up="state.mouseDown ? null : goUp()"
    @keydown.down="state.mouseDown ? null : goDown()"
    @keydown.esc="pauseGame"
    @mouseup="mouseUp" 
    @keyup.left="mouseUp"
    @keyup.right="mouseUp"
    @keyup.up="mouseUp"
    @keyup.down="mouseUp"
  >
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
    <instructions-view v-if="state.instructionsOpen" id="instructions" @closeInstructions="closeInstructions"/>
    <body @keyup.left="goLeft" :style="{ opacity: `${state.bodyOpacity}%` }">

      <!-- TITLE SCREEN TEXT -->
      <div class="title-screen-text" :style="{ opacity: `${state.titleTextOpacity}%` }">
        <div v-if="!gameRunning">
          <h1 
            v-if="state.shipCount > 0" 
            id="game-title" 
            class="title-text"
          >
            STAR GAME 77
          </h1>
          <h1 
            v-else
            id="game-over" 
            class="title-text"
          >
            GAME OVER
          </h1>
        </div>
        <div 
          id="startup-btns"
          v-if="!gameRunning"
        >
          <h2 
            id="instructions-btn" 
            class="btn-border btn-hover" 
            @click="openInstructions" 
          >
            INSTRUCTIONS
          </h2>
          <h2 
            id="start-btn" 
            class="btn-border btn-hover" 
            @click="runGame"
          >
            START
          </h2>
        </div>
      </div>

      <div v-if="gameRunning">
        <h2 id="ship-count" class="text">{{ state.shipCount }}</h2>
        <img id="ship-count-img" src="../assets/x-wing-200.png" />
        <h2 id="points" class="text">{{ state.points }}&nbsp; &nbsp; points</h2>
        <h2 
          id="pause-btn" 
          class="btn-border btn-hover text" 
          @click="pauseGame" 
          @tap="pauseGame">
          {{ state.pauseText }}
        </h2>
      </div>

      
      <h2 v-if="!isMusicLoaded || !isBlastSoundLoaded" class="loading">Music and Sounds loading...</h2>

      
      <img 
        src="../assets/space.png" 
        id="background-image" 
        :style="{ top: `${20 - xWing.y}vh`, left: `${xWing.x / 10 * -1}vw` }">
      <div id="btns" v-if="gameRunning">
        <div id="up" class="btn">
          <img alt="up" src="../assets/up-arrow-btn.png" @mousedown="goUp" @touchstart="goUp" @touchend="mouseUp"/>
        </div>
        <div id="down" class="btn">
          <img alt="down" src="../assets/down-arrow-btn.png" @mousedown="goDown" @touchstart="goDown" @touchend="mouseUp"/>
        </div>
        <div id="left" class="btn">
          <img alt="left" src="../assets/left-arrow-btn.png" @mousedown="goLeft" @touchstart="goLeft" @touchend="mouseUp"/>
        </div>
        <div id="right" class="btn">
          <img alt="right" src="../assets/right-arrow-btn.png" @mousedown="goRight" @touchstart="goRight" @touchend="mouseUp"/>
        </div>
        <div id="laser-btn2" class="btn">
          <img alt="laser" src="../assets/laser-ball-btn.png" @click="shoot" @touchstart="shoot"/>
        </div>
      </div>

      <div 
        v-if="gameRunning"
        id="ship" 
        :style="{ 
          top: `${xWing.y}vh`, 
          transform: `rotate(${state.tilt}deg)`, 
          opacity: `${state.shipOpacity}%`,
          left: `${state.shipLeft}vw`
        }">
        <img v-if="!xWing.isHit" id="ship-img" :style="{width: `${state.shipWidth}vw` }" src="../assets/x-wing-200.png" />
        <img v-else src="../assets/XwingExplosion-220.png" :style="{ width: `${state.explosionWidth}vw`}" />
      </div>

      <div
      v-if="state.lasers[0].isFired"
        id="laser"
        :style="{ top: `${state.lasers[0].y}vh`, left: `${state.lasers[0].x}vw`, width:`${state.lasers[0].width}vw` }"
      >
        <img
          alt="laser"
          :style="{ width:`${state.lasers[0].width}vw` }"
          src="../assets/laser-ball.png"
        />
      </div>

      <div
      v-if="state.lasers[1].isFired"
        id="laser2"
        :style="{ top: `${state.lasers[1].y}vh`, left: `${state.lasers[1].x}vw`, width:`${state.lasers[1].width}vw` }"
      >
        <img
          alt="laser"
          :style="{ width:`${state.lasers[1].width}vw` }"
          src="../assets/laser-ball.png"
        />
      </div>
      <div v-if="gameRunning">
        <div v-for="(tie, key) in state.tieFighters" :key="key">
          <tie-fighter
            :xWing="xWing"
            :lasers="state.lasers"
            :isPaused="state.isPaused"
            @blasted="gotOne"
            @collided="crashed" 
          />
        </div>
        <chase-view   
          :xWing="xWing"
          :lasers="state.lasers"
          :isPaused="state.isPaused"
          @blasted="gotOne"
        />

        <div v-for="index in friendCount" :key="index">
          <friend-view 
            :xWing="xWing"
            :lasers="state.lasers"
            :isPaused="state.isPaused"
            :gameRunning="gameRunning"  
          />
        </div>

        <div id="death-star" :style="{ left: `${deathStarX}vw`, top: `${deathStarY}vw` }">
          <img id="death-star-img" :style="{ width: `${state.deathStarWidth}vw` }" src="../assets/death-star.png" />
        </div>      
        <!-- <div id="star-destroyer">
          <img id="star-destroyer-img" src="../assets/StarDestroyer.png" />
        </div>       -->
      </div>

    </body>
  </div>
</template>


<script setup>
// @ is an alias to /src
import { computed, reactive, onMounted, ref } from "vue";
import TieFighter from "@/components/TieFighter.vue";
import ChaseView from "@/components/ChaseView.vue";
import FriendView from "@/components/FriendView.vue";
import InstructionsView from "@/components/InstructionsView.vue";
import BlastSound from "@/assets/BlastSound.mp3";
import ExplosionSound from "@/assets/Explosion.mp3";
import ExplosionGlassSound from "@/assets/ExplosionGlass.mp3";
import TieFighterMusic from "@/assets/TieFighterMusic.mp3";
//import { useScreenOrientation } from '@vueuse/core';

const state = reactive({
  bodyOpacity: 100,
  explosionWidth: 22,
  deathStarWidth: 15,
  instructionsOpen: false,
  instructionsClosing: false,
  isPaused: false,
  pauseText: 'PAUSE',
  titleTextOpacity: 0,
  lasers: [{
      x: 48,
      y: -20,
      width: 5,
      isFired: false
    },
    {
      x: 48,
      y: -20,
      width: 5,
      isFired: false
    }],
  tieX: 95,
  tieY: 20,
  mouseDown: true,
  points: 0,
  tieFighters: new Array(8),
  tilt: 0,
  shipCount: 5
});

const friendCount = ref(0);

// const {
//   lockOrientation
// } = useScreenOrientation()

const xWing = reactive({
  isHit: false,
  isInvincible: false,
  x: 150,
  y: 70
});

const deathStarX = computed(() => xWing.x / 12 * -1 + 50);
const deathStarY = computed(() => xWing.y / 12 * -1 + 15);
const gameRunning = ref(false);





const blast1 = ref(new Audio(BlastSound));
const blast2 = ref(new Audio(BlastSound));

const explosion = ref(new Audio(ExplosionSound));
const explosionGlass = ref(new Audio(ExplosionGlassSound));
const music = ref(new Audio(TieFighterMusic)); 

const isPlayingMusic = reactive({});
const isPlayingBlast1 = reactive({});
const isPlayingExplosion = reactive({});

function gotOne(isSavedFriend) {
  state.lasers[0].isFired = false;
  state.lasers[1].isFired = false;
  playExplosionSound();
  explosion.value.play();
  if (isSavedFriend) {
    state.points += 500;
    friendCount.value++;
  } else {
    state.points += 100;
  }
}

async function crashed() {
  if (xWing.isInvincible)
    return;

  playExplosionSound();
  state.shipCount--;
  state.points += 100;
  xWing.isHit = true;
  for (let max = 26, min = 22; max > 10; max -= 2, min -= 2) {
    for (let i = max; i > min; i -= 1) {
      state.explosionWidth = i;
      await new Promise((r) => setTimeout(r, 20));
    }
    for (let i = min; i < max; i += 1) {
      state.explosionWidth = i;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
  xWing.isHit = false;
  runInvincibility();
  if (state.shipCount < 1) {
    gameOver();
  }
  fadeInShip();
}

async function runInvincibility() {
  xWing.isInvincible = true;
  for (let i = 0; i < 30; i++) {
    state.shipOpacity = 350;
    await new Promise((r) => setTimeout(r, 30));
    state.shipOpacity = 70;
    await new Promise((r) => setTimeout(r, 30));
  }
  state.shipOpacity = 100;
  xWing.isInvincible = false;
}

async function openInstructions() {
  state.instructionsOpen = true;
  for (let i = 100; i >= 60; i--) {
    state.bodyOpacity = i;
    await new Promise((r) => setTimeout(r, 80));
    if (state.instructionsOpen === false || state.instructionsClosing === true) {
      break;
    }
  }
}

async function closeInstructions() {
  state.instructionsClosing = true
  for (let i = state.bodyOpacity; i <= 100; i++) {
    state.bodyOpacity = i;
    await new Promise((r) => setTimeout(r, 15));
    if (state.instructionsOpen === false) {
      break;
    }
  }
  state.instructionsOpen = false;
  state.instructionsClosing = false;
}

async function gameOver() {
  gameRunning.value = false;
  friendCount.value = 0;
  fadeinTitleText();
  music.value.pause();
}

function pauseGame() {
  state.isPaused = !state.isPaused;
  state.pauseText = state.isPaused ? 'RESUME' : 'PAUSE';
  if (state.isPaused) {
    music.value.pause();
  } else {
    playMusic();
  }
}

async function fadeinTitleText() {
  for (let i = 0; i <= 100; i++) {
    state.titleTextOpacity = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function fadeInShip() {
  for (let i = 140, j = -20; i >= 20; i -= 2, j += 1) {
    state.shipWidth = i;
    state.shipLeft = j;
    await new Promise((r) => setTimeout(r, 2));
  }
}

async function playMusic() {
  music.value.play();
  while (!music.value.paused) {
    await new Promise((r) => setTimeout(r, 5000));
  }
  if (gameRunning.value && !state.isPaused) {
    playMusic();
  }
}

async function playBlastSound() {
  console.log('home playBlastSound')
  if (isPlayingBlast1.value == false) {
    isPlayingBlast1.value = true;
    blast1.value.play();
    await new Promise((r) => setTimeout(r, 500));
    isPlayingBlast1.value = false;
  } else {
    blast2.value.play();
  }
}

async function playExplosionSound() {
  if (isPlayingExplosion.value == false) {
    isPlayingExplosion.value = true;
    explosion.value.play();
    await new Promise((r) => setTimeout(r, 1500));
    isPlayingExplosion.value = false;
  } else {
    explosionGlass.value.play();
  }
}

async function goUp() {
  state.mouseDown = true;
  let unit = 0.1;
  for (let i = xWing.y; i > 50; i -= unit) {
    unit += 0.1;
    if (!state.mouseDown) {
      tiltCenter();
      break;
    }
    xWing.y = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goDown() {
  state.mouseDown = true;
  let unit = 0.1;
  for (let i = xWing.y; i < 84; i += unit) {
    unit += 0.1;
    if (!state.mouseDown) {
      tiltCenter();
      break;
    }
    xWing.y = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goRight() {
  if (xWing.isHit === false) {
    tiltRight(20);
    state.mouseDown = true;
    let unit = 0.5;
    for (let i = xWing.x; i < 300; i += unit) {
      unit += 0.3;
      if (!state.mouseDown) {
        tiltCenter();
        break;
      }
      xWing.x = i;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

async function goLeft() {
  if (xWing.isHit === false) {
    tiltLeft(-20);
    state.mouseDown = true;
    let unit = 0.5;
    for (let i = xWing.x; i > 0; i -= unit) {
      unit += 0.3;
      if (!state.mouseDown) {
        tiltCenter();
        break;
      }
      xWing.x = i;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

async function tiltRight(degrees) {
  for (let i = state.tilt; i < degrees; i++) {
    state.tilt = i;
    await new Promise((r) => setTimeout(r, 5));
  }
}

async function tiltLeft(degrees) {
  for (let i = state.tilt; i > degrees; i--) {
    state.tilt = i;
    await new Promise((r) => setTimeout(r, 5));
  }
}

async function tiltCenter() {
  if (state.tilt < 0)
    tiltRight(0);
  else
    tiltLeft(0);
}

function mouseUp() {
  state.mouseDown = false;
  tiltCenter();
}

async function shoot() {
  if (state.isPaused)
    return;

  fireLaser(state.lasers[0].isFired ? 1 : 0);
}

async function fireLaser(n) {
  playBlastSound();
  state.lasers[n].y = xWing.y;
  state.lasers[n].isFired = true;
  for (let y = xWing.y - 5, x = 47.5, w = 5; y > xWing.y - 50; y -= 1, x += .08, w -= .15) {
    if (!state.lasers[n].isFired)
      break;

    state.lasers[n].width = w;
    state.lasers[n].x = x;
    state.lasers[n].y = y;
    await new Promise((r) => setTimeout(r, 1));
  }
  state.lasers[n].isFired = false;
}

async function runGame() {
  friendCount.value = 0;
  state.shipCount = 5;
  state.points = 0;
  gameRunning.value = true;
  playMusic();
  fadeInShip();
  for (let i = 10; i < 80; i += .01) {
    while (state.isPaused === true) {
      await new Promise((r) => setTimeout(r, 100));
    }
    state.deathStarWidth = i;
    if (gameRunning.value === false) {
      break;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}

const isMusicLoaded = ref(false);
const isBlastSoundLoaded = ref(false);

onMounted(async () => {
  //lockOrientation('landscape');
  fadeinTitleText();
  isPlayingMusic.value = false;
  isPlayingBlast1.value = false;
  isPlayingExplosion.value = false;
  music.value.oncanplaythrough = () => {
    isMusicLoaded.value = true;
    console.log('isMusicLoaded', isMusicLoaded.value)
  };
  blast1.value.oncanplaythrough = () => {
    isBlastSoundLoaded.value = true;
    console.log('isBlastSoundLoaded', isBlastSoundLoaded.value)
  };
});

</script>

<style scoped>
body {
  position: fixed;
  top: 0px;
  left: 0px;
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;
  font-family: Monoton;
}

#background-image {
  position: fixed;
  width: 160vw;
  z-index: 0;
}

#startup-btns {
  display: flex;
  justify-content: center;
  font-size: 1.5vw;
}

#instructions-btn {
  margin-right: 5px;
  font-weight: bold;
}

#instructions {
  width: 90vw;
}

#start-btn {
  margin-left: 5px;
  font-weight: bold;
}

#startup-btns:hover {
  cursor: pointer;
}

.btn-hover:hover {
  color: rgb(0, 255, 0);
}

.btn-border {
  color: rgb(1, 200, 1);
  border: solid;
  border-radius: 10px;
  padding: 0px 10px;
}

.title-screen-text {
  top: 30vh;
  left: 11vw;
  position: fixed; 
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-text {
  font-size: 10vw;
  color: brown;
  font-weight: bold;
}

.text {
  position: fixed;
  color: rgb(255, 247, 155);
  z-index: 100;
  margin-top: 10px;
  font-size: 1.5vw;
  opacity: 60%;
  font-weight: bold;
}

#game-title {
  /* left: 11vw; */
}

#game-over {
  left: 15vw;
}

#ship-count {
  left: 10px;
  top: 0px;
}

#ship-count-img {
  left: 35px;
  top: 10px;
  width: 50px;
  position: fixed;
  z-index: 101;
  opacity: 80%;
}

#points {
  right: 10px;
  top: 0px;
}

#pause-btn {
  right:10px;
  top: 37px;
  color: rgb(1, 200, 1);
}

#pause-btn:hover {
  cursor: pointer;
}

.loading {
  top: 0px;
  left: 50%;
  transform: translate(-50%);
  color: rgb(255, 247, 155);
  position: fixed;
  z-index: 101;
  opacity: 80%;
  font-weight: bold;
}

#ship {
  position: fixed;
  top: 70vh;
  left: 40vw;
  width: 20vw;
  z-index: 100;
}

#laser {
  position: fixed;
  left: 100px;
  z-index: 103;
}

#laser2 {
  position: fixed;
  z-index: 103;
}

#up:hover, 
#down:hover, 
#left:hover, 
#right:hover,
#laser-btn:hover {
  opacity: 100%;
}

#btns:hover {
  cursor: pointer;
}

.btn {
  position: fixed;
  z-index: 101;
  opacity: 70%;
}

#up {
  left: 62px;
  bottom: 105px;
}

#down {
  left: 60px;
  bottom: 5px;
}

#left {
  left: 10px;
  bottom: 55px;
}

#right {
  left: 115px;
  bottom: 55px;
}

#laser-btn {
  left: 71px;
  bottom: 67px;
}

#laser-btn2 {
  right: 40px;
  bottom: 30px;
}

#death-star {
  position: fixed;
  top: 10vh;
  z-index: 3;
}

#death-star-img {
  width: 20vw;
}

#star-destroyer {
  position: fixed;
  top: 30vh;
  left: 60vw;
  z-index: 5;
}

#star-destroyer-img {
  width: 20vw;
}

@media only screen and (min-width: 1400px) {
  #laser-btn2 {
    right: auto;
    left: 70px;
    bottom: 66px;
  }
}
</style>
