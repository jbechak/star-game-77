<template>
  <div v-for="star in state.stars" :key="star">
    <star-view :shipX="shipX" />
    <star2-view :shipX="shipX" />
  </div>
</template>

<script>
import { reactive } from 'vue';
import StarView from '@/components/StarView.vue'
import Star2View from '@/components/Star2View.vue'
export default {
    components: { StarView, Star2View },
    name: "StarsView",
    props: {
        shipX: {
            type: Number,
            value: 150
        },
    },
    setup() {
        let state = reactive({
          stars: [ 1, 2, 3, 4, 5 ]
    });
    return {
      state
    };
  }
}
</script>

<style>

</style>