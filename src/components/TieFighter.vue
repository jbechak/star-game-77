<template>
  <div
    v-show="state.tieActive"
    class="tie-fighter"
    :style="{
      top: `${state.tieY}vh`,
      left: `${state.tieX}vw`,
      width: `${state.tieWidth}vw`,
      zIndex: `${state.z}`
    }"
  >
    <img class="image" v-if="!state.isBlasted && !state.hasCollided" src="../assets/tie-200.png" />
    <img v-else src="../assets/explosion2.png" :style="{ width: `${state.tieWidth * 1.5}vw` }" />
  </div>
  <h3 
    class="point-reward" 
    v-if="state.showReward" 
    :style="
      { 
        top: `${state.pointsY}vh`, 
        left: `${state.pointsX}vw`,
        opacity: `${state.pointsOpacity}%` 
      }">
    +100
  </h3>
</template>

<script setup>
import { onMounted, reactive, defineProps, defineEmits } from 'vue';

const props = defineProps({
  width:    { type: Number,   value: 10     },
  lasers:   { type: Array                   },
  isPaused: { type: Boolean,  value: false  },
  xWing:    { type: Object,   value: {
      x: 150,
      y: null,
      isHit: false
    }
  }
});

const emit = defineEmits(['blasted', 'collided']);
let state = reactive({
  isBlasted: false,
  hasCollided: false,
  tieX: 95,
  tieY: 20,
  points: 0,
  tieActive: true,
  tieWidth: 50
});

async function tieFighter() {
  state.tieActive = false;
  let realX = Math.floor(Math.random() * 200) + 51;
  let realY = Math.floor(Math.random() * 40) + 51;
  let waitTime = Math.floor(Math.random() * 6000);
  await new Promise((r) => setTimeout(r, waitTime));
  while (props.isPaused === true) {
    await new Promise((r) => setTimeout(r, 100));
  }
  state.tieX = 0;
  state.tieY = 0;
  state.tieActive = true;

  for (let i = 4, j = i / 100; i <= 200; i += j, j += j / 5) {
    while (props.isPaused === true) {
      await new Promise((r) => setTimeout(r, 100));
    }
    state.isBlasted = checkIfBlasted();
    state.hasCollided = checkIfCollided();
    if (state.isBlasted || state.hasCollided) {
      showReward();
      state.tieX -= state.tieWidth / 4;
      await new Promise((r) => setTimeout(r, 100));
      break;
    }
    state.z = i;
    state.tieWidth = 15 * state.z / 100;
    state.tieY = realY - ((100 - state.z) / 2) - state.tieWidth / 2; 
    state.tieX = ((realX - props.xWing.x + 50 - state.tieWidth / 2) - 50) * state.z / 100 + 50; 
    await new Promise((r) => setTimeout(r, 100));
  }
  if (state.isBlasted || state.hasCollided) {
    if (state.isBlasted) { 
      emit('blasted'); 
    } else {
      emit('collided'); 
    }
    state.tieActive = false;
    await new Promise((r) => setTimeout(r, 1000));
    state.isBlasted = false;
    state.hasCollided = false;
  }
}

function checkIfBlasted() {
  return state.isBlasted == false
  && props.lasers[0].y < state.tieY + 15 
  && props.lasers[0].y > state.tieY - 15
  && props.lasers[0].x < state.tieX + (state.tieWidth / 2)
  && props.lasers[0].x > state.tieX - (state.tieWidth / 4)
  && props.lasers[0].isFired == true
  ||
  props.lasers[1].y < state.tieY + 15 
  && props.lasers[1].y > state.tieY - 15
  && props.lasers[1].x < state.tieX + (state.tieWidth / 2)
  && props.lasers[1].x > state.tieX - (state.tieWidth / 4)
  && props.lasers[1].isFired == true;
}

function checkIfCollided() {
  return state.isBlasted == false
  && props.xWing.isHit === false
  && props.xWing.y < state.tieY + 15 
  && props.xWing.y > state.tieY - 15
  && state.tieX > 30
  && state.tieX < 60
  && state.z > 70
}

async function showReward() {
  state.showReward = true;
  state.pointsX = state.tieX;
  for (let i = state.tieY, j = 100; i > state.tieY - 20; i--, j -= 4) {
    state.pointsY = i;
    state.pointsOpacity = j;
    await new Promise((r) => setTimeout(r, 40));
  }

  
  state.showReward = false;
}

onMounted(async () => {
  for (let i = 0; i < 20; i++) {
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
    await tieFighter();
  }
  state.tieActive = false;
});
</script>

<style>
.tie-fighter {
  position: fixed;
}  

.point-reward {
  color: rgb(248, 183, 194);
  font-size: 2vw;
  text-shadow: .05vw .05vw rgb(254, 125, 105);
  position: fixed;
  z-index: 101;
}
.image {
   width: 100%;
}
</style>