<template>
  <div>
    <div
      v-show="tieFighter.isActive"
      class="ships"
      :style="{
        top: `${tieFighter.y}vh`,
        left: `${tieFighter.x}vw`,
        zIndex: `${tieFighter.z}`,
        opacity: `${tieFighter.explosionOpacity}%`
      }"
    >
      <div v-if="state.goingRight">
        <img v-if="!tieFighter.isBlasted" src="../assets/tie-fighter-going-right.png" :style="{ width: `${tieFighter.width}vw` }">
        <img 
          v-else 
          src="../assets/explosion2.png" 
          :style="{ width: `${tieFighter.width * 1.5}vw` }" 
        />
      </div>
      <div v-else>
        <img v-if="!tieFighter.isBlasted" src="../assets/tie-fighter.png" :style="{ width: `${tieFighter.width}vw` }">
        <img 
          v-else 
          src="../assets/explosion2.png" 
          :style="{ width: `${tieFighter.width * 1.5}vw` }" 
        />
      </div>
    </div>
    <h3 
      class="general-text yellow" 
      v-if="isShowingReward.value === true" 
      :style="
        { 
          top: `${reward.y}vh`, 
          left: `${reward.x}vw`,
          opacity: `${reward.pointsOpacity}%` 
        }">
      +500
    </h3>
    <div
      v-show="xWingFighter.isActive"
      class="ships"
      :style="{
        top: `${xWingFighter.y}vh`,
        left: `${xWingFighter.x}vw`,
        zIndex: `${xWingFighter.z}`
      }"
    >
      <div class="above-ship">
        <h3 class="general-text green" :style="{ opacity: '50%' }">
          Help!
        </h3>
      </div>
      <img v-if="state.goingRight" src="../assets/x-wing-going-right.png" :style="{ width: `${xWingFighter.width}vw` }">
      <img v-else src="../assets/x-wing-angle.png" :style="{ width: `${xWingFighter.width}vw` }">
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, defineProps, defineEmits } from 'vue';


// export default {
//     name: "ChaseView",

const props = defineProps({
  width:    { type: Number,   value: 10     },
  lasers:   { type: Array                   },
  isPaused: { type: Boolean,  value: false  },
  xWing:    { type: Object,   value: {
      x: 150,
      y: null,
      isHit: false
    }
  },
});
const emit = defineEmits(['blasted']);

let state = reactive({
  isBlasted: false,
  hasCollided: false,
  tieX: 95,
  tieY: 20,
  points: 0,
  goingRight: false
});

let xWingFighter = reactive({
  isBlasted: false,
  hasCollided: false,
  x: 0,
  y: 0,
  z: 0,
  isActive: true,
});

let tieFighter = reactive({
  isBlasted: false,
  hasCollided: false,
  x: 0,
  y: 0,
  z: 0,
  isActive: true,
  width: 50,
  showReward: false,
  explosionOpacity: 100
});

let reward = reactive({
  x: 50,
  y: 50,
  pointsOpacity: 50
});

const isShowingReward = reactive({}); 

async function runChase() {
  tieFighter.explosionOpacity = 100;
  state.goingRight = !state.goingRight;
  tieFighter.isActive = false;
  xWingFighter.isActive = false;
  let realX = state.goingRight ? -200 : 600;
  let realY = Math.floor(Math.random() * 40) + 71;
  let z = Math.floor(Math.random() * 8) + 10;
  let waitTime = Math.floor(Math.random() * 6000);
  await new Promise((r) => setTimeout(r, waitTime));
  while (props.isPaused === true) {
    await new Promise((r) => setTimeout(r, 100));
  }
  xWingFighter.x = 0;
  xWingFighter.y = 0;
  tieFighter.isActive = true;
  xWingFighter.isActive = true;
  state.showReward = false;
  for (let i = z, j = i / 50; i <= 200; i += j, j += j / 10) {
    while (props.isPaused === true) {
      await new Promise((r) => setTimeout(r, 100));
    }
    xWingFighter.z = i;
    xWingFighter.width = 30 * xWingFighter.z / 100;
    realX = state.goingRight ? realX + 15 : realX - 15;
    xWingFighter.y = realY - ((100 - xWingFighter.z) / 2) - xWingFighter.width / 2; 
    xWingFighter.x = ((realX - props.xWing.x + 50 - xWingFighter.width / 2) - 50) * xWingFighter.z / 100 + 50; 
    if (!tieFighter.isBlasted) {
      tieFighter.x = state.goingRight ? xWingFighter.x - xWingFighter.z / 2 : xWingFighter.x + xWingFighter.z / 2;
      tieFighter.y = xWingFighter.y - xWingFighter.z / 2;
      tieFighter.z = xWingFighter.z - 5;
      tieFighter.width = 8 * tieFighter.z / 100;
      tieFighter.isBlasted = checkIfBlasted();
    } else if (isShowingReward.value === false) {
      isShowingReward.value = true;
      emit('blasted', true); 
      showReward();
      fadeExplosion();
    }
    await new Promise((r) => setTimeout(r, 100));
  }        
  isShowingReward.value = false;
  tieFighter.isActive = false;
  await new Promise((r) => setTimeout(r, 1000));
  tieFighter.isBlasted = false;
}


function checkIfBlasted() {
  return tieFighter.isBlasted == false
  && props.lasers[0].y < tieFighter.y + 20
  && props.lasers[0].y > tieFighter.y - 20
  && props.lasers[0].x < tieFighter.x + (tieFighter.width / 2)
  && props.lasers[0].x > tieFighter.x - (tieFighter.width / 4)
  && props.lasers[0].isFired == true
  ||
  props.lasers[1].y < tieFighter.y + 20 
  && props.lasers[1].y > tieFighter.y - 20
  && props.lasers[1].x < tieFighter.x + (tieFighter.width / 2)
  && props.lasers[1].x > tieFighter.x - (tieFighter.width / 4)
  && props.lasers[1].isFired == true;
}

async function showReward() {
  tieFighter.x -= tieFighter.width / 4;
  Object.assign(reward, tieFighter);
  await moveReward();
}

async function moveReward() {
  for (let i = reward.y, j = 100; i > reward.y - 20; i--, j -= 4) {
    reward.y = i;
    reward.pointsOpacity = j;
    await new Promise((r) => setTimeout(r, 40));
  }
}

async function fadeExplosion() {
  for (let i = 100; i >= 0; i -= 4) {
    tieFighter.explosionOpacity = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

onMounted(async () => {
  isShowingReward.value = false;
  for (let i = 0; i < 20; i++) {
    await runChase();
  }
  tieFighter.isActive = false;
});
</script>

<style (scoped)>
.ships {
  position: fixed;
  z-index: 50;
}

#tie {
  position: fixed;
}

.above-ship {
  margin-bottom: 5vh;
}

.general-text {
  font-size: 2vw;
  text-shadow: .05vw .05vw rgb(254, 125, 105);
  position: fixed;
  z-index: 101;
  font-weight: bold;
}

.yellow {
  color: rgb(255, 251, 35);
}

.green {
  color: rgb(22, 255, 80);
}
</style>