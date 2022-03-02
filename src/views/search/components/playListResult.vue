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
      // keywords : 关键词
      // limit : 返回数量 , 默认为 30
      // offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
      // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合

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
