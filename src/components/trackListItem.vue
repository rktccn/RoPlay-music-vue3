<template>
  <div
      class="track-list-item"
      :class="{ hover: canHover && canPlay !== -1, disable: canPlay === -1 }"
      ref="refItem"
      :style="setStyle()"
      @dblclick="player.replaceCurrentTrack(id)"
      @click.right="showContextMenu"
  >
    <div class="inner">
      <div class="inner__cover" v-if="imgUrl && showImg && type !== 'album'">
        <el-image
            lazy
            class="inner__cover__img"
            :src="`${imgUrl}?param=64y64`"
            alt=""
            :class="itemWidth > 2 ? ' hide-in-sm' : ''"
        />
      </div>
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
          {{ describe.name }}
        </router-link
        >
      </div>
      <div class="more">
        <div class="duration" v-if="duration">
          <span v-show="itemWidth <= 2">
            {{ duration }}
          </span>
        </div>
        <div class="like" :class="{ normal: itemWidth <= 2 }">
          <svg-icon
              :class="{ fill: isLiked }"
              :name="`round-favorite_border`"
              :size="24"
              color="#454f63"
              @click="toggleLike"
          />

        </div>
      </div>
      <svg-icon
          class="play"
          :name="`round-play_arrow`"
          :size="24"
          color="#454f63"
          @click="player.replaceCurrentTrack(id)"/>


    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import {timeFormat} from "../utils/common.js";
import {usePlayer} from "../store/player.js";
import {getMP3, likeATrack} from "../apis/track.js";

import ArtistFormat from "./artistFormat.vue";
import createContextMenu from "./contextMenu";

export default defineComponent({
  name: "trackListItem",
  props: {
    item: {type: Object, required: true},
    type: {type: String, default: "song"}, // 类型 song/album
    height: {type: String, default: "64px"},
    showImg: {type: Boolean, default: true},
    canHover: {type: Boolean, default: true}, // 是否显示hover样式
    index: {type: Number}, // 数字替代缩略图
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
      canPlay: 0, // -1:无版权 0: 免费  1: VIP 歌曲   4: 购买专辑   8: 非会员可免费播放低音质，会员可播放高音质及下载
      musicUrl: null,
      describe: null,
    });

    const track = props.item;

    const player = usePlayer();

    const refItem = ref(null);

    const calcWidth = (width: Number) => {
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

    const setStyle = (): object => {
      return {
        height: props.height,
      };
    };

    const getArtists = () => {
      data.artists = track?.artists ?? track?.ar;
    };

    const getImgUrl = () => {
      data.imgUrl =
          track?.al?.picUrl ??
          track?.album?.picUrl ??
          `https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg`;
    };

    const getDuration = () => {
      const dt = track?.duration ?? track?.dt ?? "null";

      data.duration = +timeFormat(dt);
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

    // 获取音乐播放链接
    const getMusicUrl = async () => {
      const res = await getMP3(track.id);
      if (res.data[0].url) {
        data.musicUrl = res.data[0].url;
        data.canPlay = track.fee;
      } else {
        data.musicUrl = null;
        data.canPlay = -1;
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
      getMusicUrl();
      data.isLiked = player.likedSongIDs.includes(track.id);
    };

    initData();

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        calcWidth(cr.width);
      }
    });

    // 打开右键菜单
    const showContextMenu = (e: any) => {
      createContextMenu(e, data.id);
    };

    // 切换收藏
    const toggleLike = async () => {
      if (data.isLiked) {
        await likeATrack({id: data.id, like: false});
        data.isLiked = false;
        player.likedSongIDs.splice(player.likedSongIDs.indexOf(data.id), 1);
      } else {
        await likeATrack({id: data.id, like: true});
        data.isLiked = true;
        player.likedSongIDs.push(data.id);
      }
    };

    onMounted(() => {
      calcWidth(window.innerWidth);
      ro.observe(refItem.value);
    });

    onBeforeUnmount(() => {
      ro.disconnect();
    });

    return {
      ...toRefs(data),
      player,
      refItem,
      calcWidth,
      setStyle,
      showContextMenu,
      toggleLike,
    };
  },
  components: {
    ArtistFormat,
  },
});
</script>
<style lang="scss" scoped>
.track-list-item {
  position: relative;
  padding: 8px;
  border-radius: $border-radius-default;
  scroll-snap-align: start;
  overflow: hidden;
  transition: background-color $transition-time-default;

  &.disable {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: saturate(0);
    }
  }

  .inner {
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 48px;

    &__cover {
      height: 100%;
      width: 48px;

      &__img {
        line-height: 0;
        border-radius: $border-radius-default;
        height: 100%;
      }
    }

    > * {
      margin-right: 16px;
    }
  }
}

.hover:hover {
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
  align-items: center;
  position: relative;
  user-select: none;

  @media screen and(max-width: $sm) {
    display: none;
  }

  .like {
    line-height: 0;

    &.normal {
      position: absolute;
      right: 0;
    }

    .fill {
      color: #ea4c89;
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
