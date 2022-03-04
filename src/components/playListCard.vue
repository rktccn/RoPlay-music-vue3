<template>
  <div
    class="card"
    :class="[{ video: type === 'video' }, { 'hover-show-dec': !showDec }]"
    @mouseenter="isDecShow = true"
    @mouseleave="isDecShow = showDec"
    :style="setWidth()"
  >
    <div class="card-inner">
      <div class="cover">
        <div class="cover-inner" :class="{ video: type === 'video' }">
          <div
            class="placeholder"
            :class="{ video: type === 'video' }"
            :style="setStyle()"
          ></div>
          <div
            :style="[{ backgroundImage: `url(${imgUrl})` }, setStyle()]"
            class="avator"
          />
          <div class="mask" :style="setStyle()">
            <span class="material-icons-round"> play_arrow </span>
          </div>
          <div class="played-count font-size-12" v-if="playCount">
            <span
              v-if="type !== 'video'"
              class="material-icons-round font-size-12"
            >
              headphones
            </span>
            <span
              v-if="type === 'video'"
              class="material-icons-round font-size-12"
            >
              smart_display
            </span>

            {{
              playCount > 10000
                ? parseInt(playCount / 1000) / 10 + "万"
                : playCount
            }}
          </div>
        </div>
      </div>
      <div
        class="dec"
        :class="{ showDec: !showDec }"
        v-show="isDecShow"
        :style="type === 'artist' ? { textAlign: 'center' } : ''"
      >
        <div class="tit text-truncate">{{ title }}</div>
        <ArtistFormat
          v-if="showArtist && type !== 'playlist'"
          :artistList="artists"
        />
        <div class="info text-truncate font-size-12">{{ setInfo() }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";

import { dateFormat } from "../utils/common.js";
import ArtistFormat from "./artistFormat.vue";

export default {
  name: "PlayListCard",
  props: {
    type: { type: String, required: true },
    // id: { type: Number, required: true },
    size: { type: String, default: null },
    showDec: { type: Boolean, default: true },
    showTime: { type: Boolean, default: false },
    showArtist: { type: Boolean, default: true },
    item: { type: Object, required: true },
  },
  setup(props) {
    const data = reactive({
      imgUrl: null,
      playCount: null,
      publishTime: null,
      artists: null,
      title: null,
      info: null,
      id: null,

      isDecShow: null,
    });

    const setVideo = () => {
      const video = props.item;

      data.imgUrl = `${video?.cover || video.coverUrl}?param=480y270`;
      data.playCount = video?.playCount ?? video?.playTime;
      data.publishTime = video?.publishTime;
      data.artists = video?.artists;
      data.title = video?.name ?? video?.title;
      data.id = video?.id ?? video?.vid;
    };

    const setPlayList = () => {
      const playlist = props.item;

      data.imgUrl = `${playlist.coverImgUrl}?param=480y480`;
      let date = dateFormat(playlist.createTime, false);
      data.publishTime = date;
      data.artists = playlist.creator;
      data.playCount = playlist.playCount;
      data.title = playlist.name;
      data.info = playlist.description;
    };

    const setAlbum = () => {
      const album = props.item;

      data.imgUrl = `${album.picUrl}?param=480y480`;
      let date = dateFormat(album.publishTime, false);
      data.publishTime = date;
      data.artists = album.artists;
      data.title = album.name;
    };

    const setArtist = () => {
      const artist = props.item;

      data.imgUrl = `${artist.picUrl}?param=480y480`;
      data.title = artist.name;
      data.id = artist.id;
    };

    if (props.type === "playlist") {
      setPlayList();
    } else if (props.type === "album") {
      setAlbum();
    } else if (props.type === "video") {
      setVideo();
    } else if (props.type === "artist") {
      setArtist();
    }

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
      case "artist":
        setArtist();
        break;
      default:
        console.log('类型必须为 "playlist" "album""video""artist"');
    }

    data.isDecShow = props.showDec;

    function setInfo() {
      if (props.type === "playlist") return data.info;
      if (props.type === "album" && props.showTime) return data.publishTime;
    }

    const setStyle = () => {
      let style = {
        borderRadius: null,
      };

      props.type === "artist" ? (style.borderRadius = "300px") : "";

      return style;
    };

    const setWidth = () => {
      let style = {
        width: null,
        maxWidth: null,
      };
      if (props.size) {
        style.width = props.size;
        style.maxWidth = props.size;
      }

      return style;
    };

    return { ...toRefs(data), setInfo, setStyle, setWidth };
  },
  components: { ArtistFormat },
};
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
.cover-inner {
  position: relative;

  cursor: pointer;

  .placeholder {
    width: 100%;
    padding-top: 100%;
    background-color: pink;
    border-radius: $border-radius-default;

    &.video {
      padding-top: 56.25%;
    }
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

    span {
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

      span {
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
    margin: 0px 0;
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
