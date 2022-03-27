<template lang="">
  <div v-if="tracks !== []" class="track-list">
    <TrackListItem
      v-for="(track, index) in tracks"
      :key="index"
      :item="track"
      :canHover="canHover"
      :showImg="showImg"
      :type="type"
      :index="index + 1"
    ></TrackListItem>
  </div>
</template>
<script>
import TrackListItem from "./trackListItem.vue";

export default {
  name: "trackList",
  props: {
    tracks: { type: Array, required: true }, // 传入歌曲列表
    canHover: { type: Boolean, default: true }, // 是否显示hover样式
    showImg: { type: Boolean, default: true }, // 是否显示封面
    type: { type: String, default: "song" }, // 类型 song / album(隐藏封面和歌曲信息)
  },
  setup() {},
  components: {
    TrackListItem,
  },
};
</script>
<style lang="scss" scoped></style>
