<template lang="">
  <div v-if="tracks !== []" class="track-list">
    <TrackListItem
      v-for="(track, index) in tracks"
      :key="index"
      :item="track"
      :canHover="canHover"
    ></TrackListItem>
    <!-- {{ currentIndex }} -->
  </div>
</template>
<script>
import TrackListItem from "./trackListItem.vue";

export default {
  props: {
    tracks: { type: Array, required: true }, // 传入歌曲列表
    canHover: { type: Boolean, default: true }, // 是否显示hover样式
  },

  setup() {},

  components: {
    TrackListItem,
  },
};
</script>
<style lang="scss" scoped>
.track-list {
}
</style>
