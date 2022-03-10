<template>
  <section class="recomend-fm">
    <h4 class="text-style-title">最新发行</h4>
    <CarouselList
      v-if="playlist"
      :length="playlist.length"
      key="palylist"
      class="playlist"
    >
      <template v-for="(item, index) in playlist" :key="index">
        <div>
          <PlayListCard :item="item" type="album"></PlayListCard>
        </div>
      </template>
    </CarouselList>
  </section>
</template>
<script>
import { latestAlbum } from "../../../apis/album";
import { reactive, toRefs } from "vue";
import PlayListCard from "../../../components/playListCard.vue";
import CarouselList from "../../../components/carouselList.vue";

export default {
  name: "exploreFM",
  setup() {
    const data = reactive({
      playlist: null,
    });
    latestAlbum().then((res) => {
      data.playlist = res.albums;
    });

    return { ...toRefs(data) };
  },
  components: { PlayListCard, CarouselList },
};
</script>
<style lang="scss" scoped></style>
