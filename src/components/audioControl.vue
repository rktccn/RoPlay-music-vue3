<template lang="">
  <div class="audioControl">
    <div class="main">
      <div class="left">
        <img
          :src="`${_currentTrack.al.picUrl}?param=48y48`"
          alt=""
          class="cover"
          v-if="_currentTrack"
        />
        <div class="music-info text-truncate" v-if="_currentTrack">
          <div class="title text-truncate">{{ _currentTrack.name }}</div>
          <ArtistFormat :artistList="_currentTrack.ar"></ArtistFormat>
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
        <li class="play-prev material-icons-round font-size-32">
          skip_previous
        </li>
        <li
          class="play-or-pause material-icons-round font-size-38"
          @click="player.playOrPause()"
        >
          {{ player._isPlaying ? "pause" : "play_arrow" }}
        </li>
        <li class="play-next material-icons-round font-size-32">skip_next</li>
        <li class="volume material-icons-round font-size-20">volume_up</li>
      </ul>
      <div class="right">
        <span class="show-tracklist material-icons-round">queue_music</span>
      </div>
    </div>
    <div class="progress">
      <em class="time-current font-size-12">02:24</em>
      <vue-slider
        class="progress-slider"
        v-model="value"
        dotSize="6"
        height="2px"
        :dragOnClick="true"
        :lazy="true"
        tooltip="hover"
      />
      <em class="time-duration font-size-12">04:36</em>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { getTrackDetail, getMP3 } from "../apis/track";
import { timeFormat } from "../utils/common";
import { usePlayer } from "../store/player";

import ArtistFormat from "./artistFormat.vue";
import VueSlider from "vue-slider-component";
import { storeToRefs } from "pinia";
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
    const { _currentTrack } = storeToRefs(player);

    const getDate = (value) => {
      data.imgUrl = `${value.al.picUrl}?param=48y48`;
      data.artists = value.ar;
      data.name = value.name;
      data.duration = timeFormat(value.dt);
      //   data.isLiked;
      data.canPlay = value.fee === 0; // 0: 免费或无版权  1: VIP 歌曲   4: 购买专辑   8: 非会员可免费播放低音质，会员可播放高音质及下载
    };

    // 音量图标随音量变化
    const setVolumeIcon = () => {};

    return { ...toRefs(data), player, _currentTrack };
  },
  components: { ArtistFormat, VueSlider },
};
</script>
<style lang="scss" scoped>
.audioControl {
  background-color: var(--background-color-primary);
  padding: 12px 2%;
  border: 1px solid var(--main-color);
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
</style>
