<template>
  <section class="section block" v-if="playlistList.length !== 0">
    <div class="text-style-title">歌单推荐</div>
    <CarouselList :length="playlistList.length">
      <PlayListCard
          v-for="(playlist, index) in playlistList"
          :key="index"
          :item="playlist"
          type="playlist"
      ></PlayListCard>
    </CarouselList>
  </section>
</template>
<script>
import {reactive, toRefs} from "vue";
import {dailyRecommendPlaylist} from "../../../apis/personalized";

import CarouselList from "../../../components/carouselList.vue";
import PlayListCard from "../../../components/playListCard.vue";

export default {
  name: "FeedPlaylist",
  setup() {
    const data = reactive({
      playlistList: [],
    });

    const getData = () => {
      dailyRecommendPlaylist().then((res) => {
        if (res.code === 200) {
          data.playlistList = res.recommend;
        }
      });
    };

    getData();

    return { ...toRefs(data) };
  },
  components: {
    CarouselList,
    PlayListCard,
  },
};
</script>
<style lang=""></style>
