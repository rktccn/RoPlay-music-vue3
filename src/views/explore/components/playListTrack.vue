<template lang="">
  <div class="top-list">
    <div class="title" v-if="topList" :style="setBackGround()">
      <span class="name font-size-32">{{ setTitle() }}</span>
    </div>
    <div class="list">
      <ul v-if="topList">
        <li v-for="(item, index) in topList" :key="index" class="list-item">
          <span class="rank font-size-16">{{ index + 1 }}</span>
          <TrackListItem :item="item" class="info"></TrackListItem>
        </li>
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
  props: {
    id: { type: Number, required: true },
    type: { type: String, default: "playList" }, // playList,topList
  },
  setup(props) {
    const data = reactive({
      topList: null,
    });

    let PlaylistInfo = null;

    getPlaylistDetail(props.id).then((res) => {
      PlaylistInfo = res.playlist;
      getTrackDetail(
        `${res.privileges[0].id}, ${res.privileges[1].id}, ${res.privileges[2].id}, ${res.privileges[3].id}, ${res.privileges[4].id}`
      ).then((res2) => {
        data.topList = res2.songs;
      });
    });

    const setBackGround = () => {
      let styles = {
        backgroundImage: `url(${data.topList[0].al.picUrl}?imageView&param=120y120&blur=40x20)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };

      return styles;
    };

    const setTitle = () => {
      return PlaylistInfo.name;
    };

    return { ...toRefs(data), setBackGround, setTitle };
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
    background-color: black;

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
    overflow: hidden;

    .list-item {
      display: flex;
      align-items: center;

      .rank {
        color: var(--main-color);
        font-weight: 600;
        margin: 0 4px;
      }

      .info {
        flex: 1;
        width: 0;
      }
    }
  }
}
</style>
