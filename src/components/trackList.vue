<template lang="">
  <div v-if="tracks !== []">
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

import { usePlayer } from "../store/player";
import { getTrackDetail } from "../apis/track";
import { storeToRefs } from "pinia";
import { reactive, toRefs } from "vue";
export default {
  props: {
    tracks: { type: Array, required: true },
    canHover: { type: Boolean, default: true }, // 是否显示hover样式
  },

  setup() {
    const player = usePlayer();

    const data = reactive({
      // tracks: [],
      // trackList: player.getTrackList,
    });

    // const { trackList, currentIndex } = storeToRefs(player);

    // if (trackList.value.length !== 0) {
    //   getTrackDetail(trackList.value.join(",")).then((res) => {
    //     console.log(res);
    //     data.tracks = res.songs;
    //   });
    // }

    return { ...toRefs(data) };
  },

  components: {
    TrackListItem,
  },
};
</script>
<style lang=""></style>
