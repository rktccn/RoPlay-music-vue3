// 当前播放列表
<template lang="">
  <div class="play-now section">
    <h4 class="text-style-title">当前播放</h4>
    <TrackList
      class="play-now-track primary"
      :tracks="[tracks[currentIndex]]"
      v-if="tracks"
      :canHover="false"
      :key="currentIndex"
    ></TrackList>
  </div>

  <div class="current-list section">
    <h4 class="text-style-title">播放列表</h4>
    <TrackList :tracks="tracks" v-if="tracks"></TrackList>
    <p v-if="!tracks">暂无歌曲</p>
  </div>
</template>
<script>
import TrackList from "../components/trackList.vue";

import { usePlayer } from "../store/player";
import { reactive, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { getTrackDetail } from "../apis/track";

export default {
  name: "currentList",
  setup() {
    const player = usePlayer();

    const data = reactive({
      tracks: null,
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
