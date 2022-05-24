<template>
  <section>
    <h4 class="text-style-title">推荐歌单</h4>
    <CarouselList
      v-if="playlist"
      :length="playlist.length"
      key="palylist"
      class="playlist"
    >
      <template v-for="(item, index) in playlist" :key="index">
        <div>
          <PlayListCard :item="item" type="playlist"></PlayListCard>
        </div>
      </template>
    </CarouselList>
  </section>
</template>
<script>
import { topPlaylist } from "../../../apis/playlist";
import { reactive, toRefs } from "vue";
import PlayListCard from "../../../components/playListCard.vue";
import CarouselList from "../../../components/carouselList.vue";

export default {
  name: "explorePlayList",
  setup() {
    const data = reactive({
      playlist: null,
    });
    topPlaylist({
      limit: 20,
    }).then((res) => {
      data.playlist = res.playlists;
    });

    return { ...toRefs(data) };
  },
  components: { PlayListCard, CarouselList },
};
</script>
<style lang="scss" scoped></style>
