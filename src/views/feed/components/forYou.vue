<template>
  <section class="for-you">
    <div class="text-style-title">For You</div>
    <ul class="item-list">
      <!-- 私人fm -->
      <li class="block personal_fm">
        <div class="cover">
          <el-image
              lazy
              class="pic"
              :src="`${
              player.personalFMCurrent?.album?.picUrl || ''
            }?param=240y240`"
            alt="歌曲封面"
          />
        </div>
        <div class="info">
          <span
            class="name font-size-24 text-truncate"
            v-if="personalFMCurrent !== {}"
            >{{ personalFMCurrent.name }}</span
          >
          <span
            class="artist text-style-info text-truncate"
            v-if="personalFMCurrent !== {}"
            ><ArtistFormat
              :artistList="personalFMCurrent.artists"
            ></ArtistFormat
          ></span>
          <div class="control">
            <span
              class="material-icons-round play-pause icon font-size-32"
              @click="player.playPersonalFM()"
            >
              {{
                player.isPlaying && player.isPersonalFM ? "pause" : "play_arrow"
              }}
            </span>
            <span
              class="material-icons-round next icon font-size-32"
              @click="player.playNextPersonalFM()"
              >skip_next</span
            >
            <span class="material-icons-round like icon font-size-24"
              >favorite_border</span
            >
            <span class="material-icons-round dislike icon font-size-26"
              >delete_outline</span
            >
          </div>
        </div>
      </li>

      <!-- 日推 -->
      <li class="daily-songs" v-if="dailySongs[0]">
        <div class="cover">
          <el-image
            lazy
            class="pic"
            :src="`${dailySongs[0].al.picUrl}?param=480y480`"
            alt=""
          />
          <div class="sign primary">
            <span>{{ getDate() }}</span>
          </div>
          <div class="mask" @click.self="goToDailySongs">
            <span class="material-icons-round" @click="playDailySongs">
              play_arrow
            </span>
          </div>
        </div>
        <div class="name" @click.self="goToDailySongs">今日推荐</div>
      </li>

      <!-- 推荐歌单 -->
      <li class="playlist">
        <PlayListCard
          type="playlist"
          size="100%"
          :showArtist="false"
          :item="dailyPlaylist[0]"
          v-if="dailyPlaylist[0]"
        ></PlayListCard>
      </li>
      <li class="playlist">
        <PlayListCard
          type="playlist"
          size="100%"
          :showArtist="false"
          :item="dailyPlaylist[1]"
          v-if="dailyPlaylist[1]"
        ></PlayListCard>
      </li>
    </ul>
  </section>
</template>
<script>
import {reactive, toRefs} from "vue";
import {usePlayer} from "../../../store/player";
import {storeToRefs} from "pinia";
import {dailyRecommendPlaylist, dailyRecommendTracks,} from "../../../apis/personalized";

import PlayListCard from "../../../components/playListCard.vue";
import ArtistFormat from "../../../components/artistFormat.vue";
import {useRouter} from "vue-router";

export default {
  name: "FeedForYou",
  setup() {
    const data = reactive({
      item: null,
      dailySongs: [], // 日推歌曲
      dailyPlaylist: [], // 日推歌单
    });
    const player = usePlayer();
    const { personalFMCurrent } = storeToRefs(player);
    const router = useRouter();

    // 获取数据
    const getData = () => {
      dailyRecommendPlaylist().then((res) => {
        console.log(res);
        data.dailyPlaylist.push(res.recommend[0]);
        data.dailyPlaylist.push(res.recommend[1]);
      });

      dailyRecommendTracks().then((res) => {
        data.dailySongs = res.data.dailySongs;
      });
    };

    // 获取当前日期
    const getDate = () => {
      const date = new Date();
      return date.getDate();
    };

    // 播放歌曲,将id传入歌曲列表
    const playDailySongs = () => {
      console.log("123123");
      if (data.dailySongs.length === 0) return;
      player.trackList = data.dailySongs.map((item) => {
        return item.id;
      });
      player.replaceCurrentTrack(data.dailySongs[0].id);
    };

    const goToDailySongs = () => {
      router.push("/dailySongs");
    };

    getData();
    return {
      ...toRefs(data),
      player,
      personalFMCurrent,
      getDate,
      playDailySongs,
      goToDailySongs,
    };
  },
  components: {
    PlayListCard,
    ArtistFormat,
  },
};
</script>
<style lang="scss" scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  .playlist {
    overflow: hidden;
    grid-column: span 2;
  }
}
.personal_fm {
  display: flex;
  align-items: center;
  grid-column: span 5;
  margin-top: 0.6vw;
  margin-bottom: 0.6vw;
  .cover {
    position: relative;
    width: 35%;
    margin-right: 16px;
    margin-left: 5%;
    border-radius: $border-radius-default;
    overflow: hidden;
    .pic {
      border-radius: $border-radius-default;
      width: 100%;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    overflow: hidden;

    .name {
      font-weight: bolder;
    }

    .control {
      display: flex;
      align-items: center;
      margin-top: 8px;

      .icon {
        margin-right: 4px;
      }
    }
  }
}

.daily-songs {
  width: 100%;
  max-width: 100%;
  padding: 0.6vw 0.9vw;
  overflow: hidden;
  grid-column: span 2;
  cursor: pointer;
  .cover {
    position: relative;
    width: 100%;
    overflow: hidden;
    margin-bottom: 3px;
    border-radius: $border-radius-default;
    transition: all $transition-time-default;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(-45deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    }

    .pic {
      width: 100%;
      transition: all $transition-time-default;
    }

    .sign {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 21%;
      height: 21%;
      border-radius: 100% 0 0 0;
      font-weight: bolder;
      font-size: 38px;
      z-index: 1;

      span {
        display: block;
        transform: translate(-20px, -14px);
      }
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0);
      transition: all $transition-time-default;
      z-index: 1;

      span {
        font-size: 5rem;
        color: #fff;
        opacity: 0;
        transition: all 0.3s;
      }
    }

    &:hover {
      .pic {
        transform: scale(1.1);
      }
      .mask {
        background-color: rgba(0, 0, 0, 0.2);

        span {
          opacity: 1;
        }
      }
    }
  }
}
</style>
