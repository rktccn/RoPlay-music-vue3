// 当前播放列表
<template lang="">
  <div class="play-now section">
    <h4 class="text-style-title">当前播放</h4>
    <TrackList
      class="play-now-track primary"
      :tracks="[tracks[currentIndex]]"
      v-if="tracks.length"
      :canHover="false"
      :key="currentIndex + tracks.length"
    ></TrackList>
  </div>

  <div class="current-list section">
    <h4 class="text-style-title">播放列表</h4>
    <TrackList
      :tracks="tracks"
      v-if="tracks.length"
      :key="tracks.length"
    ></TrackList>
    <p v-if="!tracks.length">暂无歌曲</p>
  </div>
</template>
<script>
import TrackList from "../components/trackList.vue";

import { usePlayer } from "../store/player";
import { reactive, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { getTrackDetail } from "../apis/track";

export default {
  name: "currentList",
  setup() {
    const player = usePlayer();

    const data = reactive({
      tracks: [],
    });

    const { trackList, currentIndex } = storeToRefs(player);

    const getTracks = () => {
      if (trackList.value.length !== 0) {
        getTrackDetail(trackList.value.join(",")).then((res) => {
          data.tracks = res.songs;
        });
      }
    };

    getTracks();

    watch(
      () => player.deleteTrackIndex,
      (index) => {
        if (index === -1) return;
        data.tracks.splice(index, 1);
        player.deleteTrackIndex = -1;
      }
    );

    return { ...toRefs(data), currentIndex };
  },
  components: { TrackList },
};
</script>
<style lang="scss" scoped>
.play-now-track {
  border-radius: $border-radius-default;
}
</style>
