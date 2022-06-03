<template>
  <div class="top-list">
    <div class="title" v-if="topList" :style="setBackGround()">
      <span class="name font-size-32">{{ name }}</span>
      <div class="more" @click="goToPlaylist()">更多</div>
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
<script lang="ts">
import TrackListItem from "../../../components/trackListItem.vue";

import {getPlaylistTracks} from "../../../apis/playlist";
import {defineComponent, reactive, toRefs} from "vue";
import {useRouter} from "vue-router";

// 飙升 19723756   新歌 3779629  热歌 3778678

export default defineComponent({
  name: "explorePlayList",
  props: {
    id: {type: Number, required: true},
    name: {type: String, required: true},
  },
  setup(props) {
    const router = useRouter();

    const data = reactive({
      topList: null,
    });

    getPlaylistTracks({
      id: props.id,
      limit: 5,
      offset: 0,
    }).then((res) => {
      data.topList = res.songs;
    });

    const setBackGround = () => {
      return {
        backgroundImage: `url(${data.topList[0].al.picUrl}?imageView&param=120y120&blur=40x20)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    };

    // 点击前往歌单页面
    const goToPlaylist = () => {
      router.push(`/playlist/${props.id}`);
    };

    return { ...toRefs(data), setBackGround, goToPlaylist };
  },
  components: { TrackListItem },
});
</script>
<style lang="scss" scoped>
.top-list {
  display: flex;

  .title {
    border-radius: $border-radius-default;
    overflow: hidden;
    margin-right: 8px;

    user-select: none;
    background-color: rgb(68, 55, 55);

    .name {
      display: block;
      width: min-content;
      height: 100%;
      padding: 12px 20px;
      font-weight: 600;
      background-color: rgba($color: black, $alpha: 0.1);
      color: #fff;
    }

    .more {
      position: relative;
      top: -10%;
      width: 100%;
      text-align: center;
      font-weight: bolder;
      color: #fff;
      opacity: 0.88;

      cursor: pointer;
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
