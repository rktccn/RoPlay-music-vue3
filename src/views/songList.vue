<template lang="">
  <div>
    <div class="title">
      <span class="material-icons-round icon" v-if="type === 'SongsRecord'">
        equalizer
      </span>
      <span class="material-icons-round icon" v-if="type === 'DailySongs'">
        calendar_today
        <div class="date">{{ getDate() }}</div></span
      >
      <span
        class="material-icons-round icon favourite"
        v-if="type === 'FavouriteSongs'"
      >
        favorite
      </span>
      <span class="material-icons-round icon" v-if="type === 'Cloud'">
        cloud
      </span>

      <div class="name">{{ title }}</div>
    </div>
    <div class="control">
      <button class="play primary" @click="play" v-if="type !== 'Cloud'">
        <span class="material-icons-round">play_arrow</span>
        播放
      </button>

      <!-- 最近播放控件 -->
      <button
        class="play record-type block"
        @click="toggleRecord"
        v-if="type === 'SongsRecord'"
      >
        {{ recordType === 1 ? "最近一周" : "所有时间" }}
      </button>
    </div>
    <div v-loading="!songs[0] && hasMore" class="list">
      <TrackList
        :tracks="songs"
        v-if="songs[0]"
        :type="songType"
        scrollerSelector=".el-main"
      ></TrackList>
      <span v-if="!songs[0] && !hasMore">暂无歌曲</span>
    </div>
    <p class="load-info font-size-12">
      {{ hasMore ? "正在加载" : "已加载全部" }}
    </p>
  </div>
</template>
<script>
import { onMounted, onUnmounted, reactive, toRefs } from "vue";
import { dailyRecommendTracks } from "../apis/personalized";
import { userPlayHistory } from "../apis/user";
import { getCloud } from "../apis/cloud";
import { getTrackDetail } from "../apis/track";
import { usePlayer } from "../store/player";
import { useRoute } from "vue-router";
import { useStore } from "../store";
import { isScrollBottom } from "../utils/common";

import TrackList from "../components/trackList.vue";

export default {
  name: "SongList",
  setup() {
    const route = useRoute();
    const store = useStore();
    let name = route.name;

    const data = reactive({
      type: "", // 页面类型 "DailySongs","SongsRecord","FavouriteSongs","Cloud"
      title: "",
      songType: "song", // 歌曲类型

      songs: [], // 日推歌曲
      recordType: 1, // 0: 总排行, 1: 周排行
      hasMore: true,
    });
    const player = usePlayer();
    let loading = false;

    const getData = () => {
      data.type = name;
      if (data.type === "DailySongs") {
        data.title = "每日歌曲推荐";
        getDailtRecommend();
        data.songType = "song";
      }
      if (data.type === "SongsRecord") {
        data.title = "听歌排行";
        getRecordSongList();
        data.songType = "album";
      }
      if (data.type === "FavouriteSongs") {
        data.title = "我的收藏";
        getLikedSong();
        data.songType = "song";
      }
      if (data.type === "Cloud") {
        data.title = "云盘歌曲";
        getCloudSong();
        data.songType = "cloud";
      }
    };

    // 获取每日推荐歌曲
    const getDailtRecommend = () => {
      dailyRecommendTracks().then((res) => {
        data.songs = res.data.dailySongs;
        data.hasMore = false;
        loading = false;
      });
    };

    // 获取听歌排行
    const getRecordSongList = (type = 1) => {
      let key;
      data.songs = [];
      data.hasMore = true;
      type === 1 ? (key = "weekData") : (key = "allData");
      userPlayHistory({ uid: store.userInfo.userId, type }).then((res) => {
        data.songs = res[key].map((item) => {
          return item.song;
        });
        data.hasMore = false;
        loading = false;
      });
    };

    // 获取收藏歌曲
    const getLikedSong = () => {
      let arr = store.likedSongIDs
        .slice(data.songs.length, data.songs.length + 50)
        .join(",");

      getTrackDetail(arr).then((res) => {
        data.songs.push(...res.songs);
        if (res.songs.length < 50) {
          data.hasMore = false;
        }
        loading = false;
      });
    };

    // 获取云盘歌曲
    const getCloudSong = () => {
      getCloud({ limit: 50, offset: data.songs.length }).then((res) => {
        data.songs = data.songs.concat(res.data);
        loading = false;
        data.hasMore = res.hasMore;
      });
    };

    // 获取日期
    const getDate = () => {
      const date = new Date();
      const day = date.getDate();
      return day;
    };

    // 播放歌曲,将id传入歌曲列表
    const play = () => {
      if (data.songs.length === 0 || data.type === "Cloud") return;

      player.trackList = data.songs.map((item) => {
        return item.id;
      });
      player.replaceCurrentTrack(data.songs[0].id);
    };

    // 切换排行榜
    const toggleRecord = () => {
      data.recordType === 1 ? (data.recordType = 0) : (data.recordType = 1);
      getRecordSongList(data.recordType);
    };

    getData();

    const loadMore = () => {
      console.log("滚动");
      if (!data.hasMore) {
        document
          .getElementsByClassName("el-main")[0]
          .removeEventListener("scroll", loadMore);
      }

      if (loading || !data.hasMore) return;
      if (isScrollBottom()) {
        loading = true;
        getData();
      }
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

    return { ...toRefs(data), getDate, play, toggleRecord };
  },
  components: {
    TrackList,
  },
};
</script>
<style lang="scss" scoped>
.load-info {
  color: var(--text-color-secondary);
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8vh 0;
  transform: translateX(-64px);

  .name {
    margin-left: 64px;
    font-size: 64px;
    font-weight: bolder;
  }
}

.icon {
  position: relative;
  font-size: 140px;

  &.favourite {
    color: #ea4c89;
  }
  .date {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: bolder;
  }
}

.control {
  display: flex;
  .play {
    margin-left: 12px;
    margin-bottom: 16px;
    margin-right: 6px;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    padding-left: 12px;
    border-radius: $border-radius-default;
  }
}

.list {
  min-height: 60px;
}

@media screen and(max-width:$lg) {
  .title {
    transform: translateX(-32px);
  }
}

@media screen and(max-width:$md) {
  .title {
    transform: translateX(0);

    .name {
      font-size: 48px;
      margin-left: 32px;
    }

    .icon {
      font-size: 120px;
      .date {
        font-size: 36px;
      }
    }
  }
}

@media screen and(max-width:$md) {
  .title {
    transform: translateX(0);
    flex-direction: column;
    padding: 5vh 0;

    .name {
      font-size: 36px;
      margin-top: 2vh;
      margin-bottom: 2vh;
      margin-left: 0;
    }

    .icon {
      font-size: 96px;
      .date {
        font-size: 28px;
      }
    }
  }
}
</style>
