<template lang="">
  <div class="audioControl material-theme">
    <div class="main">
      <div class="left">
        <img
          :src="`${
            currentTrack?.al?.picUrl ??
            'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg'
          }?param=48y48`"
          alt=""
          class="cover"
        />
        <div class="music-info text-truncate" v-if="currentTrack">
          <div class="title text-truncate">{{ currentTrack.name }}</div>
          <ArtistFormat :artistList="currentTrack.ar"></ArtistFormat>
        </div>
        <ul class="left-control">
          <li class="like material-icons-round font-size-20">
            favorite_border
          </li>
          <li class="add-to-playlist material-icons-round font-size-20">
            playlist_add
          </li>
          <li class="show-lyric-page material-icons-round font-size-20">
            open_in_full
          </li>
          <li class="more material-icons-round font-size-20">more_horiz</li>
        </ul>
      </div>
      <ul class="control">
        <li class="play-mode material-icons-round font-size-20">repeat</li>
        <li
          class="play-prev material-icons-round font-size-32"
          @click="player.playPrev()"
        >
          skip_previous
        </li>
        <li
          class="play-or-pause material-icons-round font-size-38"
          @click="player.playOrPause()"
        >
          {{ player.isPlaying ? "pause" : "play_arrow" }}
        </li>
        <li
          class="play-next material-icons-round font-size-32"
          @click="player.playNext()"
        >
          skip_next
        </li>
        <li
          class="volume material-icons-round font-size-20"
          @click="setVolumeIcon"
        >
          volume_up
        </li>
      </ul>
      <div class="right">
        <span class="show-tracklist material-icons-round" @click="goCurrentList"
          >queue_music</span
        >
      </div>
    </div>
    <div class="progress">
      <em class="time-current font-size-12">{{ timeFormat(progress) }}</em>
      <vue-slider
        class="progress-slider"
        v-model="progress"
        :min="0"
        :max="currentTrack?.dt"
        dotSize="6"
        height="2px"
        :dragOnClick="true"
        :lazy="true"
        tooltip="hover"
        :tooltip-formatter="timeFormat"
      />
      <em class="time-duration font-size-12">{{
        player.getCurrentDuration
      }}</em>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref, toRef, toRefs, watch } from "vue";
import { timeFormat } from "../utils/common";
import { usePlayer } from "../store/player";

import ArtistFormat from "./artistFormat.vue";
import VueSlider from "vue-slider-component";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
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
      trackUrl: null,
    });

    const player = usePlayer();
    const { currentTrack } = storeToRefs(player);
    const router = useRouter();

    const progress = computed({
      get: () => player.getProgress,
      set: (val) => {
        player.setProgress(val);
      },
    });

    // 音量图标随音量变化
    const setVolumeIcon = () => {};

    // 跳转到播放列表
    const goCurrentList = () => {
      router.push(`/currentList`);
    };

    return {
      ...toRefs(data),
      player,
      currentTrack,
      progress,
      timeFormat,
      setVolumeIcon,
      goCurrentList,
    };
  },
  components: { ArtistFormat, VueSlider },
};
</script>
<style lang="scss" scoped>
.audioControl {
  padding: 12px 2%;
  @include calc-width(10);
  box-shadow: 0 0 0 4px var(--background-color-secondary);
  border-radius: $border-radius-default * 3;
  background-color: var(--background-color-primary);
  z-index: 1000;
  .main {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      flex: 2 1 0;
      overflow: hidden;

      align-items: center;

      .cover {
        width: 48px;
      }

      .cover,
      .music-info {
        margin-right: 8px;
      }

      .cover {
        border-radius: $border-radius-default;
      }

      .left-control {
        display: flex;
        align-items: center;
        font-weight: 300;

        li {
          margin: 0 4px;
          padding: 4px;
          border-radius: $border-radius-default;
          background-color: var(--background-color-secondary);
        }
      }
    }

    .control {
      flex: 1 1 0;
      display: flex;
      justify-content: center;
      align-items: center;

      li {
        margin: 0 4px;
      }

      .play-or-pause {
        padding: 6px;
        border-radius: 300px;
        background-color: black;
        color: #fff;
      }
    }

    .right {
      flex: 2 1 0;
      text-align: right;
      line-height: 0;
    }
  }

  .progress {
    width: 100%;
    margin-top: 12px;

    display: flex;
    align-items: center;
    .progress-slider {
      flex: 1 1 0;
      margin: 0 24px;
    }
  }
}

@media screen and (max-width: $lg) {
  .left-control {
    display: none !important;
  }
}

@media screen and (max-width: $md) {
  .control {
    flex: 0 !important;
    margin-right: 8px;
    > * {
      display: none;
    }

    .play-or-pause {
      display: block;
    }
  }

  .right {
    flex: 0 !important;
    align-items: center;
  }

  .progress {
    display: none !important;
  }
}

@media screen and (max-width: $sm) {
  .audioControl {
    @include calc-width(5);
  }
}
</style>
