<template lang="">
  <div class="section">
    <h4 class="text-style-title">歌单</h4>
    <CarouselList :length="playLists.length" v-if="playLists">
      <li v-for="(item, index) in playLists" :key="index">
        <PlayListCard :item="item" type="playlist"></PlayListCard>
      </li>
    </CarouselList>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { search } from "../../../apis/others";

import PlayListCard from "../../../components/playListCard.vue";
import CarouselList from "../../../components/carouselList.vue";

export default {
  setup() {
    const data = reactive({
      playLists: null,
    });

    const getPlaylists = () => {
      let params = {
        keywords: "五月天",
        limit: 10,
        type: 1000,
      };
      search(params).then((res) => {
        console.log(res.result.playlists);
        data.playLists = res.result.playlists;
        // getSongDetail(res.result.songs);
      });
    };

    getPlaylists();

    return { ...toRefs(data) };
  },
  components: { PlayListCard, CarouselList },
};
</script>
<style lang="scss" scoped></style>
