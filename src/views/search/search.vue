<template lang="">
  <div>
    <!-- 艺人，专辑 -->
    <ArtistAndAblum></ArtistAndAblum>

    <!-- 单曲 -->
    <SongResult></SongResult>
    <!-- 歌单 -->

    <!-- 视频 -->

    <!-- 电台 -->
  </div>
</template>
<script>
import { latestAlbum } from "../../apis/album";
import { reactive, toRefs } from "vue";

import PlayListCard from "../../components/playListCard.vue";
import ArtistAndAblum from "./components/artistAndAblum.vue";
import SongResult from "./components/songResult.vue";

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
  components: { PlayListCard, ArtistAndAblum, SongResult },
};
</script>
<style lang="scss" scoped></style>
