<template lang="">
  <div class="section" v-if="artistList.length !== 0">
    <div class="title">
      <h4 class="text-style-title">歌曲</h4>
      <router-link :to="`/search/${w}/songs`" class="text-style-info"
        >查看全部</router-link
      >
    </div>
    <div class="">
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
  props: {
    w: { type: String, required: true },
  },
  setup(props) {
    const data = reactive({
      artistList: [],
    });

    const getSongDetail = (value) => {
      let ids = value.map((r) => r.id);
      getTrackDetail(ids.join(",")).then((res) => {
        data.artistList = res.songs;
      });
    };

    const getArtists = () => {
      let params = {
        keywords: props.w,
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
