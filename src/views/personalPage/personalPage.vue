<template lang="">
  <div>
    <ContextInfo :item="userInfo" type="user"></ContextInfo>
  </div>
  <ul class="tab-list">
    <li
      class="tab text-style-title"
      :class="{ select: selectedTab === 0 }"
      @click="selectedTab = 0"
    >
      我喜欢
    </li>
    <li
      class="tab text-style-title"
      :class="{ select: selectedTab === 1 }"
      @click="selectedTab = 1"
    >
      歌单
    </li>
    <li
      class="tab text-style-title"
      :class="{ select: selectedTab === 2 }"
      @click="selectedTab = 2"
    >
      专辑
    </li>
    <li
      class="tab text-style-title"
      :class="{ select: selectedTab === 3 }"
      @click="selectedTab = 3"
    >
      视频
    </li>
    <li
      class="tab text-style-title"
      :class="{ select: selectedTab === 4 }"
      @click="selectedTab = 4"
    >
      云盘
    </li>
  </ul>

  <div class="liked-song-list" v-show="selectedTab === 0">
    <TrackList
      class="track-list"
      :tracks="likedSongList"
      v-loading="likedSongList.length === 0 && hasMoreSongs"
    ></TrackList>
    <span v-if="likedSongList.length === 0 && !hasMoreSongs">没有歌曲</span>
  </div>

  <div class="playlikst-list" v-show="selectedTab === 1">
    <CoverRow v-loading="!store.userPlaylist">
      <PlayListCard
        class="playlist-list"
        v-for="(playlist, index) in store.userPlaylist"
        :key="index"
        :item="playlist"
        type="playlist"
      ></PlayListCard>
    </CoverRow>
    <span v-if="store.userPlaylist.length === 0">没有歌单</span>
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "../../store";
import { getTrackDetail } from "../../apis/track";
import { isScrollBottom } from "../../utils/common";

import ContextInfo from "../../components/contextInfo.vue";
import TrackList from "../../components/trackList.vue";
import CoverRow from "../../components/coverRow.vue";
import PlayListCard from "../../components/playListCard.vue";

export default {
  name: "PersonalPage",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const data = reactive({
      userInfo: null,
      selectedTab: route.query?.tab ? parseInt(route.query.tab) : 0,
      likedSongList: [],
      hasMoreSongs: true,
    });
    let loading = false;

    if (route.name === "PersonalPage") {
      data.userInfo = store.userInfo;
    }

    // 获取收藏的歌曲，每次加载50首
    const getLikedSong = () => {
      if (!data.hasMoreSongs || loading) return;

      if (!store.likedSongIDs) return;
      if (store.likedSongIDs.length === 0) {
        data.hasMoreSongs = false;
        return;
      }
      loading = true;
      let arr = store.likedSongIDs
        .slice(data.likedSongList.length, data.likedSongList.length + 50)
        .join(",");
      getTrackDetail(arr).then((res) => {
        data.likedSongList.push(...res.songs);
        loading = false;
        if (res.songs.length < 50) {
          data.hasMoreSongs = false;
        }
      });
    };

    const getData = () => {
      switch (data.selectedTab) {
        case 0:
          getLikedSong();
          break;

        default:
          break;
      }
    };

    // 滚动到底部加载
    const scrollBottomLoad = () => {
      console.log("123");
      if (isScrollBottom()) {
        getData();
      }
    };

    onMounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .addEventListener("scroll", scrollBottomLoad);
    });

    watch(
      () => data.selectedTab,
      (val) => {
        loading = false;
        getData();
        router.replace({ query: { ...route.query, tab: val } });
      },
      { immediate: true }
    );

    watch(
      () => store.likedSongIDs,
      () => {
        if (data.selectedTab === 0) {
          getData();
        }
      },
      { immediate: true }
    );

    return { ...toRefs(data), store };
  },
  components: { ContextInfo, TrackList, CoverRow, PlayListCard },
};
</script>
<style lang="scss" scoped>
.tab-list {
  position: relative;
  display: flex;
  width: 100%;
  margin-top: 64px;
  .tab {
    margin-right: 20px;
    margin-bottom: 16px;
    padding: 8px 26px;
    border-radius: 6px;
    background-color: var(--background-color-primary);
    cursor: pointer;
    transition: all 0.3s;

    &.select {
      background-color: var(--main-color);
      color: #fff;
    }
  }
}

.liked-song-list {
  .track-list {
    min-height: 80px;
  }
}
</style>
