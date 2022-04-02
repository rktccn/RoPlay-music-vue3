<template lang="">
  <div v-if="keyword">
    <!-- 艺人，专辑 -->
    <ArtistAndAlbum :w="keyword" :key="componentKey"></ArtistAndAlbum>

    <!-- 单曲 -->
    <SongResult :w="keyword" :key="componentKey"></SongResult>

    <!-- 歌单 -->
    <PlayListResult :w="keyword" :key="componentKey"></PlayListResult>

    <!-- 视频 -->
    <VideoResult :w="keyword" :key="componentKey"></VideoResult>

    <!-- 电台 -->
  </div>
</template>
<script>
import { latestAlbum } from "../../apis/album";
import { reactive, toRefs, watch } from "vue";
import { useRoute } from "vue-router";

import PlayListCard from "../../components/playlistCard.vue";
import ArtistAndAlbum from "./components/artistAndAlbum.vue";
import SongResult from "./components/songResult.vue";
import PlayListResult from "./components/playListResult.vue";
import VideoResult from "./components/videoResult.vue";

export default {
  setup() {
    const route = useRoute();

    const data = reactive({
      playlist: null,
      keyword: null,
      componentKey: 0,
    });
    latestAlbum().then((res) => {
      data.playlist = res.albums;
    });

    data.keyword = route.params.keyword;

    watch(
      () => route.params.keyword,
      (newValue, oldValue) => {
        data.keyword = route.params.keyword;
        data.componentKey += 1;
      }
    );

    return { ...toRefs(data) };
  },
  components: {
    PlayListCard,
    ArtistAndAlbum,
    SongResult,
    PlayListResult,
    VideoResult,
  },
};
</script>
<style lang="scss" scoped></style>
