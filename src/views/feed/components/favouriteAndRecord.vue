<template lang="">
  <section>
    <div class="favourite container-primary">
      <ul class="song-list text-style-info" v-if="favouriteSongsName[0]">
        <li
          class="song-name"
          v-for="(name, index) in favouriteSongsName"
          :key="index"
        >
          {{ name }}
        </li>
      </ul>
      <div class="text-style-title title" @click.self="goTo('FavouriteSongs')">
        我喜欢
        <span class="material-symbols-rounded fill icon" @click="play">
          play_arrow
        </span>
      </div>
    </div>

    <div class="record" v-if="recordSongList">
      <div class="text-style-title title" @click.self="goTo('SongsRecord')">
        听歌排行
        <div class="text-style-info" @click="toggleRecord">
          {{ recordType === 1 ? "最近一周" : "所有时间" }}
        </div>
      </div>
      <TrackList
        :tracks="recordSongList.songList"
        type="album"
        class="tracklist"
      ></TrackList>
    </div>
  </section>
</template>
<script>
import { userLikedSongsIDs, userPlayHistory } from "../../../apis/user";
import { getTrackDetail } from "../../../apis/track";
import { reactive, toRefs } from "vue";

import TrackList from "../../../components/trackList.vue";
import { useStore } from "../../../store";
import { useRouter } from "vue-router";
import { usePlayer } from "../../../store/player";
export default {
  name: "FavouriteAndRecord",
  setup() {
    const router = useRouter();
    const data = reactive({
      favouriteSongsName: [],
      favouriteSongsCount: 0,

      recordSongList: {
        songList: [],
        scoreList: [],
      },
      recordType: 1, // 0: 总排行, 1: 周排行
    });
    let favouriteIds = [];

    const store = useStore();
    const player = usePlayer();

    const getData = () => {
      getFavouriteSongsName();
      getRecordSongList(1);
    };

    // 获取前30首歌曲名称
    const getFavouriteSongsName = () => {
      userLikedSongsIDs().then((res) => {
        console.log(res);
        data.favouriteSongsCount = res.ids.length;
        favouriteIds = res.ids;
        const ids = res.ids.slice(0, 25);
        getTrackDetail(ids.join(",")).then((res) => {
          data.favouriteSongsName = res.songs.map((item) => {
            return item.name;
          });
        });
      });
    };

    // 获取听歌排行
    const getRecordSongList = (type = 1) => {
      let key;
      type === 1 ? (key = "weekData") : (key = "allData");
      data.recordSongList.songList = [];
      data.recordSongList.scoreList = [];

      userPlayHistory({ uid: store.userInfo.userId, type }).then((res) => {
        for (let i = 0; i < 3; i++) {
          if (res[key][i] === undefined) {
            return;
          }
          data.recordSongList.scoreList.push(res[key][i].score);
          data.recordSongList.songList.push(res[key][i].song);
        }
      });
    };

    // 切换显示最近一周和全部排行
    const toggleRecord = () => {
      data.recordType === 1 ? (data.recordType = 0) : (data.recordType = 1);
      getRecordSongList(data.recordType);
    };

    // 跳转页面
    const goTo = (val) => {
      router.push({
        name: val,
      });
    };

    // 播放音乐
    const play = () => {
      if (favouriteIds.length === 0) return;
      console.log(favouriteIds);
      player.trackList = favouriteIds;
      player.replaceCurrentTrack(favouriteIds[0]);
    };

    getData();

    return { ...toRefs(data), toggleRecord, goTo, play };
  },
  components: {
    TrackList,
  },
};
</script>
<style lang="scss" scoped>
@keyframes NameMoveIn {
  0% {
    transform: translateX(30%);
  }
  100% {
    transform: translateX(0);
  }
}

@mixin NameMoveIn($time) {
  animation: NameMoveIn $time ease-out;
}
section {
  display: flex;
  justify-content: space-between;
}
.favourite {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @include calc-width(4.9);
  height: 224px;
  padding: 16px 32px;
  border-radius: $border-radius-default * 3;

  .song-list {
    flex: 1 1 0;
    overflow: hidden;
    margin-bottom: 14px;

    .song-name {
      float: left;
      margin: 0 4px;
      height: 26px;
      line-height: 26px;
      opacity: 0.68;
      @include NameMoveIn(0.5s);

      &:nth-child(3n) {
        @include NameMoveIn(0.3s);
        font-size: 16px;
        font-weight: bolder;
      }
      &:nth-child(2n) {
        @include NameMoveIn(0.4s);
      }
    }
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icon {
      font-size: 48px;
      margin-right: 32px;
    }
  }
}

.record {
  display: flex;
  @include calc-width(4.9);
  height: 224px;
  padding: 16px 32px;
  border-radius: $border-radius-default * 3;
  background-color: #fff;
  padding-left: 8px;

  .title {
    line-height: 1.3;
    width: min-content;
    padding: 0 16px;
    cursor: pointer;

    .text-style-info {
      margin-top: 6px;
    }
  }

  .tracklist {
    flex: 1 1 0;
  }
}
</style>
