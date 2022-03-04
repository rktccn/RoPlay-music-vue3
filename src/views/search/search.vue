<template lang="">
  <div>
    <!-- 艺人，专辑 -->
    <ArtistAndAlbum></ArtistAndAlbum>

    <!-- 单曲 -->
    <SongResult></SongResult>

    <!-- 歌单 -->
    <PlayListResult></PlayListResult>

    <!-- 视频 -->
    <VideoResult></VideoResult>

    <!-- 电台 -->
  </div>
</template>
<script>
import { latestAlbum } from "../../apis/album";
import { reactive, toRefs } from "vue";

import PlayListCard from "../../components/playListCard.vue";
import ArtistAndAlbum from "./components/artistAndAlbum.vue";
import SongResult from "./components/songResult.vue";
import PlayListResult from "./components/playListResult.vue";
import VideoResult from "./components/videoResult.vue";

export default {
  setup() {
    const data = reactive({
      playlist: null,
    });
    latestAlbum().then((res) => {
      data.playlist = res.albums;
    });

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
