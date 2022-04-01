<template lang="">
  <ContextInfo
    class="section"
    :item="item.artist"
    :type="'artist'"
    v-if="item"
  ></ContextInfo>

  <div class="album-songs">
    <!-- 新专和热歌 -->
    <div class="new-album">
      <div class="text-style-title">最新发布</div>
      <PlayListCard :item="albums[0]" type="album"></PlayListCard>
      <PlayListCard :item="albums[1]" type="album"></PlayListCard>
    </div>

    <div class="top-song"></div>
  </div>

  <div>歌手</div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { getArtist, getArtistAlbum } from "../apis/artist";

import ContextInfo from "../components/contextInfo.vue";
import PlayListCard from "../components/playListCard.vue";
import CarouselList from "../components/carouselList.vue";
export default {
  name: "Atrist",
  setup() {
    const data = reactive({
      item: null,
      albums: null,
    });

    getArtist(6452).then((res) => {
      console.log(res);
      data.item = res;
    });

    getArtistAlbum({ id: 187229, limit: 2 }).then((res) => {
      console.log(res);
      data.albums = res.hotAlbums;
    });

    return { ...toRefs(data) };
  },
  components: {
    ContextInfo,
    CarouselList,
    PlayListCard,
  },
};
</script>
<style lang="scss"></style>
