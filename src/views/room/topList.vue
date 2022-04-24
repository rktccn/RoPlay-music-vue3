<template lang="">
  <div>
    <div class="recommend">
      <h4 class="text-style-title">精挑细选</h4>
      <div class="inner">
        <li
          v-for="(item, index) in recommendList"
          :key="index"
          class="track-item block"
        >
          <TopListCard :name="item.name" :id="item.id"></TopListCard>
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
      recommendList: [
        {
          name: "飙升榜",
          id: 19723756,
        },
        {
          name: "原创榜",
          id: 2884035,
        },
        {
          name: "新歌榜",
          id: 3779629,
        },
      ],
    });

    // 获取排行榜
    const getData = () => {
      getTopList().then((res) => {
        data.TopLists = res.list;
        data.TopArtist = res.artistToplist;
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
