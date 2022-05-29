<template lang="">
  <div
    v-if="activeData !== []"
    ref="scroller"
    class="track-list"
    id="trackList"
    :style="`height:${scrollRunwayEnd}px`"
  >
    <li
      class="track-list__scroll-runway"
      :style="`transform: translate(0, ${scrollRunwayEnd}px)`"
    ></li>
    <TrackListItem
      class="track-list__item"
      v-for="(track, index) in activeData"
      :key="track.INDEX"
      :item="type === 'cloud' ? track.simpleSong : track"
      :canHover="canHover"
      :showImg="showImg"
      :type="type"
      :index="track.INDEX + 1"
      :style="`top:  ${track.SCROLLY}px`"
    ></TrackListItem>
  </div>
</template>
<script lang="ts">
// https://lkangd.com/post/virtual-infinite-scroll/#dongtaigaodudexuniliebiao

import {
  defineComponent,
  reactive,
  toRefs,
  onUnmounted,
  onMounted,
  watch,
} from "vue";
import TrackListItem from "./trackListItem.vue";

const FIXED_HEIGHT = 64;
const BUFFER_SIZE = 3;
let SCROLL_ELEMENT = null;
let VISIBLE_TRACKS = 10;

export default defineComponent({
  name: "trackList",
  props: {
    tracks: { type: Array, required: true }, // 传入歌曲列表
    canHover: { type: Boolean, default: true }, // 是否显示hover样式
    showImg: { type: Boolean, default: true }, // 是否显示封面
    type: { type: String, default: "song" }, // 类型 song / album(隐藏封面和歌曲信息)/ cloud
    scrollerSelector: { type: String, default: "#trackList" }, // 滚动元素选择器
  },
  setup(props) {
    let scroller = null;

    const data = reactive({
      scrollRunwayEnd: 0, // 总高度
      listData: [],

      activeData: [], // 可视元素
      firstAttachedItem: 0, // 「头挂载元素」
      lastAttachedItem: 0, // 「尾挂载元素」

      anchorItem: { index: 0, offset: 0 }, // 当前激活元素
      lastScrollTop: 0, // 上一次滚动高度
    });

    const fetchData = () => {
      initListData();
      data.scrollRunwayEnd = data.listData.length * FIXED_HEIGHT;
    };

    const getActiveData = () => {
      const { firstAttachedItem, lastAttachedItem } = data;
      const start =
        firstAttachedItem - BUFFER_SIZE < 0
          ? 0
          : firstAttachedItem - BUFFER_SIZE;

      const end =
        lastAttachedItem + BUFFER_SIZE > data.listData.length
          ? data.listData.length
          : lastAttachedItem + BUFFER_SIZE;

      const activeData = data.listData.slice(start, end);
      return activeData;
    };

    const initListData = () => {
      let latestIndex = data.listData.length;
      for (let i = latestIndex; i < props.tracks.length; i++) {
        const item: any = props.tracks[i];
        item.SCROLLY = i * FIXED_HEIGHT;
        item.INDEX = i;
        data.listData.push(item);
      }
    };

    // 「锚点元素」更新方法
    const updateAnchorItem = (_scrollTop: number) => {
      const index = Math.floor(_scrollTop / FIXED_HEIGHT);
      const offset = _scrollTop - index * FIXED_HEIGHT;
      data.anchorItem = { index, offset };
    };

    const handleScroll = () => {
      // 当没有到达顶部时不运行
      let _scrollTop = SCROLL_ELEMENT.scrollTop - scroller.offsetTop;

      if (_scrollTop < 0) {
        return;
      }

      // 滚动差值
      const delta = _scrollTop - data.lastScrollTop;
      data.lastScrollTop = _scrollTop;

      // 更新「锚点元素」偏移量
      data.anchorItem.offset += delta;

      const isPositive = delta >= 0;
      // 判断滚动方向
      if (isPositive) {
        // 1.当「锚点元素」偏移量大于等于固定高度时，说明视图滚动条向下，并超过一个元素，需要更新「锚点元素」
        if (data.anchorItem.offset >= FIXED_HEIGHT) {
          updateAnchorItem(_scrollTop);
        }
        // 2.计算「头挂载元素」
        if (data.anchorItem.index - data.firstAttachedItem >= BUFFER_SIZE) {
          data.firstAttachedItem = Math.min(
            data.listData.length - VISIBLE_TRACKS,
            data.anchorItem.index - BUFFER_SIZE
          );
        }
      } else {
        if (_scrollTop <= 0) {
          // 特殊情况：处理滚动到顶部，更新「锚点元素」为初始值
          data.anchorItem = { index: 0, offset: 0 };
        } else if (data.anchorItem.offset < 0) {
          // 1.当「锚点元素」偏移量小于零时，说明视图滚动条向上，并超过一个元素，需要更新「锚点元素」
          updateAnchorItem(_scrollTop);
        }
        // 2.计算「头挂载元素」
        if (data.anchorItem.index - data.firstAttachedItem < BUFFER_SIZE) {
          data.firstAttachedItem = Math.max(
            0,
            data.anchorItem.index - BUFFER_SIZE
          );
        }
      }
      // 3.更新「尾挂载元素」
      data.lastAttachedItem = Math.min(
        data.firstAttachedItem + VISIBLE_TRACKS + BUFFER_SIZE * 2,
        data.listData.length
      );
      // 4.更新「可视元素」
      data.activeData = data.listData.slice(
        data.firstAttachedItem,
        data.lastAttachedItem
      );
    };

    onMounted(() => {
      fetchData();

      SCROLL_ELEMENT = document.querySelector(props.scrollerSelector);
      scroller = document.querySelector("#trackList");

      VISIBLE_TRACKS = Math.ceil(SCROLL_ELEMENT.offsetHeight / FIXED_HEIGHT);
      data.lastAttachedItem = VISIBLE_TRACKS + BUFFER_SIZE;
      data.activeData = getActiveData();

      SCROLL_ELEMENT.addEventListener("scroll", handleScroll);
    });

    watch(
      () => props.tracks.length,
      () => {
        fetchData();
      },
      { immediate: true }
    );

    onUnmounted(() => {
      SCROLL_ELEMENT.removeEventListener("scroll", handleScroll);
    });

    return { ...toRefs(data) };
  },
  components: {
    TrackListItem,
  },
});
</script>
<style lang="scss" scoped>
.track-list {
  position: relative;

  &__scroll-runway {
    position: absolute;
    width: 1px;
    height: 1px;
    z-index: -1;
  }

  &__item {
    position: absolute;
    width: 100%;
    contain: layout;
    will-change: transform;
  }

  &__scroll-runway {
    transition: transform $transition-time-default;
  }
}
</style>
