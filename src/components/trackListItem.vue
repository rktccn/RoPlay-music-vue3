<template lang="">
  <div class="track-list-item" ref="refItem" :style="setStyle()">
    <div class="inner">
      <img class="cover" :src="`${imgUrl}?param=48y48`" alt="" v-if="imgUrl" />
      <div class="title">
        <div class="container">
          <div v-if="artists" class="text-truncate">{{ title }}</div>
          <ArtistFormat
            :artistList="artists"
            v-show="itemWidth >= 2"
          ></ArtistFormat>
          <div></div>
        </div>
      </div>
      <div class="artist" v-show="itemWidth <= 1">
        <div v-if="artists">
          <ArtistFormat :artistList="artists"></ArtistFormat>
        </div>
      </div>

      <div class="describe" v-show="itemWidth === 0">
        <div v-if="describe" class="text-truncate">{{ describe.name }}</div>
      </div>

      <div class="more">
        <div class="duration" v-if="duration">
          <span v-show="itemWidth <= 2">
            {{ duration }}
          </span>
        </div>
        <div class="like" :class="{ normal: itemWidth <= 2 }">
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
      imgUrl: null,
      artists: null,
      title: null,
      id: null,
      duration: 0,
      isLiked: false,
      canPlay: 0,
      describe: null,
    });

    const track = props.item;

    const refItem = ref(null);

    const calcWidth = (width) => {
      // let width = refItem.value.offsetWidth;

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

    const getArtists = () => {
      data.artists = track?.artists ?? track?.ar;
    };

    const getImgUrl = () => {
      data.imgUrl =
        track?.al?.picUrl ??
        track?.album?.picUrl ??
        "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
    };

    const getDuration = () => {
      const dt = track?.duration ?? track?.dt ?? "null";

      data.duration = timeFormat(dt);
    };

    const getDescribe = () => {
      switch (props.type) {
        case "song":
          data.describe = track?.album ?? track?.al;
          break;
        default:
          data.describe = null;
      }
    };

    // 初始化数据
    const initData = () => {
      getArtists();
      getImgUrl();
      getDuration();
      getDescribe();
      data.title = track.name;
      data.id = track.id;
      data.canPlay = track.fee; // 0: 免费或无版权  1: VIP 歌曲   4: 购买专辑   8: 非会员可免费播放低音质，会员可播放高音质及下载
      // data.isLiked =
    };

    initData();

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        calcWidth(cr.width);
      }
    });

    onMounted(() => {
      calcWidth();
      ro.observe(refItem.value);
    });

    return { ...toRefs(data), refItem, calcWidth, setStyle };
  },
  components: {
    ArtistFormat,
  },
};
</script>
<style lang="scss" scoped>
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
        opacity: 0;
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
  flex: 4 1 0;
  overflow: hidden;
  .container {
    display: flex;
    flex-direction: column;
  }
}

.artist {
  flex: 2 1 0;
  overflow: hidden;
}

.describe {
  flex: 2 1 0;
  overflow: hidden;
}

.more {
  display: flex;
  position: relative;
  user-select: none;

  @media screen and(max-width:$sm) {
    display: none;
  }

  .like {
    &.normal {
      position: absolute;
      right: 0;
      top: 0;
    }

    display: none;
    cursor: pointer;
  }
}
</style>
