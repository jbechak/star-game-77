<template>
  <div v-if="friend.isActive">
    <div id="rebel-friend"
      :style="
        {
          top: `${friend.y}vh`,
          left: `${(300 - xWing.x) / 4 - 43 + friend.x}vw`,
          zIndex: `${friend.z}`,

          transform: `rotate(${friend.tilt}deg)`, 
          opacity: `${friend.explosionOpacity}%`
        }" 
      >
      <div class="above-ship">
        <h3 
          v-if="showThankYou"  
          class="general-text green"
          :style="{ opacity: '50%', marginLeft: '-6vw' }"
        >
          Thank you!
        </h3>
      </div>

      <img src="../assets/x-wing-200.png" 
        :style="{  width: `${friend.width}vw` }"
      >
    </div>

    <div 
      v-if="lasers[0].isFired"
      class="lasers"
      id="laser"
      :style="{ top: `${lasers[0].y}vh`, left: `${lasers[0].x}vw`, width:`${lasers[0].width}vw` }"
    >
      <img
        alt="laser"
        :style="{ width:`${lasers[0].width}vw` }"
        src="../assets/laser-ball.png"
      />
    </div>
    <div
      v-if="lasers[1].isFired"
      class="lasers"
      id="laser2"
      :style="{ top: `${lasers[1].y}vh`, left: `${lasers[1].x}vw`, width:`${lasers[1].width}vw` }"
    >
      <img
        alt="laser"
        :style="{ width:`${lasers[1].width}vw` }"
        src="../assets/laser-ball.png"
      />
    </div>
  </div>

</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, watchEffect, defineProps } from 'vue';
import BlastSound from "@/assets/BlastSoundQuiet.mp3";
import { pauseWhileTrue } from '@/helpers';

const props = defineProps({
  isPaused: { type: Boolean,  value: false  },
  xWing:    { type: Object,  value: {
      x: 150,
      y: null,
      isHit: false
    }
  },
  gameRunning: { type: Boolean, value: false },
});

const lasers = ref([{
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
}]);

const mouseDown = ref(false);
const friend = reactive({
  isBlasted: false,
  hasCollided: false,
  x: 30,
  y: 60,
  z: 90,
  width: 10,
  tilt: 0,
  isActive: false,
  explosionOpacity: 100
});
const blast1 = new Audio(BlastSound);
const blast2 = new Audio(BlastSound);
const isPlayingBlast1 = reactive({});

const showThankYou = ref(true);

async function playBlastSound() {
  console.log('friend playBlastSound', props.gameRunning)
  if (isPlayingBlast1.value == false) {
    isPlayingBlast1.value = true;
    //if (props.gameRunning)
      blast1.play();
    await new Promise((r) => setTimeout(r, 500));
    isPlayingBlast1.value = false;
  } else { 
  //if (props.gameRunning) {
    blast2.play();
  }
}

async function goUp() {
  mouseDown.value = true;
  let unit = 0.1;
  for (let i = friend.y; i > 35; i -= unit) {
    unit += 0.1;
    if (!mouseDown.value) {
      break;
    }
    friend.y = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goDown() {
  mouseDown.value = true;
  let unit = 0.1;
  for (let i = friend.y; i < 75; i += unit) {
    unit += 0.1;
    if (!mouseDown.value) {
      break;
    }
    friend.y = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goRight() {
  tiltRight(20);
  mouseDown.value = true;
  let unit = 0.2;
  for (let i = friend.x; i < 95; i += unit) {
    unit += 0.03;
    if (!mouseDown.value || friend.x >= 95) {
      mouseDown.value = false
      tiltCenter();
      break;
    }
    friend.x = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function goLeft() {
  tiltLeft(-20);
  mouseDown.value = true;
  let unit = 0.2;
  for (let i = friend.x; i > 5; i -= unit) {
    unit += 0.03;
    if (!mouseDown.value || friend.x <= 5) {
      mouseDown.value = false
      tiltCenter();
      break;
    }
    friend.x = i;
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function tiltRight(degrees) {
  for (let i = friend.tilt; i < degrees; i++) {
    friend.tilt = i;
    await new Promise((r) => setTimeout(r, 5));
  }
}

async function tiltLeft(degrees) {
  for (let i = friend.tilt; i > degrees; i--) {
    friend.tilt = i;
    await new Promise((r) => setTimeout(r, 5));
  }
}

async function tiltCenter() {
  if (friend.tilt < 0) {
    tiltRight(0);
  } else {
    tiltLeft(0);
  }
}

function mouseUp() {
  mouseDown.value = false;
  tiltCenter();
}

async function shoot() {
  fireLaser(lasers.value[0].isFired ? 1 : 0);
}

async function fireLaser(n) {
  playBlastSound();
  lasers.value[n].y = friend.y;
  lasers.value[n].isFired = true;
  for (let y = friend.y - 5, x = (300 - props.xWing.x) / 4 - 39.7 + friend.x, w = 3; y > friend.y - 50; y -= 1, x += .08, w -= .15) {
    lasers.value[n].width = w;
    lasers.value[n].x = x;
    lasers.value[n].y = y;
    await new Promise((r) => setTimeout(r, 1));
  }
  lasers.value[n].isFired = false;
}

async function runFriend() {
  await new Promise((r) => setTimeout(r, 2000));
  friend.isActive = true;
  handleThankYou();
  friend.x = 0;
  friend.y = 70;
  const width = Math.floor(Math.random() * 6) + 4;
  friend.z = Math.floor(Math.random() * 10) + 81;

  for (let i = 140, j = friend.x; i >= width; i -= 2, j += 1) {
    friend.width = i;
    friend.x = j;
    await new Promise((r) => setTimeout(r, 2));
  }

  for (let i = 0; i < 500; i++) {    
    if (!props.gameRunning || !isRunning.value) break;

    await pauseIfPaused();
    if (mouseDown.value) {
      let waitTime = Math.floor(Math.random() * 200);
      await new Promise((r) => setTimeout(r, waitTime));
      await pauseIfPaused();

      let nextMove = Math.floor(Math.random() * 5);
      if (nextMove < 2) {
        mouseUp()
      }
    } else {
      friend.tilt = 0;
      let waitTime = Math.floor(Math.random() * 2000);
      await new Promise((r) => setTimeout(r, waitTime));
      await pauseIfPaused();
      if (!props.gameRunning) 
      return;

      let nextMove = Math.floor(Math.random() * 5);
      if (nextMove == 1) {
        if (friend.x > 10) {
          goLeft(); 
        } else { 
          goRight(); 
        }
      } else if (nextMove == 2) {
        if (friend.x < 90) {
          goRight(); 
        } else { 
          goLeft(); 
        }
      } else if (nextMove == 3) {
        if (friend.y > 40) {
          goUp(); 
        } else { 
          goDown(); 
        }
      } else if (nextMove == 4) {
        if (friend.x < 70) {
          goDown(); 
        } else { 
          goUp(); 
        }
      }
    }
  }
}

async function handleThankYou() {
  await new Promise((r) => setTimeout(r, 2000));
  showThankYou.value = false
}

let isRunning = ref(true); // Local control to stop the loop

async function runBlaster() {
  isRunning.value = true; // Ensure loop runs when starting
  while (props.gameRunning && isRunning.value) {
    while (props.isPaused) {
      await new Promise((r) => setTimeout(r, 100));
    }
    let waitTime = Math.floor(Math.random() * 1000);
    await new Promise((r) => setTimeout(r, waitTime));

    if (!props.gameRunning || !isRunning.value) break; // Exit loop if stopped

    let nextMove = Math.floor(Math.random() * 3);
    if (nextMove === 0) {
      shoot();
    }
  }
}

async function pauseIfPaused() {
  while (props.isPaused) {
    await new Promise((r) => setTimeout(r, 100));
  }
}

// Watch gameRunning and start/stop runBlaster accordingly
watchEffect(() => {
  if (props.gameRunning) {
    runBlaster();
  } else {
    isRunning.value = false; // Stop the loop
  }
});

// Ensure the loop stops if the component is destroyed
onUnmounted(() => {
  isRunning.value = false;
});

onMounted(async () => {
  runFriend();
  //runBlaster();
});
</script>

<style scoped>
#rebel-friend {
  position: fixed;
  z-index: 90;
  width: 10vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.above-ship {
  margin-bottom: 5vh;
}
.lasers {
  position: fixed;
  left: 100px;
  z-index: 103;
}
.general-text {
  font-size: 2vw;
  text-shadow: .05vw .05vw rgb(254, 125, 105);
  /* position: fixed; */
  z-index: 101;
  text-wrap: nowrap;
  text-align: center;
}
.green {
  color: rgb(22, 255, 80);
}

</style>
