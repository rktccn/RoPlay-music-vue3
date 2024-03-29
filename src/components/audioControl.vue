<template>
  <div class='audioControl'>
    <div class='main'>
      <div class='left'>
        <el-image
          :src="`${
            currentTrack?.al?.picUrl ??
            'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg'
          }?param=48y48`"
          alt=''
          class='cover'
          lazy
          @click='store.showLyric = true'
        />
        <div class='music-info text-truncate' v-if='currentTrack'>
          <div class='title text-truncate'>{{ currentTrack.name }}</div>
          <ArtistFormat :artistList='currentTrack.ar'></ArtistFormat>
        </div>
        <ul class='left-control'>
          <!-- 收藏 -->
          <li>
            <svg-icon
              :class='{ fill: isLiked }'
              :name="`round-${isLiked ? 'favorite' : 'favorite_border'}`"
              :size='20'
              color='currentColor'
              @click='toggleLike'
            />
          </li>
          <li class='add-to-playlist'>
            <svg-icon name='round-playlist_add' :size='20' color='#454f63' />
          </li>
          <li class='show-lyric-page' @click='store.showLyric = true'>
            <svg-icon name='round-open_in_full' :size='20' color='#454f63' />
          </li>
          <li class='more'>
            <svg-icon :name='`round-more_horiz`' :size='20' color='#454f63' />
          </li>
        </ul>
      </div>
      <ul class='control'>
        <li class='play-mode' @click='player.changePlayMode()'>
          <svg-icon :name='`round-${playMode}`' :size='20' color='#454f63' />
        </li>
        <li class='play-prev' @click='player.playPrev()'>
          <svg-icon :name='`round-skip_previous`' :size='32' color='#454f63' />
        </li>
        <li class='play-or-pause' @click='player.playOrPause()'>
          <svg-icon
            :name="`round-${player.isPlaying ? 'pause' : 'play_arrow'}`"
            :size='38'
            color='#fff'
          />
        </li>
        <li class='play-next' @click='player.playNext()'>
          <svg-icon :name='`round-skip_next`' :size='32' color='#454f63' />
        </li>
        <li class='volume' ref='volumeBar'>
          <span @click='showVolume = !showVolume'>
            <svg-icon
              :name='`round-${setVolumeIcon()}`'
              :size='20'
              color='#454f63'
            />
          </span>
          <div class='volume-bar' v-show='showVolume'>
            <vue-slider
              v-model='volume'
              :height='64'
              :interval='0.1'
              :max='1'
              :min='0'
              direction='btt'
              dotSize='6'
              tooltip='none'
            ></vue-slider>
          </div>
        </li>
      </ul>
      <div class='right'>
        <p class='font-size-12' v-if='currentTrack?.fee === 1'>
          当前歌曲可试听30秒
        </p>
        <span class='show-trackList' @click='goCurrentList'>
          <svg-icon :name='`round-queue_music`' :size='24' color='#454f63' />
        </span>
      </div>
    </div>
    <div class='progress'>
      <em class='time-current font-size-12'>{{ timeFormat(progress) }}</em>
      <vue-slider
        v-model='progress'
        :dragOnClick='true'
        :lazy='true'
        :max='currentTrack?.dt'
        :min='0'
        :tooltip-formatter='timeFormat'
        class='progress-slider'
        dotSize='6'
        height='2px'
        tooltip='hover'
      />
      <em class='time-duration font-size-12'>{{
          player.getCurrentDuration
        }}</em>
    </div>
  </div>
</template>
<script lang='ts'>
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { timeFormat } from '../utils/common';
import { usePlayer } from '../store/player';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../store';
import { likeATrack } from '../apis/track';

import ArtistFormat from './artistFormat.vue';
import VueSlider from 'vue-slider-component';
import { log } from 'util';

export default defineComponent({
  name: 'audioControl',
  setup() {
    const data = reactive({
      imgUrl: '',
      artists: [],
      name: '',
      id: 0,
      duration: 0,
      // isLiked: false,
      canPlay: 0,
      trackUrl: null,
      rate: 0, // 播放进度 0-100
      showVolume: false
    });

    const player = usePlayer();
    const store = useStore();
    const currentTrack = computed(() => player.currentTrack);
    const router = useRouter();
    const route = useRoute();
    const volumeBar = ref(null);

    const progress = computed({
      get: () => player.getProgress,
      set: val => {
        player.setProgress(val);
      }
    });

    const volume = computed({
      get: () => player.getVolume,
      set: val => {
        player.setVolume(val);
      }
    });

    // 音量图标随音量变化
    const setVolumeIcon = (): String => {
      if (volume.value === 0) {
        return 'volume_off';
      } else if (volume.value > 0.7) {
        return 'volume_up';
      } else if (volume.value < 0.3) {
        return 'volume_mute';
      } else {
        return 'volume_down';
      }
    };

    // 点击外部关闭音量条
    const handleClick = (e: { target: any }) => {
      if (!volumeBar.value.contains(e.target)) {
        data.showVolume = false;
      }
    };

    // 跳转到播放列表
    const goCurrentList = () => {
      const goBack = () => {
        window.history.state.back ? router.go(-1) : router.push(`/`);
      };
      route.path === '/currentList' ? goBack() : router.push(`/currentList`);
    };

    // 设置移动端进度条
    const setProgressStyle = (): object => {
      let rate = player.progress / player.currentTrack?.dt;
      if (rate < 0) {
        rate = 0;
      } else if (rate > 1) {
        rate = 1;
      }
      rate = rate * 100;

      let style = {
        background: ''
      };

      style.background = `linear-gradient(90deg ,rgba(23, 125, 176) ${rate}%, #fff ${rate}%)`;
      return style;
    };


    const isLiked = computed(() => {
      return store.likedSongIDs.includes(player.currentTrack.id);
    });

    // 切换收藏
    const toggleLike = async () => {
      // console.log(isLiked);
      // if (isLiked) {
      //
      //   await likeATrack({ id: player.currentTrack.id, like: false });
      //   store.likedSongIDs.splice(
      //     store.likedSongIDs.indexOf(player.currentTrack.id),
      //     1
      //   );
      // } else {
      //   await likeATrack({ id: player.currentTrack.id, like: true });
      //   store.likedSongIDs.push(player.currentTrack.id);
      // }
    };

    // 播放模式
    const playMode = computed(() => {
      const MODE = player.getPlayMode;
      if (MODE === 'loop') {
        return 'repeat';
      } else if (MODE === 'random') {
        return 'shuffle';
      } else {
        return 'repeat_one';
      }
    });

    watch(
      () => data.showVolume,
      val => {
        if (val) {
          document.addEventListener('mousedown', handleClick);
        } else {
          document.removeEventListener('mousedown', handleClick);
        }
      }
    );

    return {
      ...toRefs(data),
      player,
      store,
      currentTrack,
      progress,
      volume,
      volumeBar,
      timeFormat,
      isLiked,
      setVolumeIcon,
      goCurrentList,
      setProgressStyle,
      toggleLike,
      playMode
    };
  },
  components: {
    ArtistFormat,
    VueSlider
  }
});
</script>
<style lang='scss' scoped>
.audioControl {
  padding: 12px 2%;
  @include calc-width(10);
  box-shadow: 0 0 0 4px var(--background-color-secondary);
  border-radius: $border-radius-default * 3;
  background-color: var(--background-color-primary);
  z-index: 10;

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
          line-height: 0;
          border-radius: $border-radius-default;
          background-color: var(--background-color-secondary);

          .fill {
            color: #ea4c89;
          }
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

      .volume {
        position: relative;
        line-height: 0;

        .volume-bar {
          position: absolute;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          padding: 16px 8px;
          border-radius: $border-radius-default;
          background-color: var(--background-color-primary);
          @include shadow();
        }
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
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: 0;

      > * {
        margin-left: 6px;
      }
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
