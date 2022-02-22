<template>
  <div class="card" :class="{ video: type === 'video' }">
    <div class="card-inner" :style="setWidth()">
      <div class="cover">
        <div class="cover-inner" :class="{ video: type === 'video' }">
          <div class="placeholder" :class="{ video: type === 'video' }"></div>

          <img
            :src="`${imgUrl}?param=480y480`"
            alt=""
            v-if="type !== 'video'"
          />
          <img
            :src="`${imgUrl}?param=480y270`"
            alt=""
            v-if="type === 'video'"
          />
          <div class="mask">
            <span class="material-icons-round"> play_arrow </span>
          </div>
          <div class="played-count font-size-12">
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
      <div class="dec">
        <div class="tit text-truncate">{{ title }}</div>
        <ArtistFormat
          v-if="showArtist && type !== 'playlist'"
          :artistList="artists"
        />
        <div class="info text-truncate font-size-12" v-html="setInfo()"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";

import { dateFormat } from "../utils/common.js";
import ArtistFormat from "./artistFormat.vue";

export default {
  props: {
    type: { type: String, required: true },
    // id: { type: Number, required: true },
    size: { type: String, default: null },
    showDec: { type: Boolean, default: true },
    showTime: { type: Boolean, default: true },
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
    });

    if (props.type === "playlist") {
      const playlist = props.item;

      data.imgUrl = playlist.coverImgUrl;
      let date = dateFormat(playlist.createTime, false);
      data.publishTime = date;
      data.artists = playlist.creator;
      data.playCount = playlist.playCount;
      data.title = playlist.name;
      data.info = playlist.description;
    } else if (props.type === "album") {
      const album = props.item;

      data.imgUrl = album.picUrl;
      let date = dateFormat(album.publishTime, false);
      data.publishTime = date;
      data.artists = album.artists;
      data.title = album.name;
    } else if (props.type === "video") {
      const video = props.item;

      data.imgUrl = video.cover;
      data.playCount = video.mv.plays;
      data.publishTime = video.mv.publishTime;
      data.artists = video.mv.artists;
      data.title = video.mv.title;
      data.info = video.mv.name;
      data.id = video.id;
    }

    function setInfo() {
      if (props.type === "playlist") return data.info;
      if (props.type === "album" && props.showTime) return data.publishTime;
    }

    function setWidth() {
      if (props.size) {
        let style = {};
        style.width = props.size;
        return style;
      }
    }
    return { ...toRefs(data), setInfo, setWidth };
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

  max-width: 280px;
}

.card.video {
  @include calc-width(3);

  max-width: 420px;
}

.card-inner {
  text-align: left;
  margin: 8px 12px;
}
.cover-inner {
  position: relative;
  border-radius: $border-radius-default;
  overflow: hidden;
  cursor: pointer;

  .placeholder {
    width: 100%;
    padding-top: 100%;
    background-color: pink;

    &.video {
      padding-top: 56.25%;
    }
  }

  img {
    position: absolute;
    top: 0;
    left: 0;

    display: block;
    width: 100%;
    transition: all 0.15s;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    transition: all 0.15s;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 5rem;
      color: #fff;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: all 0.15s;
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
    img {
      transform: scale(105%);
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
  .info {
    color: var(--text-color-secondary);
  }
}
</style>
