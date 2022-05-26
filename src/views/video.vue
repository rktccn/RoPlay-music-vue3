<template lang="">
  <div class="video">
    <div class="left">
      <div class="video-player">
        <video
          id="video"
          class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered"
          controls
        >
          <source src="videoUrl" v-if="videoUrl" type="video/mp4" />
        </video>
      </div>
      <div class="video-info" v-if="videoInfo">
        <div class="name">
          <div class="title text-style-title">
            {{ videoInfo.name }}
          </div>
          <em>-</em>
          <div class="artist-list text-style-info">
            <ArtistFormat
              :artistList="videoInfo.artists"
              fontSize="16px"
            ></ArtistFormat>
          </div>
        </div>
        <div class="describe" @click="showDescribe">{{ videoInfo.desc }}</div>
      </div>
    </div>
    <div class="right">
      <div class="text-style-title">相似MV</div>
      <ul class="video-list" v-if="simiMv">
        <li
          class="item"
          v-for="(mv, index) in simiMv"
          :key="index"
          @click.self="goTo(mv.id)"
        >
          <el-image class="pic" lazy :src="mv.cover" alt="" />
          <div class="info" @click.self="goTo(mv.id)">
            <div class="name text-style-title" @click.self="goTo(mv.id)">
              {{ mv.name }}
            </div>
            <div class="artist text-truncate">
              <ArtistFormat
                :artistList="mv.artists"
                @click.self="goTo(mv.id)"
              ></ArtistFormat>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { onUnmounted, reactive, toRefs } from "vue-demi";
import { getMVDetail, getMVUrl, getSimiMv } from "../apis/mv";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { usePlayer } from "../store/player";
import { useRoute, useRouter } from "vue-router";

import ArtistFormat from "../components/artistFormat.vue";
import createTextModal from "../components/textModal";

export default {
  name: "Video",
  setup() {
    const data = reactive({
      videoInfo: null,
      videoUrl: null,
      simiMv: null,
    });
    let vPlayer;
    const player = usePlayer();
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;

    const getData = async () => {
      await getMVDetail(id).then((res) => {
        data.videoInfo = res.data;
      });

      await getMVUrl(id).then((res) => {
        data.videoUrl = res.data.url;
      });

      getSimiMv(id).then((res) => {
        data.simiMv = res.mvs.splice(0, 3);
      });

      vPlayer = videojs(
        "video",
        {
          autoplay: false,
          poster: data.videoInfo.cover,
          sources: [{ src: data.videoUrl, type: "video/mp4" }],
          preload: "metadata",
        },
        function onPlayerReady() {
          this.on("play", function () {
            //开始播放
            player.songPause();
          });
        }
      );
    };

    getData();

    const showDescribe = () => {
      createTextModal(`MV介绍`, data.videoInfo.desc);
    };

    const goTo = (id) => {
      router.push({
        params: { id },
      });
    };

    onUnmounted(() => {
      vPlayer.dispose();
    });

    return { ...toRefs(data), showDescribe, goTo };
  },
  components: {
    ArtistFormat,
  },
};
</script>
<style lang="scss" scoped>
.video {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .left {
    @include calc-width(7.4);

    .video-player {
      width: 100%;

      #video {
        width: 100%;
      }
    }

    .video-info {
      padding: 8px;
    }

    .name {
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .title {
      max-width: 45%;
      @include text-overflow(1);
    }

    .artist-list {
      max-width: 45%;
      @include text-overflow(1);
    }

    em {
      padding: 0 8px;
    }

    .describe {
      @include text-overflow(2);
      cursor: pointer;
      &:hover {
        text-decoration-line: underline;
      }
    }
  }

  .right {
    @include calc-width(2.4);
    user-select: none;

    .video-list {
      display: flex;
      flex-direction: column;
    }
    .item {
      position: relative;
      width: 100%;
      margin-bottom: 16px;
      border-radius: $border-radius-default;
      line-height: 0;
      overflow: hidden;
      cursor: pointer;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.5) 100%
        );
        opacity: 0;
        transition: opacity $transition-time-default;
      }

      &:hover {
        &::before {
          opacity: 1;
        }
        .info {
          display: block;
        }
      }

      .pic {
        width: 100%;
      }

      .info {
        display: none;
        line-height: 1.6;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 16px;
        color: #fff;

        .name {
          animation: drop-right $transition-time-default;
          @include text-overflow(1);
        }

        .artist {
          animation: drop-right $transition-time-default * 1.5;
          @include text-overflow(1);
        }
      }
    }
  }
}

@media screen and(max-width:$lg) {
  .video {
    flex-direction: column;
    .left {
      @include calc-width(10);
    }

    .right {
      margin-top: 36px;
      @include calc-width(10);

      .video-list {
        flex-direction: row;
        .item {
          &:nth-child(2) {
            margin: 0 16px;
          }
        }
      }
    }
  }
}

@media screen and(max-width:$sm) {
  .video {
    flex-direction: column;
    .left {
      @include calc-width(5);
    }

    .right {
      margin-top: 64px;
      @include calc-width(5);

      .video-list {
        flex-direction: row;
        .item {
          &:nth-child(2) {
            margin-right: 16px;
          }
        }
      }
    }
  }
}

@keyframes drop-right {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
