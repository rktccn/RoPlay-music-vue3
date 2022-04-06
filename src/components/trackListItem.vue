<template lang="">
  <div
    class="track-list-item"
    :class="{ hover: canHover }"
    ref="refItem"
    :style="setStyle()"
  >
    <div class="inner" @dblclick="player.replaceCurrentTrack(id, canPlay)">
      <img
        class="cover"
        :src="`${imgUrl}?param=224y224`"
        alt=""
        v-if="imgUrl && showImg && type !== 'album'"
        :class="itemWidth > 2 ? ' hide-in-sm' : ''"
      />
      <span class="index font-size-16" v-if="type === 'album'">{{
        index
      }}</span>
      <div class="title">
        <div class="container">
          <div v-if="artists" class="text-truncate">{{ title }}</div>
          <ArtistFormat
            :artistList="artists"
            v-show="itemWidth >= 2"
          ></ArtistFormat>
        </div>
      </div>
      <div class="artist-md" v-show="itemWidth <= 1 && type !== 'album'">
        <div v-if="artists">
          <ArtistFormat :artistList="artists"></ArtistFormat>
        </div>
      </div>

      <!-- 专辑 -->
      <div class="describe" v-show="itemWidth === 0 && type !== 'album'">
        <router-link
          :to="`/album/${describe.id}`"
          v-if="describe"
          class="text-truncate"
        >
          {{ describe.name }}</router-link
        >
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
      <span
        class="play material-icons-round"
        @click="player.replaceCurrentTrack(id)"
        >play_arrow</span
      >
    </div>
  </div>
</template>
<script>
import { onBeforeUnmount, onMounted, reactive, ref, toRefs } from "vue";
import { timeFormat } from "../utils/common.js";
import { usePlayer } from "../store/player.js";

import ArtistFormat from "./artistFormat.vue";

export default {
  name: "trackListItem",
  props: {
    item: { type: Object, required: true },
    type: { type: String, default: "song" }, // 类型 song/album
    height: { type: String, default: "64px" },
    showImg: { type: Boolean, default: true },
    canHover: { type: Boolean, default: true }, // 是否显示hover样式
    index: { type: Number },
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
    const player = usePlayer();

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
        // width: props.width,
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

    onBeforeUnmount(() => {
      ro.disconnect(refItem.value);
    });

    return { ...toRefs(data), player, refItem, calcWidth, setStyle };
  },
  components: {
    ArtistFormat,
  },
};
</script>
<style lang="scss" scoped>
.track-list-item {
  padding: 8px;
  border-radius: $border-radius-default;

  scroll-snap-align: start;

  .inner {
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 48px;

    > * {
      margin-right: 16px;
    }
  }

  transition: background-color $transition-time-default;

  &:hover {
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
.hover:hover {
  background-color: var(--background-color-primary);
}
.cover {
  line-height: 0;
  border-radius: $border-radius-default;
  height: 100%;
}

.index {
  width: 48px;
  margin-right: 0 !important;
  padding-left: 8px;
  font-weight: bolder;
  color: var(--text-color-secondary);
}

.title {
  flex: 4 1 0;
  overflow: hidden;
  .container {
    display: flex;
    flex-direction: column;
  }
}

.artist-md {
  flex: 2 1 0;
  overflow: hidden;
}

.artist-small {
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

.play {
  display: none;
  @media screen and (max-width: $sm) {
    display: block;
  }
}
</style>
