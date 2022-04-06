<template lang="">
  <div class="lyric-page" :style="setColor()">
    <div class="left-side">
      <div class="inner">
        <!-- 歌曲封面 -->
        <div class="cover">
          <img
            v-if="player.currentTrack"
            :src="`${
              player.currentTrack?.al?.picUrl ??
              'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg'
            }?param=1024y1024`"
            alt=""
          />
        </div>

        <div class="control">
          <span class="prev material-icons-round font-size-32"
            >skip_previous</span
          >
          <span class="next material-icons-round font-size-32"> skip_next</span>
          <span class="gap"></span>
          <span class="play material-icons-round font-size-48">
            play_arrow</span
          >
          <span class="like material-icons-round font-size-24"
            >favorite_border</span
          >
        </div>
        <div class="info">
          <span class="title text-truncate">{{
            player.currentTrack.name
          }}</span>
          <em>-</em>
          <span class="artists"
            ><ArtistFormat
              fontSize="16px"
              :artistList="player.currentTrack.ar"
            ></ArtistFormat
          ></span>
        </div>

        <div class="progress">
          <span class="cur-time text-style-info">{{
            timeFormat(player.progress)
          }}</span>
          <VueSlider
            class="progress-slider"
            v-model="progress"
            :min="0"
            :max="player?.currentTrack?.dt"
            dotSize="6"
            height="2px"
            :dragOnClick="true"
            :lazy="true"
            tooltip="hover"
            :tooltip-formatter="timeFormat"
          ></VueSlider>
          <span class="total-time text-style-info">
            {{ player.getCurrentDuration }}
          </span>
        </div>
      </div>
    </div>

    <ul class="list right-side" v-if="lyricList" ref="list">
      <li
        v-for="(lyric, index) in lyricList"
        :key="index"
        :class="{ active: curIndex === index }"
        class="lyric-item"
        @click="clickLyric(index)"
      >
        <span>
          {{ lyric.content }}
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, toRefs, watch, ref, computed, nextTick } from "vue";
import { usePlayer } from "../store/player";
import { getLyric } from "../apis/track";
import { initLyric } from "../utils/lyric";
import { timeFormat } from "../utils/common";
import analyze from "rgbaster";

import ArtistFormat from "../components/artistFormat.vue";
import VueSlider from "vue-slider-component";

export default {
  name: "LyricPage",

  setup() {
    const player = usePlayer();
    const data = reactive({
      lyricList: null,
      curIndex: 0,
      color: {
        main: null,
        secondary: null,
        fontColor: null,
      },
    });
    const list = ref(null);

    const progress = computed({
      get: () => player.getProgress,
      set: (val) => {
        player.setProgress(val);
      },
    });

    // 获取当前时间对应的歌词索引
    const getIndex = (time) => {
      for (let i = 0; i < data.lyricList.length; i++) {
        if (data.lyricList[i].time > time) {
          data.curIndex = i - 1;
          break;
        }
      }
    };

    // 自动滚动歌词
    const autoScroll = (curTime) => {
      const curIndex = data.curIndex;
      const nextIndex = curIndex + 1;
      if (nextIndex < data.lyricList.length) {
        if (curTime > data.lyricList[nextIndex].time) {
          data.curIndex = nextIndex;
        }
      }
    };

    // 获取歌词
    const getData = async (id) => {
      const res = await getLyric(id);
      if (res.code === 200) {
        data.lyricList = initLyric(res.lrc.lyric);
        getIndex(player.getProgress);
      }
      await nextTick();
      setScroll();
    };

    // 设置滚动样式
    const setScroll = () => {
      if (!list.value || list.value?.children?.length === 0) return;

      let el = list.value.children[data.curIndex];
      if (!el) return;
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    // 点击歌词将歌曲进度跳转到歌词所在时间
    const clickLyric = (index) => {
      data.curIndex = index;
      let time =
        data.lyricList[index].time < 0 ? 0 : data.lyricList[index].time;
      player.setProgress(time);
    };

    // 获取主题色
    const getColor = async () => {
      if (!player?.currentTrack?.al?.picUrl) return;
      let img = player.currentTrack.al.picUrl + "?param=1000y1000";
      const result = await analyze(img, {
        ignore: ["rgb(255,255,255)", "rgb(0,0,0)"],
        scale: 0.6,
      });
      data.color.main = result[Math.floor(result.length / 4)].color;
      data.color.secondary = result[Math.floor(result.length / 2)].color;
      data.color.fontColor = result[0].color;
    };

    // 设置背景和字体颜色
    const setColor = () => {
      if (!player?.currentTrack?.al?.picUrl) return;
      let style = {
        background: null,
        color: null,
      };
      let color = `linear-gradient(to top left, ${data.color.main}, ${data.color.secondary})`;
      style.background = color;
      style.color = data.color.fontColor;
      return style;
    };

    getColor();
    getData(player.currentTrack.id);

    // 监听播放进度，设置歌词curIndex
    watch(
      () => player.getProgress,
      (progress, oldProgress) => {
        if (!data.lyricList) return;
        if (progress < oldProgress || progress - oldProgress > 699) {
          // 当前时间小于上一次时间或者大于0.7秒
          getIndex(progress);
          return;
        }
        autoScroll(progress);
      }
    );

    // 监听歌曲改变,重置歌词
    watch(
      () => player.currentTrack.id,
      (id) => {
        data.curIndex = 0;
        getData(id);
        getColor();
      }
    );

    // 监听歌词滚动,设置滚动样式
    watch(
      () => data.curIndex,
      () => {
        setScroll();
      }
    );

    return {
      ...toRefs(data),
      list,
      player,
      progress,
      clickLyric,
      setColor,
      timeFormat,
    };
  },
  components: {
    ArtistFormat,
    VueSlider,
  },
};
</script>
<style lang="scss" scoped>
.lyric-page {
  position: relative;
  display: flex;
  color: #fff;
  background-color: var(--background-color-secondary);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: brightness(0.85);
  }

  .left-side {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .inner {
      @include calc-width(3);
    }

    .cover {
      position: relative;
      padding-top: 100%;
      background-color: pink;
      border-radius: $border-radius-default * 2;
      overflow: hidden;
      line-height: 0;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }

    .control {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 4px 5%;

      > * {
        margin: 0 8px;
      }
      .gap {
        flex: 1 1 0;
      }
    }

    .info {
      display: flex;
      width: 100%;

      .title {
        max-width: 45%;
        overflow: hidden;
      }

      .artists {
        max-width: 50%;
      }

      em {
        margin: 0 8px;
      }
    }

    .progress {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 8px 0;
      .progress-slider {
        flex: 1 1 0;
        margin: 0 8px;
      }
    }
  }
  .right-side {
    flex: 1 1 0;
    z-index: 1;
  }
}

.list {
  height: 0vh;
  width: 100%;
  overflow-y: scroll;
  padding: 35vh 0;
  font-size: 28px;
  line-height: 1.5;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  .lyric-item {
    padding: 8px 12px;
    border-radius: $border-radius-default;

    transition: all $transition-time-default
      cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-weight: 600;
    opacity: 0.48;
    cursor: pointer;

    &:hover {
      backdrop-filter: brightness(1.2);
    }
  }
  .active {
    font-size: 34px;
    opacity: 0.98;
  }
}
</style>
