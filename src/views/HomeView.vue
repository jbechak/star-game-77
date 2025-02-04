<template>
  <div 
    class="home" 
    id="background" 
    tabindex="0" 
    @keydown.space="shoot"
    @keydown.left="mouseDown ? null : goLeft()"
    @keydown.right="mouseDown ? null : goRight()"
    @keydown.up="mouseDown ? null : goUp()"
    @keydown.down="mouseDown ? null : goDown()"
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
    <instructions-view v-if="instructionsOpen" id="instructions" @closeInstructions="closeInstructions"/>
    <body :style="{ opacity: `${bodyOpacity}%` }">

      <!-- BACKGROUND-->
      <img 
        src="../assets/space.png" 
        id="background-image" 
        :style="{ top: `${20 - xWing.y}vh`, left: `${xWing.x / 10 * -1}vw` }"
      >

      <!-- TITLE SCREEN TEXT -->
      <div v-if="!gameRunning" class="title-screen-text" :style="{ opacity: `${titleTextOpacity}%` }">
        <h1 
          v-if="shipCount > 0" 
          id="game-title" 
          class="title-text"
        >
          {{ labels.STAR_GAME_77 }}
        </h1>
        <h1 
          v-else
          id="game-over" 
          class="title-text"
        >
          {{ labels.GAME_OVER }}
        </h1>
        <div id="startup-btns">
          <h2 
            id="instructions-btn" 
            class="btn-border btn-hover" 
            @click="openInstructions" 
          >
            {{ labels.INSTRUCTIONS }}
          </h2>
          <h2 
            id="start-btn" 
            class="btn-border btn-hover" 
            @click="runGame"
          >
            {{ labels.START }}
          </h2>
        </div>
      </div>

      <!-- TOP OF SCREEN INFO -->
      <div v-if="gameRunning">
        <h2 id="ship-count" class="text">{{ shipCount }}</h2>
        <img id="ship-count-img" src="../assets/x-wing-200.png" />
        <h2 id="points" class="text">{{ points }}&nbsp; &nbsp; points</h2>
        <h2 
          id="pause-btn" 
          class="btn-border btn-hover text" 
          @click="pauseGame" 
          @tap="pauseGame">
          {{ pauseText }}
        </h2>
      </div>
      <h2 v-if="!isMusicLoaded || !isBlastSoundLoaded" class="loading">Music and Sounds loading...</h2>


      <div id="btns" v-if="gameRunning">
        
        <!-- GAME CONTROLS -->
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

        <!-- X-WING --> 
        <div
          id="ship" 
          :style="{ 
            top: `${xWing.y}vh`, 
            transform: `rotate(${shipTilt}deg)`, 
            opacity: `${shipOpacity}%`,
            left: `${shipLeft}vw`
          }">
          <img v-if="!xWing.isHit" id="ship-img" :style="{width: `${shipWidth}vw` }" src="../assets/x-wing-200.png" />
          <img v-else src="../assets/XwingExplosion-220.png" :style="{ width: `${explosionWidth}vw`}" />
        </div>

        <!-- OTHER SHIPS -->
        <div v-for="(tie, key) in tieFighters" :key="key">
          <tie-fighter
            :xWing="xWing"
            :lasers="lasers"
            :isPaused="isPaused"
            @blasted="gotOne"
            @collided="crashed" 
          />
        </div>
        <chase-view   
          :xWing="xWing"
          :lasers="lasers"
          :isPaused="isPaused"
          @blasted="gotOne"
        />
        <div v-for="index in friendCount" :key="index">
          <friend-view 
            :xWing="xWing"
            :lasers="lasers"
            :isPaused="isPaused"
            :gameRunning="gameRunning"  
          />
        </div>
        <div id="death-star" :style="{ left: `${deathStar.x}vw`, top: `${deathStar.y}vw` }">
          <img id="death-star-img" :style="{ width: `${deathStarWidth}vw` }" src="../assets/death-star.png" />
        </div>      

         <!-- STAR DESTROYER -->
        <div 
          v-if="showStarDestroyer" 
          id="star-destroyer" 
          class="star-destroyer"
          :style="{ left: `${starDestroyer.x}vw`, top: `${starDestroyer.y}vw`, filter: `saturate(${sdHits * 500}%)` }"
        >
          <img id="star-destroyer-img" :style="{ width: `${starDestroyerWidth}vw` }" src="../assets/StarDestroyer.png" />
        </div>      
        <div 
          v-if="showStarDestroyerExplosion" 
          class="star-destroyer-explosion"
          :style="{ left: `${starDestroyerExplosion.x}vw`, top: `${starDestroyerExplosion.y}vw`, filter: `saturate(${starDestroyerExplosionWidth * 10}%)` }"
        >
          <img src="../assets/explosion2.png" :style="{ width: `${starDestroyerExplosionWidth}vw` }" />
        </div>
        <h3 
          class="point-reward" 
          v-if="showStarDestroyerReward" 
          :style="
            { 
              top: `${starDestroyerPoints.y}vh`, 
              left: `${starDestroyerPoints.x}vw`,
              opacity: `${starDestroyerPoints.opacity}%` 
            }">
          +800
        </h3>
      </div>

      <!-- LASER -->
      <div v-for="(laser, index) in lasers" :key="index">
        <div
          v-if="laser.isFired"
          class="laser"
          :style="{ top: `${laser.y}vh`, left: `${laser.x}vw`, width:`${laser.width}vw`}"
        >
          <img
            alt="laser"
            :style="{ width:`${laser.width}vw` }"
            src="../assets/laser-ball.png"
          />
        </div>
      </div>

      <div
        v-if="starDestroyerLaser.isFired"
        class="laser"
        :style="{ top: `${starDestroyerLaser.y}vh`, left: `${starDestroyerLaser.x}vw`, width:`${starDestroyerLaser.width}vw`, zIndex: `${starDestroyerLaser.z + 100}`}"
      >
        <img
          alt="laser"
          :style="{ width:`${starDestroyerLaser.width}vw` }"
          src="../assets/laser-ball.png"
        />
      </div>


    </body>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted, ref } from "vue";
import TieFighter from "@/components/TieFighter.vue";
import ChaseView from "@/components/ChaseView.vue";
import FriendView from "@/components/FriendView.vue";
import InstructionsView from "@/components/InstructionsView.vue";
import BlastSound from "@/assets/BlastSound.mp3";
import ExplosionSound from "@/assets/Explosion.mp3";
import ExplosionGlassSound from "@/assets/ExplosionGlass.mp3";
import TieFighterMusic from "@/assets/TieFighterMusic.mp3";
// import { pauseWhileTrue } from "@/helpers";
//import { useScreenOrientation } from '@vueuse/core';

const bodyOpacity = ref(100);
const titleTextOpacity = ref(0);
const explosionWidth = ref(22);
const deathStarWidth = ref(15);

const mouseDown = ref(true);
const instructionsOpen = ref(false);
const instructionsClosing = ref(false);
const isPaused = ref(false);
const points = ref(0);
const tieFighters = ref(new Array(8));

const shipTilt = ref(0);
const shipWidth = ref(null);
const shipLeft = ref(null);
const shipCount = ref(5);
const shipOpacity = ref(100);

const labels = {
  STAR_GAME_77: 'STAR GAME 77',
  GAME_OVER: 'GAME OVER',
  INSTRUCTIONS: 'INSTRUCTIONS',
  START: 'START',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
};

const pauseText = computed(() => isPaused.value ? labels.RESUME : labels.PAUSE);

const defaultLaser = {
  x: null,
  y: null,
  z: null,
  width: null,
  isFired: false,
}

const lasers = ref([
  {
    x: 48,
    y: -20,
    z: 100,
    width: 5,
    isFired: false,
  },
  {
    x: 48,
    y: -20,
    z: 100,
    width: 5,
    isFired: false,
  }
]);

const starDestroyerLaser = reactive({});
Object.assign(starDestroyerLaser, defaultLaser);

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

const deathStar = computed(() => ({
  x: xWing.x / 12 * -1 + 50,
  y: xWing.y / 12 * -1 + 15
}));

const showStarDestroyer = ref(false);
const starDestroyerWidth = ref(0);
const starDestroyerAbsolute = reactive({
  x: 70,
  y: 30
});

const starDestroyer = computed(() => ({
  x: xWing.x / 7 * -1 + starDestroyerAbsolute.x,
  y: xWing.y / 7 * -1 + starDestroyerAbsolute.y
}));

const gameRunning = ref(false);

const blast1 = ref(new Audio(BlastSound));
const blast2 = ref(new Audio(BlastSound));

const explosion = ref(new Audio(ExplosionSound));
const explosionGlass = ref(new Audio(ExplosionGlassSound));
const music = ref(new Audio(TieFighterMusic)); 

const isPlayingMusic = reactive({});
const isPlayingBlast1 = reactive({});
const isPlayingExplosion = reactive({});

//Text and things
async function openInstructions() {
  instructionsOpen.value = true;
  for (let i = 100; i >= 60; i--) {
    bodyOpacity.value = i;
    await new Promise((r) => setTimeout(r, 80));
    if (!instructionsOpen.value || instructionsClosing.value) {
      break;
    }
  }
}

async function closeInstructions() {
  instructionsClosing.value = true
  for (let i = bodyOpacity.value; i <= 100; i++) {
    bodyOpacity.value = i;
    await new Promise((r) => setTimeout(r, 15));
    if (!instructionsOpen.value) {
      break;
    }
  }
  instructionsOpen.value = false;
  instructionsClosing.value = false;
}


async function fadeinTitleText() {
  for (let i = 0; i <= 100; i++) {
    titleTextOpacity.value = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

// Music and sound
async function playMusic() {
  music.value.play();
  while (!music.value.paused) {
    await new Promise((r) => setTimeout(r, 5000));
  }
  if (gameRunning.value && !isPaused.value) {
    playMusic();
  }
}

async function playBlastSound() {
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

// X-Wing movements
async function goUp() {
  mouseDown.value = true;
  let unit = 0.1;
  for (let i = xWing.y; i > 50; i -= unit) {
    unit += 0.1;
    if (!mouseDown.value) {
      tiltCenter();
      break;
    }
    xWing.y = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goDown() {
  mouseDown.value = true;
  let unit = 0.1;
  for (let i = xWing.y; i < 84; i += unit) {
    unit += 0.1;
    if (!mouseDown.value) {
      tiltCenter();
      break;
    }
    xWing.y = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goRight() {
  if (!xWing.isHit) {
    tiltRight(20);
    mouseDown.value = true;
    let unit = 0.5;
    for (let i = xWing.x; i < 300; i += unit) {
      unit += 0.3;
      if (!mouseDown.value) {
        tiltCenter();
        break;
      }
      xWing.x = i;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

async function goLeft() {
  if (!xWing.isHit) {
    tiltLeft(-20);
    mouseDown.value = true;
    let unit = 0.5;
    for (let i = xWing.x; i > 0; i -= unit) {
      unit += 0.3;
      if (!mouseDown.value) {
        tiltCenter();
        break;
      }
      xWing.x = i;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

async function tiltRight(degrees) {
  for (let i = shipTilt.value; i < degrees; i++) {
    shipTilt.value = i;
    await new Promise((r) => setTimeout(r, 5));
  }
}

async function tiltLeft(degrees) {
  for (let i = shipTilt.value; i > degrees; i--) {
    shipTilt.value = i;
    await new Promise((r) => setTimeout(r, 5));
  }
}

async function tiltCenter() {
  if (shipTilt.value < 0)
    tiltRight(0);
  else
    tiltLeft(0);
}

function mouseUp() {
  mouseDown.value = false;
  tiltCenter();
}

// X-Wing lasers
async function shoot() {
  if (isPaused.value || xWing.isHit)
    return;

  fireLaser(lasers.value[0].isFired ? 1 : 0);
}

async function fireLaser(n) {
  playBlastSound();
  lasers.value[n].y = xWing.y;
  lasers.value[n].isFired = true;
  for (let y = xWing.y - 5, x = 47.5, w = 5, z = 99; y > xWing.y - 50; y -= 1, x += .08, w -= .15, z -= 2.25) {
    if (!lasers.value[n].isFired)
      break;

    lasers.value[n].width = w;
    lasers.value[n].x = x;
    lasers.value[n].y = y;
    lasers.value[n].z = z;
    console.log('laser z', z)

    if (isStarDestroyerHit(lasers.value[n])) {
      sdHits.value++;
      //console.log('HIT', sdHits.value);
      
      if (isStarDestroyerExploded.value) {
        runStarDestroyerExplosion();
      }
      break;
    }

    await new Promise((r) => setTimeout(r, 1));
  }
  lasers.value[n].isFired = false;
}

function gotOne(isSavedFriend, isDestroyedStarDestroyer) {
  lasers.value[0].isFired = false;
  lasers.value[1].isFired = false;
  playExplosionSound();
  explosion.value.play();
  if (isSavedFriend) {
    points.value += 1000;
    friendCount.value++;
  } else if (isDestroyedStarDestroyer) {
    points.value += 800;
  } else {
    points.value += 100;
  }
}

//Other Functions
async function crashed() {
  if (xWing.isInvincible)
    return;

  playExplosionSound();
  shipCount.value--;
  points.value += 100;
  xWing.isHit = true;
  for (let max = 26, min = 22; max > 10; max -= 2, min -= 2) {
    for (let i = max; i > min; i -= 1) {
      explosionWidth.value = i;
      await new Promise((r) => setTimeout(r, 20));
    }
    for (let i = min; i < max; i += 1) {
      explosionWidth.value = i;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
  xWing.isHit = false;
  runInvincibility();
  if (shipCount.value < 1) {
    gameOver();
  }
  fadeInShip();
}

async function runInvincibility() {
  xWing.isInvincible = true;
  for (let i = 0; i < 15; i++) {
    for (let opacity = 65; opacity >= 35; opacity -= 10) {
      shipOpacity.value = opacity;
      await new Promise((r) => setTimeout(r, 20));
    }
    for (let opacity = 45; opacity <= 75; opacity += 10) {
      shipOpacity.value = opacity;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
  shipOpacity.value = 100;
  xWing.isInvincible = false;
}

async function fadeInShip() {
  for (let i = 140, j = -20; i >= 20; i -= 2, j += 1) {
    shipWidth.value = i;
    shipLeft.value = j;
    await new Promise((r) => setTimeout(r, 2));
  }
}

//Game Flow
async function gameOver() {
  gameRunning.value = false;
  //friendCount.value = 0;
  fadeinTitleText();
  music.value.pause();
}

function pauseGame() {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    music.value.pause();
  } else {
    playMusic();
  }
}

const sdHits = ref(0);
const isStarDestroyerExploded = computed(() => sdHits.value >= 15);
const starDestroyerExplosionWidth = ref(null);
const showStarDestroyerExplosion = ref(false);
const showStarDestroyerReward = ref(false);
const starDestroyerExplosion = reactive({
  x: 0,
  y: 0
});
const starDestroyerPoints = reactive({
  x: 0,
  y: 0,
  opacity: 0
});

async function runStarDestroyer() {
  const waitTime = Math.floor(Math.random() * 3000) + 3000
  await new Promise((r) => setTimeout(r, waitTime));
  starDestroyerAbsolute.x = Math.floor(Math.random() * 45) + 40;
  starDestroyerAbsolute.y = Math.floor(Math.random() * 15) + 25;
  showStarDestroyer.value = true;
  
  //exit light speed
  for (let i = 1; i < 20; i += .5) {
    await pauseIfPaused();
    starDestroyerWidth.value = i;
    if (!gameRunning.value) {
      break;
    }
    await new Promise((r) => setTimeout(r, 5));
  }
  let tickCounter = 0;
  while (showStarDestroyer.value && gameRunning.value) {
    await pauseIfPaused();
    starDestroyerWidth.value += .1;
    starDestroyer.value.x -=.05;
    await new Promise((r) => setTimeout(r, 100));
    tickCounter++;
    //console.log(tickCounter, tickCounter % 20)
    if (tickCounter % 20 === 0) {
      starDestroyerShoot();
    }
  }
  showStarDestroyer.value = false;
  sdHits.value = 0;
}

async function starDestroyerShoot() {
  const startingX = starDestroyer.value.x * 1.15 + starDestroyerWidth.value / 3.5; 
  const startingY = starDestroyer.value.y * 1.1 + starDestroyerWidth.value * 1.1; 
  const startingWidth  = starDestroyerWidth.value / 100; 
  starDestroyerLaser.isFired = true;

  for (let x = 0, y = startingY, w = startingWidth, z = 2; w < 100; w += w / 2, x += w / 80, y += w / 8, z += 10) {
    //for (let x = startingX, y = startingY, w = startingWidth, z = 2; w < 100; w += w / 2, x -= w / 8, y += w / 8, z += 10) {
    if (!gameRunning.value) {
      break;
    }
    await pauseIfPaused();
    console.log ('xWing.x', xWing.x)
    starDestroyerLaser.x = (starDestroyer.value.x * 1.15 + starDestroyerWidth.value / 3.5) + ((starDestroyer.value.x - 50) * x)
    //starDestroyerLaser.x = x - (xWing.x / 50); 
    starDestroyerLaser.y = y; 
    starDestroyerLaser.z = z; 
    starDestroyerLaser.width = w; 

    if (isXWingHit(starDestroyerLaser)) {
      crashed();
      break;
    }
    
    await new Promise((r) => setTimeout(r, 75));
  }
  starDestroyerLaser.isFired = false;
}

async function runStarDestroyerExplosion() {
  gotOne(false, true);
  showReward();
  showStarDestroyer.value = false;
  sdHits.value = 0;
  showStarDestroyerExplosion.value = true
  starDestroyerExplosion.x = starDestroyer.value.x + starDestroyerWidth.value / 2;
  starDestroyerExplosion.y = starDestroyer.value.y + starDestroyerWidth.value / 10;
  const fullExplosionWidth = starDestroyerWidth.value * 1.5
  for (let i = fullExplosionWidth / 30; i < fullExplosionWidth; i++) {
    starDestroyerExplosion.x -= .5;
    starDestroyerExplosion.y -= .2;
    starDestroyerExplosionWidth.value = i;
    await new Promise((r) => setTimeout(r, 10));
  }
  showStarDestroyerExplosion.value = false;
  runStarDestroyer();
}

async function pauseIfPaused() {
  while (isPaused.value) {
    await new Promise((r) => setTimeout(r, 100));
  }
}

async function showReward() {
  showStarDestroyerReward.value = true;
  starDestroyerPoints.x = starDestroyer.value.x + 6;
  for (let i = starDestroyer.value.y + 7, j = 100; i > starDestroyer.value.y - 20; i--, j -= 4) {
    starDestroyerPoints.y = i;
    starDestroyerPoints.opacity = j;
    await new Promise((r) => setTimeout(r, 40));
  }
  showStarDestroyerReward.value = false;
}

const isStarDestroyerHit = (laser) =>
  showStarDestroyer.value
    && laser.y < starDestroyer.value.y + 30
    && laser.y > starDestroyer.value.y + 25
    && laser.x < starDestroyer.value.x + (starDestroyerWidth.value / 2) + 9
    && laser.x > starDestroyer.value.x - (starDestroyerWidth.value / 4) + 7
    && laser.z < 85
    && laser.isFired;

const isXWingHit = (laser) =>
  !xWing.isHit
    && !xWing.isInvincible
    && xWing.y < laser.y + 15 
    && xWing.y > laser.y - 5
    && laser.x > 30
    && laser.x < 45
    && laser.z >= 100;



async function runGame() {
  friendCount.value = 0;
  shipCount.value = 5;
  points.value = 0;
  gameRunning.value = true;
  playMusic();
  fadeInShip();
  runStarDestroyer();
  for (let i = 10; i < 80; i += .01) {
    await pauseIfPaused();
    deathStarWidth.value = i;
    if (!gameRunning.value) {
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
    //console.log('isMusicLoaded', isMusicLoaded.value)
  };
  blast1.value.oncanplaythrough = () => {
    isBlastSoundLoaded.value = true;
    //console.log('isBlastSoundLoaded', isBlastSoundLoaded.value)
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

.laser {
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
  z-index: 4;
}

.star-destroyer-explosion {
  position: fixed;
  z-index: 5;
}

.point-reward {
  color: rgb(255, 251, 35);
  font-size: 2vw;
  text-shadow: .05vw .05vw rgb(254, 125, 105);
  position: fixed;
  z-index: 101;
}

@media only screen and (min-width: 1400px) {
  #laser-btn2 {
    right: auto;
    left: 70px;
    bottom: 66px;
  }
}
</style>
