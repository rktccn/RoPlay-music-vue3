<template lang="">
  <div class="section" v-if="videoList">
    <h4 class="text-style-title">视频</h4>
    <CarouselList :length="videoList.length">
      <li v-for="(item, index) in videoList" :key="index">
        <PlayListCard :item="item" type="video"></PlayListCard>
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
  name: "searchVideo",
  setup() {
    const data = reactive({
      videoList: null,
    });

    const getVideoList = () => {
      let params = {
        keywords: "苏打绿",
        limit: 8,
        type: 1014,
      };
      search(params).then((res) => {
        console.log(res.result);
        data.videoList = res.result.videos;
      });
    };

    getVideoList();
    return { ...toRefs(data) };
  },
  components: {
    PlayListCard,
    CarouselList,
  },
};
</script>
<style lang=""></style>
