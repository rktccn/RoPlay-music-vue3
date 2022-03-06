<template lang="">
  <div class="audioControl">
    <div class="main">
      <div class="left">
        <img :src="imgUrl" alt="" class="cover" v-if="imgUrl" />
        <div class="music-info">
          <div class="title">{{ name }}</div>
          <ArtistFormat :artistList="artists"></ArtistFormat>
        </div>
        <div class="left-control">
          <span class="like">1</span>
          <span class="add-to-playlist">2</span>
          <span class="show-lyric-page">3</span>
          <span class="more">4</span>
        </div>
      </div>
      <div class="control">
        <span class="play-mode">顺序</span>
        <span class="play-prev">上一首</span>
        <span class="play-or-pause font-size-24">播放</span>
        <span class="play-next">下一首</span>
        <span class="volume">音量</span>
      </div>
      <div class="right">
        <span class="show-tracklist">播放列表</span>
      </div>
    </div>
    <div class="progress"></div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { getTrackDetail } from "../apis/track";
import { timeFormat } from "../utils/common";

import ArtistFormat from "./artistFormat.vue";

export default {
  setup() {
    const data = reactive({
      imgUrl: null,
      artists: null,
      name: null,
      id: null,
      duration: 0,
      isLiked: false,
      canPlay: 0,
    });

    getTrackDetail(386538).then((res) => {
      getDate(res.songs[0]);
    });

    const getDate = (value) => {
      data.imgUrl = `${value.al.picUrl}?param=48y48`;
      data.artists = value.ar;
      data.name = value.name;
      data.duration = timeFormat(value.dt);
      //   data.isLiked;
      data.canPlay = value.fee === 0; // 0: 免费或无版权  1: VIP 歌曲   4: 购买专辑   8: 非会员可免费播放低音质，会员可播放高音质及下载
    };

    return { ...toRefs(data) };
  },
  components: { ArtistFormat },
};
</script>
<style lang="scss" scoped>
.audioControl {
  background-color: var(--background-color-primary);

  .main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      flex: 1 1 0;
    }

    .control {
      flex: 2 1 0;
      text-align: center;
    }

    .right {
      flex: 1 1 0;
      text-align: right;
    }
  }
}
</style>
