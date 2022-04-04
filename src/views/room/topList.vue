<template lang="">
  <div>
    <div class="recommend">
      <h4 class="text-style-title">精挑细选</h4>
      <div class="inner">
        <li
          v-for="(id, index) in recommendList"
          :key="index"
          class="track-item block"
        >
          <TopListCard :id="id"></TopListCard>
        </li>
      </div>
    </div>

    <div class="all">
      <h4 class="text-style-title">全部榜单</h4>
      <CoverRow v-if="TopLists">
        <li v-for="(playlist, index) in TopLists" :key="index">
          <PlayListCard
            :item="playlist"
            :showTime="true"
            type="playlist"
          ></PlayListCard>
        </li>
      </CoverRow>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { getTopList } from "../../apis/playlist.js";

import PlayListCard from "../../components/playListCard.vue";
import CoverRow from "../../components/coverRow.vue";
import TopListCard from "../explore/components/playListTrack.vue";

export default {
  name: "RoomTopList",
  setup() {
    const data = reactive({
      TopLists: null,
      TopArtist: null,
      recommendList: [3778678, 2884035, 19723756],
    });

    // 获取排行榜
    const getData = () => {
      getTopList().then((res) => {
        console.log(res);
        data.TopLists = res.list;
        data.TopArtist = res.artistToplist;
        console.log(data.TopArtist.artists);
      });
    };

    getData();

    return { ...toRefs(data) };
  },
  components: { PlayListCard, CoverRow, TopListCard },
};
</script>
<style lang="scss" scoped>
.recommend {
  width: 100%;
  .inner {
    display: grid;
    width: 100%;
    overflow: hidden;
    grid: repeat(1, 1fr) / auto-flow;

    grid-gap: 20px;
    > * {
      flex: 1 0 0;
    }

    @media screen and (max-width: 1440px) {
      grid: repeat(3, 1fr) / auto-flow;
    }
  }
}
</style>
