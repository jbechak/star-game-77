<template>
  <div
  id="star1"
  :style="{
    top: `${state.starY}vh`,
    left: `${state.starX}vw`,
    width: `${state.starWidth}vw`,
    zIndex: `2`
  }"
  >
      <img class="image" src="../assets/star3.png" />
  </div>
</template>
  
  <script>
    import { onMounted, reactive } from 'vue';
    export default {
    name: "StarView",
    props: {
        shipX: {
            type: Number,
            value: 150
        },
    },
    setup() {
        let state = reactive({
            realX: 145,
            realY: '',
            starX: 95,
            starY: 20,
            shipX: 150,
            width: 1
    });
        async function star() {
            for (let k = 0; k < 100; k++) {
              state.realY = Math.floor(Math.random() * 100) + 50;
              state.realX = Math.floor(Math.random() * 300);
              state.starWidth = .5;
              state.z = Math.floor(Math.random() * 10);
              let pauseTime = Math.floor(Math.random() * 5000);
              await new Promise((r) => setTimeout(r, pauseTime));
              // for (let i = state.z, j = i / 1000; i <= 200; i += j, j += j / 5) {
              //   state.z = i;
              //   state.starWidth = state.width * state.z / 20;
              //   state.starY = state.realY - ((100 - state.z) / 2) - state.starWidth / 2; 
              //   state.starX = ((state.realX - props.shipX + 50 - state.starWidth / 2) - 50) * state.z / 100 + 50; 
              //   await new Promise((r) => setTimeout(r, 20));
              // }
              for (let i = state.z; i <= 200; i += .5) {
                  state.z = i;
                  state.starWidth = state.width * state.z / 20;
                  state.starY = state.realY - ((100 - state.z) / 2) - state.starWidth / 2; 
                  state.starX = ((state.realX - state.starWidth / 2) - 50) * state.z / 100 + 50;
                  //state.starX = ((state.realX - props.shipX / 10 + 50 - state.starWidth / 2) - 50) * state.z / 100 + 50; 
                  await new Promise((r) => setTimeout(r, 20));
                }
            }
        }

    onMounted(async () => {
      
        await star();
        await star();
        await star();
        await star();
        await star();

    });
    return {
        state
    };
    }
};
</script>

<style>
#star1 {
  position: fixed;
}

.image {
  width: 100%;
}
</style>