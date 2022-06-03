<template>
  <div
      class="cover-row"
      :class="{ video: (type === 'videos') | (type === 'mvs') }"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    type: {
      // videos / mvs / other
      type: String,
      default: "other",
    },
  },

  name: "CoverRow",
});
</script>
<style lang="scss" scoped>
.cover-row {
  margin: 0 auto;
  display: grid;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  grid-template-columns: repeat(5, 1fr);

  @media (max-width: $lg) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: $md) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: $sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  &.video {
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: $lg) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: $md) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: $sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
