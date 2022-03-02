<template lang="">
  <div class="section">
    <h4 class="text-style-title">歌曲</h4>
    <div class="" v-if="artistList">
      <ul class="list grid">
        <li class="list-item" v-for="(item, index) in artistList" :key="index">
          <TrackListItem :item="item"></TrackListItem>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { search } from "../../../apis/others";
import { getTrackDetail } from "../../../apis/track";

import TrackListItem from "../../../components/trackListItem.vue";

export default {
  name: "searchSong",
  setup() {
    const data = reactive({
      artistList: null,
    });

    const getSongDetail = (value) => {
      let ids = value.map((r) => r.id);
      getTrackDetail(ids.join(",")).then((res) => {
        data.artistList = res.songs;
      });
    };

    const getArtists = () => {
      // keywords : 关键词
      // limit : 返回数量 , 默认为 30
      // offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
      // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合

      let params = {
        keywords: "苏打绿",
        limit: 16,
        type: 1,
      };
      search(params).then((res) => {
        getSongDetail(res.result.songs);
      });
    };

    getArtists();
    return { ...toRefs(data) };
  },
  components: { TrackListItem },
};
</script>
<style lang="scss" scoped>
.grid {
  width: 100%;
  display: grid;
  grid: auto-flow / repeat(4, 1fr);
  grid-auto-flow: dense;
  gap: 8px;

  @media screen and (max-width: $lg) {
    grid: auto-flow / repeat(auto-fit, minmax(230px, 1fr));
  }
  .list-item {
    overflow: hidden;
  }
}
</style>
