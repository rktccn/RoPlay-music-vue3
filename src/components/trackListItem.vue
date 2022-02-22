<template lang="">
  <div class="track-list-item" ref="refItem" :style="setStyle()">
    <div class="inner">
      <img
        class="cover"
        :src="`${song.imgUrl}?param=48y48`"
        alt=""
        v-if="song"
      />
      <div class="title">
        <div class="container">
          <div v-if="song" class="text-truncate">{{ song.title }}</div>
          <ArtistFormat
            :artistList="song.artists"
            v-show="itemWidth >= 2"
          ></ArtistFormat>
          <div></div>
        </div>
      </div>
      <div class="artist" v-show="itemWidth <= 1">
        <div v-if="song">
          <ArtistFormat :artistList="song.artists"></ArtistFormat>
        </div>
      </div>

      <div class="album" v-show="itemWidth === 0">
        <div v-if="song.album" class="text-truncate">{{ song.album.name }}</div>
      </div>

      <div class="more">
        <div class="duration" v-if="song">
          <span v-show="itemWidth <= 2">
            {{ song.duration }}
          </span>
        </div>
        <div class="like">
          <span class="material-icons-round"> favorite_border </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { timeFormat } from "../utils/common.js";

import ArtistFormat from "./artistFormat.vue";

export default {
  props: {
    item: { type: Object, required: true },
    type: { type: String, default: "song" },
    height: { type: String, default: "auto" },
    width: { type: String, default: null },
  },
  setup(props) {
    const data = reactive({
      itemWidth: 0,
      song: {
        imgUrl: null,
        artists: null,
        title: null,
        id: null,
        duration: 0,
        isLiked: false,
        canPlay: 0,
        album: null,
      },
    });

    const refItem = ref(null);

    // 初始化数据
    const initData = () => {
      const value = props.item;

      data.song.imgUrl = value.picUrl;
      data.song.artists = value.song.artists;
      data.song.title = value.name;
      data.song.id = value.id;
      data.song.duration = timeFormat(value.song.duration);
      data.song.canPlay = value.song.fee; // 0: 免费或无版权  1: VIP 歌曲   4: 购买专辑   8: 非会员可免费播放低音质，会员可播放高音质及下载
      data.song.album = value.song.album;
      // data.isLiked =
    };

    const calcWidth = () => {
      let width = refItem.value.offsetWidth;

      if (width >= 800) {
        data.itemWidth = 0;
      } else if (width >= 620) {
        data.itemWidth = 1;
      } else if (width >= 270) {
        data.itemWidth = 2;
      } else {
        data.itemWidth = 3;
      }
    };

    const setStyle = () => {
      let styles = {
        height: props.height,
        width: props.width,
      };
      return styles;
    };

    initData();

    onMounted(() => {
      calcWidth();
      window.addEventListener("resize", () => calcWidth(), false);
    });

    return { ...toRefs(data), refItem, calcWidth, setStyle };
  },
  components: {
    ArtistFormat,
  },
};
</script>
<style lang="scss">
.track-list-item {
  border-radius: $border-radius-default;
  padding: 8px;
  scroll-snap-align: start;

  .inner {
    display: flex;
    align-items: center;
    height: 100%;

    > * {
      margin-right: 16px;
    }
  }

  transition: background-color 0.3s;

  &:hover {
    background-color: var(--background-color-primary);

    .more {
      .duration {
        display: none;
      }
      .like {
        display: block;
      }
    }
  }
}

.cover {
  line-height: 0;
  border-radius: $border-radius-default;
  height: 100%;
}

.title {
  flex: 3;
  overflow: hidden;
  .container {
    display: flex;
    flex-direction: column;
  }
}

.artist {
  flex: 2;
  overflow: hidden;
}

.album {
  flex: 2;
  overflow: hidden;
}

.more {
  overflow: hidden;
  position: relative;
  user-select: none;

  .like {
    // position: absolute;
    // left: 0;
    // top: 0;
    display: none;
    cursor: pointer;
  }
}
</style>
