<template>
  <div
    :class="[
      { video: type === 'video' || type === 'mv' },
      { 'hover-show-dec': !showDec },
    ]"
    :style="setWidth()"
    class="card"
    @mouseenter="isDecShow = true"
    @mouseleave="isDecShow = showDec"
  >
    <div class="card-inner">
      <div class="cover" :class="{ video: type === 'video' || type === 'mv' }">
        <div
          :style="[{ backgroundImage: `url(${imgUrl})` }, setStyle()]"
          class="avator"
        />
        <div class="mask" :style="setStyle()" @click.self="goTo">
          <svg-icon
            class="icon"
            :name="`round-play_arrow`"
            :size="64"
            color="#fff"
            @click.self="playSong(id)"
          />
        </div>
      </div>
      <div
        v-show="showDec"
        :class="{ showDec: !showDec }"
        :style="type === 'artist' ? { textAlign: 'center' } : ''"
        class="dec"
      >
        <div class="tit text-truncate">{{ title }}</div>
        <ArtistFormat
          v-if="showArtist && type !== 'playlist'"
          :artistList="artists"
        />
        <div class="info text-truncate font-size-12" v-show="showArtist">
          {{ setInfo() }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { dateFormat } from "../utils/common.js";
import { useRouter } from "vue-router";
import { usePlayer } from "../store/player.js";

import ArtistFormat from "./artistFormat.vue";

export default defineComponent({
  name: "PlaylistCard",
  props: {
    type: { type: String, required: true },
    // id: { type: Number, required: true },
    size: { type: String, default: null },
    showDec: { type: Boolean, default: true }, // 控制歌单名和描述的显示
    showTime: { type: Boolean, default: false },
    showArtist: { type: Boolean, default: true }, // 控制歌手和描述的显示
    item: { type: Object, required: true },
  },
  setup(props) {
    //检查传入的参数
    const type = ["playlist", "album", "artist", "video", "mv"];

    const checkProps = () => {
      if (type.indexOf(props.type) === -1) {
        console.error(
          `type:${props.type} is not a valid type must be one of ${type} -- PlayListCard`
        );
      }

      // 检查是否存在item
      if (!props.item) {
        console.error(`item is required -- PlayListCard`);
      }
    };
    checkProps();

    const router = useRouter();
    const data = reactive({
      imgUrl: "",
      publishTime: "",
      updataTime: "",
      artists: null,
      title: "",
      info: "",
      id: 0,
      playSong: (id: number) => {},

      isDecShow: true,
    });
    const player = usePlayer();

    const goTo = () => {
      router.push(`/${props.type}/${data.id}`);
    };

    const setVideo = () => {
      const video = props.item;

      data.imgUrl = `${
        video?.cover || video?.coverUrl || video?.imgurl
      }?param=480y270`;
      data.publishTime = video?.publishTime;
      data.artists = video?.artists;
      data.title = video?.name ?? video?.title;
      data.id = video?.id ?? video?.vid;
      data.playSong = goTo;
    };

    const setPlayList = () => {
      const playlist = props.item;
      data.imgUrl = `${playlist.coverImgUrl || playlist.picUrl}?param=480y480`;
      data.publishTime = dateFormat(playlist.createTime, false);
      data.updataTime = dateFormat(playlist.updateTime, false);
      data.artists = playlist.creator;
      data.title = playlist.name;
      data.info = playlist.description;
      data.id = playlist.id;
      data.playSong = player.playSongByPlaylist;
    };

    const setAlbum = () => {
      const album = props.item;

      data.imgUrl = `${album.picUrl}?param=480y480`;
      data.publishTime = dateFormat(album.publishTime, false);
      data.artists = album.artists;
      data.title = album.name;
      data.id = album.id;
      data.playSong = player.playSongByAlbum;
    };

    const setArtist = () => {
      const artist = props.item;

      data.imgUrl = `${artist.picUrl}?param=480y480`;
      data.title = artist.name;
      data.id = artist.id;
      data.playSong = player.playSongByArtist;
    };

    switch (props.type) {
      case "playlist":
        setPlayList();
        break;
      case "album":
        setAlbum();
        break;
      case "video":
        setVideo();
        break;
      case "mv":
        setVideo();
        break;
      case "artist":
        setArtist();
        break;
      default:
        break;
    }

    data.isDecShow = props.showDec;

    function setInfo() {
      if (props.type === "playlist" && props.showTime)
        return `${data.updataTime}更新`;
      if (props.type === "playlist") return data.info;
      if (props.type === "album" && props.showTime) return data.publishTime;
    }

    const setStyle = () => {
      let style = {
        borderRadius: "",
      };

      props.type === "artist" ? (style.borderRadius = "50%") : ""; // 显示音乐人时修改为圆形
      return style;
    };

    const setWidth = () => {
      let style = {
        width: "",
        maxWidth: "",
      };
      if (props.size) {
        style.width = props.size;
        style.maxWidth = props.size;
      }

      return style;
    };

    return { ...toRefs(data), setInfo, setStyle, setWidth, goTo };
  },
  components: { ArtistFormat },
});
</script>
<style lang="scss" scoped>
.card {
  @include calc-width(2);
  scroll-snap-align: start;
  display: inline-block;

  @media screen and (max-width: $lg) {
    @include calc-width(2.5);
  }
}

.card.video {
  @include calc-width(3);
}

.card-inner {
  text-align: left;
  margin: 0.6vw 0.9vw;

  transform: translateY(0px);
}

.cover {
  position: relative;
  aspect-ratio: 1/1;
  cursor: pointer;

  &.video {
    aspect-ratio: 16/9;
  }

  .avator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-position: center;
    border-radius: $border-radius-default;

    transition: all $transition-time-default;

    @include blurShadow;

    &::after {
      opacity: 0;
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    transition: all $transition-time-default;
    border-radius: $border-radius-default;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 5rem;
      color: #fff;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: all $transition-time-default;
    }
  }

  .played-count {
    position: absolute;
    right: 5%;
    bottom: 5%;

    display: flex;
    align-items: center;

    padding: 2px 10px;
    border-radius: 20px;

    background-color: rgba($color: black, $alpha: 0.7);
    color: #fff;

    span {
      color: #fff;
      margin-right: 2px;
    }
  }

  &:hover {
    .avator {
      background-size: 105% 105%;
      // transform: scale(105%);
    }

    .mask {
      background-color: rgba(0, 0, 0, 0.2);

      .icon {
        opacity: 1;
      }
    }

    .played-count {
      opacity: 0;
    }
  }
}

.dec {
  margin-top: 3px;

  > * {
    margin: 0;
  }

  &.showDec {
    position: absolute;
    bottom: -40px;
    left: 0;
    width: 100%;
  }

  .info {
    color: var(--text-color-secondary);
  }
}

.hover-show-dec {
  .card-inner {
    transition: transform $transition-time-default;
  }

  &:hover {
    .card-inner {
      transform: translateY(-40px);
    }

    .avator {
      &::after {
        opacity: 1;
      }
    }
  }
}
</style>
