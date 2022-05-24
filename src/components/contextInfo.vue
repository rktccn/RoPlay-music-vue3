<template lang="">
  <div class="context-info">
    <div class="avatar">
      <img :src="getImgUrl()" alt="alt" />
    </div>
    <div class="gap"></div>
    <div class="info">
      <span class="type font-size-12">{{ tag }}</span>
      <h2 class="title font-size-26">{{ item?.name || item.nickname }}</h2>
      <p class="sub-title" v-if="type === 'album'">
        <span class="date">{{ publishTime }}</span>
        <em>·</em>
        <span class="artist"
          ><ArtistFormat
            :artistList="item.artists"
            :fontSize="'16px'"
          ></ArtistFormat
        ></span>
      </p>
      <div class="describe" @click="showDescribe" v-if="description">
        {{ description }}
      </div>
      <div class="gap"></div>
      <div class="control" v-if="type !== 'user'">
        <button class="play primary" @click="playSong(id)">
          <span class="material-icons-round">play_arrow</span>
          播放
        </button>
        <button class="like material-icons-round font-size-20">
          favorite_border
        </button>
        <button class="more material-icons-round">more_horiz</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";
import { dateFormat } from "../utils/common";

import createTextModal from "../components/textModal.js";
import ArtistFormat from "./artistFormat.vue";
import { usePlayer } from "../store/player";
export default defineComponent({
  name: "contextInfo",
  props: {
    item: { type: Object, required: true },
    type: { type: String, required: true }, // playlist/album
  },
  setup(props) {
    const data = reactive({
      imgUrl: null,
      publishTime: null,
      tag: null,
      description: null,
      id: null,
      playSong: () => {},
    });
    let typeList = ["playlist", "album", "artist", "user"];

    const player = usePlayer();

    const initUser = () => {
      data.tag = "用户";
      data.description = props.item.description || "暂无简介";
      data.id = props.item.userId;
    };

    const initPlaylist = () => {
      data.tag = "歌单";
      data.description = props.item.description;
      data.id = props.item.id;
      data.playSong = player.playSongByPlaylist;
    };

    const initAlbum = () => {
      data.publishTime = dateFormat(props.item.publishTime);
      data.tag = "专辑";
      data.description = props.item.description;
      data.id = props.item.id;
      data.playSong = player.playSongByAlbum;
    };

    const initArtist = () => {
      data.tag = "歌手";
      data.description = props.item.briefDesc;
      data.id = props.item.id;
      data.playSong = player.playSongByArtist;
    };

    const getImgUrl = (): string => {
      let url =
        props.item?.coverImgUrl ||
        props.item?.picUrl ||
        props.item?.img1v1Url ||
        props.item?.avatarUrl;
      return `${url}?param=960y960`;
    };

    const initData = () => {
      switch (typeList.indexOf(props.type)) {
        case 0:
          initPlaylist();
          break;
        case 1:
          initAlbum();
          break;
        case 2:
          initArtist();
          break;
        case 3:
          initUser();
          break;
        default:
          throw `type 必须为 ${typeList}`;
      }
    };

    initData();

    const showDescribe = () => {
      createTextModal(`${data.tag}介绍`, data.description);
    };

    return { ...toRefs(data), player, getImgUrl, showDescribe };
  },
  components: {
    ArtistFormat,
  },
});
</script>
<style lang="scss" scoped>
.context-info {
  position: relative;
  width: 100%;
  display: flex;

  .avatar {
    overflow: hidden;
    width: 300px;
    align-items: center;
    line-height: 0;

    img {
      position: relative;
      top: 50%;
      transform: translateY(-50%);

      width: 100%;

      border-radius: $border-radius-default * 2;
    }
  }

  .gap {
    width: 34px;
  }

  .info {
    --gap: 12px;
    @media screen and(max-width:$md) {
      --gap: 8px;
    }

    flex: 1;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    padding: calc(var(--gap) * 3) 0;
    .type {
      width: auto;
      color: var(--text-color-secondary);
    }

    .title {
      padding-top: var(--gap);
      @include text-overflow(2);
      line-height: 1.2;
    }

    .sub-title {
      display: flex;
      margin-top: 2px;

      .date {
        color: var(--text-color-secondary);
      }

      em {
        margin: 0px 2px;
      }

      .artist {
        flex: 1 1 0;
        overflow: hidden;
      }
    }

    .describe {
      padding-top: calc(var(--gap) * 2);
      white-space: pre-line;
      @include text-overflow(3);
      line-height: 1.6;
      color: var(--text-color-secondary);
      transition: color $transition-time-default;

      &:hover {
        color: inherit;
        cursor: pointer;
      }
    }
    .gap {
      flex: 1;
    }
    .control {
      display: flex;
      padding-top: calc(var(--gap) * 2);
      text-align: center;

      > * {
        align-items: center;
        border-radius: $border-radius-default;
      }

      .play {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        padding-left: 12px;
        border-radius: $border-radius-default;
      }

      .like,
      .more {
        background-color: var(--background-color-primary);
        width: 40px;
        margin-left: 12px;
        // box-shadow: 0 0 0 1px var(--main-color);
      }
    }
  }
}

@media screen and(max-width:$lg) {
  .context-info {
    .avatar {
      @include calc-width(3.5);
    }

    .gap {
      @include calc-width(0.5);
    }
    .info {
      @include calc-width(6);

      .describe {
        @include text-overflow(1);
      }
    }
  }
}

@media screen and(max-width:$sm) {
  .context-info {
    flex-direction: column;
    .avatar {
      @include calc-width(5);

      img {
        transform: translateY(0%);
      }
    }

    .info {
      padding-top: 0px;
      width: 100%;

      .type {
        position: absolute;
        top: 5%;
        right: 5%;

        padding: 4px 8px;
        border-radius: $border-radius-default;
        color: var(--text-color-primary-container);
        background-color: var(--primary-container-color);
      }

      // .title {
      //   // transform: translateY(-100%);
      // }

      .describe {
        display: none;
      }
    }
  }
}
</style>
