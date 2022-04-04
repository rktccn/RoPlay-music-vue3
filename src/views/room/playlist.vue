<template lang="">
  <div @scroll.passive="onScroll">
    <!-- 控件，用于切换显示内容 -->
    <div class="tab">
      <ul class="tab-control">
        <li
          v-for="(item, index) in tabList"
          class="tab-item text-style-title"
          :class="{ primary: tab === item }"
          @click="changeTab(item)"
        >
          {{ item }}
        </li>

        <li
          v-if="!tabList.includes(tab)"
          class="tab-item text-style-title primary"
          @click="changeTab(item)"
        >
          {{ tab }}
        </li>

        <div
          class="tab-item text-style-title material-icons-round"
          @click="showTab(true)"
        >
          more_horiz
        </div>
      </ul>
      <transition name="drop-up" type="out-in">
        <div class="all-tab" v-if="allTabList && showAllTab">
          <span
            class="close font-size-48 material-icons-outlined"
            @click="showTab()"
          >
            close
          </span>
          <ul class="big-cat" v-for="(item, index) in allTabList" :key="index">
            <li class="big-cat-name text-style-title">
              {{ item.name }}
            </li>
            <ul class="cat-list">
              <li
                class="cat"
                v-for="(cat, j) in item.list"
                :key="j"
                @click="
                  changeTab(cat);
                  showTab();
                "
              >
                {{ cat }}
              </li>
            </ul>
          </ul>
        </div>
      </transition>
    </div>

    <CoverRow v-if="playlists">
      <li v-for="(playlist, index) in playlists" :key="index">
        <PlaylistCard :item="playlist" :type="'playlist'"></PlaylistCard>
      </li>
    </CoverRow>
    <p class="load-info font-size-12" @click="dododo">
      {{ hasMore ? "正在加载" : "已加载全部" }}
    </p>
  </div>
</template>
<script>
import { onMounted, onUnmounted, reactive, toRefs } from "vue";
import { topPlaylist, getPlaylistCatlist } from "../../apis/playlist";
import { isScrollBottom } from "../../utils/common";

import PlaylistCard from "../../components/playListCard.vue";
import CoverRow from "../../components/coverRow.vue";

export default {
  name: "RoomPlaylist",
  setup() {
    const data = reactive({
      playlists: null,
      hasMore: true,
      tab: "全部",
      tabList: ["全部", "流行", "华语", "摇滚", "轻音乐", "放松"],
      allTabList: {
        0: {
          name: "语种",
          list: [],
        },
        1: {
          name: "风格",
          list: [],
        },
        2: {
          name: "场景",
          list: [],
        },
        3: {
          name: "情感",
          list: [],
        },
        4: {
          name: "主题",
          list: [],
        },
      },
      showAllTab: false,
    });
    let loading = false;

    topPlaylist({ limit: 50 }).then((res) => {
      console.log(res);
      data.playlists = res.playlists;
    });

    const loadMore = () => {
      console.log("滚动");
      if (isScrollBottom()) {
        loading = true;
        topPlaylist({
          offset: data.playlists.length,
          limit: 20,
          cat: data.tab,
        }).then((res) => {
          console.log(res.playlists);
          data.playlists = data.playlists.concat(res.playlists); // 拼接数组
          loading = false;
          if (res.playlists.length < 20) {
            console.log("没有了");

            data.hasMore = false;
            document
              .getElementsByClassName("el-main")[0]
              .removeEventListener("scroll", loadMore);
          }
        });
      }
    };

    // 获取全部歌单分类
    getPlaylistCatlist().then((res) => {
      res.sub.forEach((item) => {
        data.allTabList[item.category].list.push(item.name);
      });
    });

    // 切换歌单分类
    const changeTab = (tab) => {
      data.tab = tab;
      data.playlists = null;
      data.hasMore = true;
      loading = false;
      document
        .getElementsByClassName("el-main")[0]
        .addEventListener("scroll", loadMore);
      topPlaylist({ limit: 50, cat: tab }).then((res) => {
        data.playlists = res.playlists;
      });
    };

    // 开始/关闭所有歌单分类列表
    const showTab = (val = false) => {
      data.showAllTab = val;
    };

    onMounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .addEventListener("scroll", loadMore);
    });

    onUnmounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .removeEventListener("scroll", loadMore);
    });

    return { ...toRefs(data), loading, changeTab, showTab };
  },
  components: {
    PlaylistCard,
    CoverRow,
  },
};
</script>
<style lang="scss" scoped>
.tab {
  position: relative;

  .tab-control {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    width: 100%;

    .tab-item {
      margin-right: 20px;
      margin-bottom: 16px;
      padding: 8px 26px;
      border-radius: $border-radius-default;
      background-color: var(--background-color-primary);
      cursor: pointer;
      transition: all $transition-time-default;

      @media (max-width: $sm) {
        margin-right: 10px;
        margin-bottom: 8px;
        padding: 4px 8px;
        font-size: 12px;
      }

      &:hover {
        background-color: var(--primary-container-color);
      }

      &.primary {
        background-color: var(--main-color);
      }
    }
  }

  .all-tab {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: $border-radius-default;
    background-color: var(--background-color-primary);
    z-index: 10;

    .close {
      display: block;
      padding: 8px;
      margin: 0 auto;
      width: 68px;
      height: 68px;
      text-align: center;
      cursor: Pointer;
    }

    .big-cat {
      display: flex;
      margin: 8px 16px;

      @media (max-width: $md) {
        flex-direction: column;
      }

      .big-cat-name {
        @media (max-width: $sm) {
          font-size: 16px;
        }
      }
      .cat-list {
        margin-left: 26px;
        flex: 1 1 0;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        @media (max-width: $lg) {
          grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: $md) {
          grid-template-columns: repeat(4, 1fr);
        }

        .cat {
          margin-right: 20px;
          margin-bottom: 16px;
          padding: 8px 0;
          border-radius: $border-radius-default;
          background-color: var(--background-color-primary);
          text-align: center;
          cursor: pointer;
          transition: all $transition-time-default;

          @media (max-width: $sm) {
            margin-right: 10px;
            margin-bottom: 8px;
            font-size: 12px;
          }

          &:hover {
            background-color: var(--primary-container-color);
          }

          &.primary {
            background-color: var(--main-color);
          }
        }
      }
    }
  }
}

.load-info {
  color: var(--text-color-secondary);
}
</style>
