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
    let offset = 0;
    let loading = false;

    const getTracks = (val) => {
      if (val.length !== 0) {
        getTrackDetail(val).then((res) => {
          data.tracks = data.tracks.concat(res.songs);
          loading = false;
        });
      }
    };

    // 每次加载50首歌曲
    const loadMore = () => {
      if (loading) return;
      if (isScrollBottom()) {
        console.log("加载");
        loading = true;
        offset += 50;
        if (offset > trackList.value.length) {
          data.hasMore = false;
          document
            .getElementsByClassName("el-main")[0]
            .removeEventListener("scroll", loadMore);
        }
        let arr = trackList.value.slice(offset, offset + 50).join(",");
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
