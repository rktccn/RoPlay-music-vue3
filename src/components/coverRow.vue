<template lang="">
  <div class="cover-row">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "CoverRow",
};
</script>
<style lang="scss" scoped>
.cover-row {
  margin: 0 auto;
  display: grid;
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
}
</style>
