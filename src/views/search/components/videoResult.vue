<template lang="">
  <div class="section block" v-if="videoList.length !== 0">
    <div class="title">
      <h4 class="text-style-title">视频</h4>
      <router-link :to="`/search/${w}/videos`" class="text-style-info"
        >查看全部</router-link
      >
    </div>
    <CarouselList :length="videoList.length">
      <li v-for="(item, index) in videoList" :key="index">
        <PlaylistCard :item="item" type="video"></PlaylistCard>
      </li>
    </CarouselList>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { search } from "../../../apis/others";

import PlaylistCard from "../../../components/playListCard.vue";
import CarouselList from "../../../components/carouselList.vue";

export default {
  name: "searchVideo",
  props: {
    w: { type: String, required: true },
  },
  setup(props) {
    const data = reactive({
      videoList: [],
    });

    const getVideoList = () => {
      let params = {
        keywords: props.w,
        limit: 8,
        type: 1014,
      };
      search(params).then((res) => {
        data.videoList = res.result.videos;
      });
    };

    getVideoList();
    return { ...toRefs(data) };
  },
  components: {
    PlaylistCard,
    CarouselList,
  },
};
</script>
<style lang=""></style>
