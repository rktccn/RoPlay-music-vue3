<template lang="">
  <div class="lyric-page" :style="setColor()">
    <ScrollTab
      :tabIndex="showLyric"
      :active="active"
      @selectChange="toggleLyric"
      class="scroll"
    >
      <ScrollTabCol class="item" :loading="loadingIndex === 0" :active="active">
        <div class="left-side">
          <div
            class="close material-icons-round font-size-48"
            @click="store.showLyric = false"
          >
            expand_more
          </div>
          <div class="inner" id="lyricPageInner">
            <!-- 歌曲封面 -->
            <div class="cover" @click="toggleLyric">
              <img
                :src="`${
                  player?.currentTrack?.al?.picUrl ||
                  'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg'
                }?param=1024y1024`"
                alt=""
              />
            </div>

            <!-- 移动端播放控件会传送至body -->
            <teleport to="body" v-if="active">
              <transition name="fade" mode="out-in">
                <div
                  class="detail"
                  :style="{ color: color.fontColor }"
                  v-if="showLyric === 0"
                >
                  <div class="control">
                    <span
                      class="prev material-icons-round font-size-32"
                      @click="player.playPrev()"
                      >skip_previous</span
                    >
                    <span
                      class="next material-icons-round font-size-32"
                      @click="player.playNext()"
                    >
                      skip_next</span
                    >
                    <span
                      class="material-icons-round font-size-24"
                      @click="togglePIP"
                      v-if="isPIP !== -1"
                    >
                      picture_in_picture_alt
                    </span>
                    <span class="gap"></span>
                    <span
                      class="play material-icons-round font-size-48"
                      @click="player.playOrPause()"
                    >
                      {{ player.isPlaying ? "pause" : "play_arrow" }}</span
                    >
                    <span class="like material-icons-round font-size-24"
                      >favorite_border</span
                    >
                  </div>
                  <div class="info" v-if="player.currentTrack">
                    <span class="title text-truncate">{{
                      player.currentTrack.name
                    }}</span>
                    <em>-</em>
                    <span class="artists"
                      ><ArtistFormat
                        fontSize="16px"
                        :artistList="player.currentTrack.ar"
                        @click="store.showLyric = false"
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
                      :process-style="{ backgroundColor: color.fontColor }"
                      :dot-style="{
                        boxShadow: `0px 0px 0px 2px ${color.fontColor}`,
                      }"
                    ></VueSlider>
                    <span class="total-time text-style-info">
                      {{ player.getCurrentDuration }}
                    </span>
                  </div>
                </div>
              </transition>
            </teleport>
            <div class="detail" :style="{ color: color.fontColor }" v-else>
              <div class="control">
                <span
                  class="prev material-icons-round font-size-32"
                  @click="player.playPrev()"
                  >skip_previous</span
                >
                <span
                  class="next material-icons-round font-size-32"
                  @click="player.playNext()"
                >
                  skip_next</span
                >
                <span
                  class="material-icons-round font-size-24"
                  @click="togglePIP"
                  v-if="isPIP !== -1"
                >
                  picture_in_picture_alt
                </span>
                <span class="gap"></span>
                <span
                  class="play material-icons-round font-size-48"
                  @click="player.playOrPause()"
                >
                  {{ player.isPlaying ? "pause" : "play_arrow" }}</span
                >
                <span class="like material-icons-round font-size-24"
                  >favorite_border</span
                >
              </div>
              <div class="info" v-if="player.currentTrack">
                <span class="title text-truncate">{{
                  player.currentTrack.name
                }}</span>
                <em>-</em>
                <span class="artists"
                  ><ArtistFormat
                    fontSize="16px"
                    :artistList="player.currentTrack.ar"
                    @click="store.showLyric = false"
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
                  :process-style="{ backgroundColor: color.fontColor }"
                  :dot-style="{
                    boxShadow: `0px 0px 0px 2px ${color.fontColor}`,
                  }"
                ></VueSlider>
                <span class="total-time text-style-info">
                  {{ player.getCurrentDuration }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollTabCol>

      <ScrollTabCol class="item" :loading="loadingIndex === 1" :active="active">
        <div></div>
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
        <span class="list right-side" v-if="!lyricList"
          ><li class="lyric-item active">没有音乐</li>
        </span></ScrollTabCol
      >
    </ScrollTab>
    <PipLyric
      :currentLyric="lyricList[curIndex].content"
      :nextLyric="lyricList[curIndex + 1]?.content || ''"
      :color="color || {}"
      :isPIP="isPIP ? true : false"
      v-if="lyricList && isPIP !== -1"
    ></PipLyric>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  watch,
  ref,
  computed,
  nextTick,
  onMounted,
} from "vue";
import { usePlayer } from "../store/player";
import { getLyric } from "../apis/track";
import { initLyric } from "../utils/lyric";
import { timeFormat } from "../utils/common";
import analyze from "rgbaster";
import tinyColor from "tinycolor2";
import { useStore } from "../store";

import ArtistFormat from "../components/artistFormat.vue";
import VueSlider from "vue-slider-component";
import PipLyric from "../components/pipLyric.vue";
import ScrollTabCol from "../components/scrollTab/scrollTabCol.vue";
import ScrollTab from "../components/scrollTab/scrollTab.vue";

export default {
  name: "LyricPage",

  setup() {
    const player = usePlayer();
    const store = useStore();
    const data = reactive({
      lyricList: null,
      curIndex: 0,
      color: {
        main: null,
        secondary: null,
        fontColor: null,
      },
      isPIP: -1, // -1不支持,0关闭,1开启
      // 切换歌词显示  1 显示
      showLyric: 0,
      active: false, // 是否启用滑动切换
    });
    const list = ref(null);
    let loadingIndex = ref(0); // 1 加载歌词

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

    // 更新歌词index值
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
      if (!data.showLyric) return; // 封面页不滚动
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
        scale: 0.6,
      });

      data.color.main = result[Math.floor(result.length / 4)].color;
      data.color.secondary = result[Math.floor(result.length / 2)].color;

      // 判断字体颜色与背景色是否相似,明度小于0.2为相似
      // 如果相似，将字体颜色提亮
      const color = tinyColor(result[0].color);
      const mainColor = tinyColor(data.color.main);
      if (Math.abs(color.getLuminance() - mainColor.getLuminance()) < 0.2) {
        color.isDark() ? color.lighten(60) : color.lighten(20);
      }
      data.color.fontColor = color.toHexString();
    };

    // 设置背景和字体颜色
    const setColor = () => {
      if (!player?.currentTrack?.al?.picUrl) return;
      let style = {
        background: null,
        backgroundColor: null,
        color: null,
      };
      // let color = `linear-gradient(to top left, ${data.color.main}, ${data.color.secondary})`;
      let color = `linear-gradient(to top left, ${data.color.main}, transparent)`;
      let bgColor = data.color.secondary;
      style.background = color;
      style.backgroundColor = bgColor;
      style.color = data.color.fontColor;
      return style;
    };

    // 切换画中画
    const togglePIP = () => {
      if (document.pictureInPictureElement) {
        data.isPIP = 0;
      } else {
        data.isPIP = 1;
      }
    };

    // 切换歌词显示 (移动端)
    const toggleLyric = (val) => {
      data.showLyric = val;
      loadingIndex.value = val;
    };

    // 初始化数据
    if (player.currentTrack) {
      getColor();
      getData(player.currentTrack.id);
    }

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

    // 监听歌曲改变,重新获取数据
    watch(
      () => player.currentTrack,
      (val) => {
        data.curIndex = 0;
        getData(val.id);
        getColor();
      }
    );

    // 切换到歌词页面时自动滚动到当前歌词(移动端)
    watch(
      () => data.showLyric,
      () => {
        setScroll();
      }
    );

    // 监听歌词滚动,设置滚动样式
    watch(
      () => data.curIndex,
      () => {
        setScroll();
      }
    );

    onMounted(() => {
      // 移动端开启滑动切换
      if (window.innerWidth <= 768) {
        data.active = true;
        data.showLyric = 0; // 封面页不滚动歌词
      } else {
        data.showLyric = 1;
      }

      // 检测是否支持画中画
      if (document.pictureInPictureEnabled) {
        data.isPIP = document.pictureInPictureElement;
      } else {
        data.isPIP = -1;
      }
    });

    return {
      ...toRefs(data),
      list,
      player,
      store,
      progress,
      loadingIndex,
      clickLyric,
      setColor,
      timeFormat,
      togglePIP,
      toggleLyric,
    };
  },
  components: {
    ArtistFormat,
    VueSlider,
    PipLyric,
    ScrollTabCol,
    ScrollTab,
  },
};
</script>
<style lang="scss" scoped>
.lyric-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  color: #fff;
  background: var(--background-color-secondary);
  z-index: 30;

  transition: all $transition-time-default ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: brightness(0.9);
  }

  .scroll {
    z-index: 2;
  }

  .left-side {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    z-index: 1;
    .inner {
      @include calc-width(3);
    }

    .close {
      position: absolute;
      top: 2.5vw;
      left: 2.5vw;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2;
      border-radius: $border-radius-default;
      transition: all $transition-time-default
        cubic-bezier(0.25, 0.46, 0.45, 0.94);

      &:hover {
        backdrop-filter: brightness(1.2);
      }
    }

    .cover {
      position: relative;
      width: 100%;
      padding-top: 100%;
      border-radius: $border-radius-default * 2;
      line-height: 0;
      background: black;
      @include shadow();

      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        width: 100%;
        border-radius: $border-radius-default * 2;
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
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 49vh 0;
  padding-left: 4vw;
  font-size: 28px;
  line-height: 1.5;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  .lyric-item {
    width: 80%;
    padding: 8px 12px;
    border-radius: $border-radius-default;
    transition: all $transition-time-default
      cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-weight: bold;
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

.hide {
  @media screen and (max-width: $sm) {
    display: none !important;
  }
}

// 移动端修改封面大小和位置
@media screen and (max-width: $sm) {
  .lyric-page {
    .left-side {
      .inner {
        @include calc-width(5);
      }

      .cover {
        margin-bottom: 25vh;
      }
    }
  }
}

.detail {
  display: flex;
  flex-direction: column;

  .control {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 4px 5%;
    padding-top: 20px;

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

@media screen and(max-width:$sm) {
  .detail {
    position: absolute;
    bottom: 5vh;
    left: 50%;
    transform: translateX(-50%);
    @include calc-width(5);
    z-index: 40;

    .control {
      padding: 0;
      order: 3;
    }
  }
}
</style>
