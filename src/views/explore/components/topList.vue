<template lang="">
  <div class="top-list">
    <div class="title" v-if="topList" :style="setBackGround()">
      <span class="name font-size-32">飙升榜</span>
    </div>
    <div class="list">
      <ul v-if="topList">
        <li><TrackListItem :item="topList"></TrackListItem></li>
        <li><TrackListItem :item="topList"></TrackListItem></li>
        <li><TrackListItem :item="topList"></TrackListItem></li>
        <li><TrackListItem :item="topList"></TrackListItem></li>
        <li><TrackListItem :item="topList"></TrackListItem></li>
      </ul>
    </div>
  </div>
</template>
<script>
import TrackListItem from "../../../components/trackListItem.vue";

import { getPlaylistDetail } from "../../../apis/playlist";
import { getTrackDetail } from "../../../apis/track";
import { reactive, toRefs } from "vue";

// 飙升 19723756   新歌 3779629  热歌 3778678

export default {
  setup() {
    const data = reactive({
      topList: null,
    });

    getPlaylistDetail(19723756).then((res) => {
      getTrackDetail(res.privileges[2].id).then((res2) => {
        console.log(res2);
        data.topList = res2.songs[0];
      });
    });

    const setBackGround = () => {
      let styles = {
        backgroundImage: `url(${data.topList.al.picUrl}?imageView&param=120y120&blur=40x20)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };

      return styles;
    };

    return { ...toRefs(data), setBackGround };
  },
  components: { TrackListItem },
};
</script>
<style lang="scss" scoped>
.top-list {
  display: flex;

  .title {
    border-radius: $border-radius-default;
    overflow: hidden;
    margin-right: 8px;

    user-select: none;

    .name {
      display: block;
      width: min-content;
      height: 100%;
      padding: 12px 20px;
      font-weight: 600;
      background-color: rgba($color: black, $alpha: 0.1);
      color: #fff;
    }
  }

  .list {
    flex: 1;
    width: 0;
  }
}
</style>
