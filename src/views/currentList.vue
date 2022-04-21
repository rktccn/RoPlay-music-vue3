// 当前播放列表
<template lang="">
  <div class="play-now section">
    <h4 class="text-style-title" v-if="!player.isPersonalFM">当前播放</h4>
    <TrackList
      class="play-now-track primary"
      :tracks="[tracks[currentIndex]]"
      v-if="tracks.length && !player.isPersonalFM"
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

    const getTracks = (val) => {
      if (val.length !== 0) {
        getTrackDetail(val).then((res) => {
          data.tracks = data.tracks.concat(res.songs);
        });
      }
    };

    // 每次加载50首歌曲
    for (let i = 0; i < trackList.value.length; i = i + 50) {
      let arr = trackList.value.slice(i, i + 50);
      arr = arr.join(",");
      console.log(arr);
      getTracks(arr);
    }

    watch(
      () => player.deleteTrackIndex,
      (index) => {
        if (index === -1) return;
        data.tracks.splice(index, 1);
        player.deleteTrackIndex = -1;
      }
    );

    return { ...toRefs(data), player, currentIndex };
  },
  components: { TrackList },
};
</script>
<style lang="scss" scoped>
.play-now-track {
  border-radius: $border-radius-default;
}
</style>
