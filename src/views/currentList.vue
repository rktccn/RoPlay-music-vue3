// 当前播放列表
<template lang="">
  <div class="play-now section">
    <h4 class="text-style-title" v-if="!player.isPersonalFM">当前播放</h4>
    <TrackList
      class="play-now-track primary"
      :tracks="[player.currentTrack]"
      v-if="player.currentTrack !== {} && !player.isPersonalFM"
      :canHover="false"
      :key="currentIndex + tracks.length"
      scrollerSelector=".el-main"
    ></TrackList>
  </div>

  <div class="current-list section">
    <h4 class="text-style-title">播放列表</h4>
    <TrackList
      :tracks="tracks"
      v-if="tracks.length !== 0"
      :key="tracks.length"
      scrollerSelector=".el-main"
    ></TrackList>
    <p v-if="!tracks.length">暂无歌曲</p>
    <p class="load-info font-size-12" @click="dododo" v-if="tracks.length">
      {{ hasMore ? "正在加载" : "已加载全部" }}
    </p>
  </div>
</template>
<script>
import TrackList from "../components/trackList.vue";

import { usePlayer } from "../store/player";
import { reactive, toRefs, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { getTrackDetail } from "../apis/track";
import { isScrollBottom } from "../utils/common";

export default {
  name: "currentList",
  setup() {
    const player = usePlayer();

    const data = reactive({
      tracks: [],
      hasMore: true,
    });

    const { trackList, currentIndex } = storeToRefs(player);
    let loading = false;

    const getTracks = (val) => {
      if (val.length !== 0) {
        getTrackDetail(val).then((res) => {
          data.tracks = data.tracks.concat(res.songs);
          console.log(res.songs);
          if (res.songs.length < 50) {
            data.hasMore = false;
            document
              .getElementsByClassName("el-main")[0]
              .removeEventListener("scroll", loadMore);
            return;
          }
          loading = false;
        });
      }
    };

    // 每次加载50首歌曲
    const loadMore = () => {
      if (loading) return;
      if (isScrollBottom()) {
        loading = true;
        let arr = trackList.value
          .slice(data.tracks.length, data.tracks.length + 50)
          .join(",");
        getTracks(arr);
      }
    };

    loadMore();

    onMounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .addEventListener("scroll", loadMore);
    });

    onUnmounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .removeEventListener("scroll", loadMore);
    });

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
