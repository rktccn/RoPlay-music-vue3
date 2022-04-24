<template lang="">
  <div>
    <div class="title">
      <span class="material-symbols-rounded icon" v-if="type === 'SongsRecord'">
        equalizer
      </span>
      <span class="material-symbols-rounded icon" v-if="type === 'DailySongs'">
        calendar_today
        <div class="date">{{ getDate() }}</div></span
      >
      <span
        class="material-symbols-rounded fill icon favourite"
        v-if="type === 'FavouriteSongs'"
      >
        favorite
      </span>

      <div class="name">{{ title }}</div>
    </div>
    <div class="control">
      <button class="play primary" @click="play">
        <span class="material-symbols-rounded fill">play_arrow</span>
        播放
      </button>
      <button
        class="play record-type block"
        @click="toggleRecord"
        v-if="type === 'SongsRecord'"
      >
        {{ recordType === 1 ? "最近一周" : "所有时间" }}
      </button>
    </div>
    <div v-loading="!songs[0]" class="list">
      <TrackList
        :tracks="songs"
        v-if="songs[0]"
        :type="type === 'SongsRecord' ? 'album' : ''"
      ></TrackList>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { dailyRecommendTracks } from "../apis/personalized";
import { userPlayHistory, userLikedSongsIDs } from "../apis/user";
import { getTrackDetail } from "../apis/track";
import { usePlayer } from "../store/player";
import { useRoute } from "vue-router";
import { useStore } from "../store";

import TrackList from "../components/trackList.vue";

export default {
  name: "SongList",
  setup() {
    const route = useRoute();
    const store = useStore();
    let name = route.name;

    const data = reactive({
      type: "", // 页面类型 "DailySongs","SongsRecord","FavouriteSongs"
      title: "",

      songs: [], // 日推歌曲
      recordType: 1, // 0: 总排行, 1: 周排行
    });
    const player = usePlayer();

    const getData = () => {
      data.type = name;

      if (data.type === "DailySongs") {
        data.title = "每日歌曲推荐";
        getDailtRecommend();
      }
      if (data.type === "SongsRecord") {
        data.title = "听歌排行";
        getRecordSongList();
      }
      if (data.type === "FavouriteSongs") {
        data.title = "我的收藏";
        getLikedSong();
      }
    };

    // 获取每日推荐歌曲
    const getDailtRecommend = () => {
      data.songs = [];
      dailyRecommendTracks().then((res) => {
        data.songs = res.data.dailySongs;
      });
    };

    // 获取听歌排行
    const getRecordSongList = (type = 1) => {
      let key;
      type === 1 ? (key = "weekData") : (key = "allData");
      data.songs = [];

      userPlayHistory({ uid: store.userInfo.userId, type }).then((res) => {
        data.songs = res[key].map((item) => {
          return item.song;
        });
      });
    };

    // 获取收藏歌曲
    const getLikedSong = () => {
      data.songs = [];
      userLikedSongsIDs({ uid: store.userInfo.userId }).then((res) => {
        getTrackDetail(res.ids.join(",")).then((res) => {
          data.songs = res.songs;
        });
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
      if (data.songs.length === 0) return;
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
    return { ...toRefs(data), getDate, play, toggleRecord };
  },
  components: {
    TrackList,
  },
};
</script>
<style lang="scss" scoped>
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
  .record-type {
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
