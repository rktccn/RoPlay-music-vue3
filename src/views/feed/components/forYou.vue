<template lang="">
  <section class="for-you">
    <div class="text-style-title">For You</div>
    <ul class="item-list">
      <!-- 私人fm -->
      <li class="block personal_fm">
        <div class="cover">
          <img
            :src="`${
              player.personalFMCurrent.album.picUrl || ''
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
              {{ player.isPlaying ? "pause" : "play_arrow" }}
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
            <span class="material-icons-outlined review icon font-size-24"
              >chat</span
            >
          </div>
        </div>
      </li>
      <!-- 日推 -->
      <li class="playlist">
        <PlayListCard
          type="playlist"
          size="100%"
          :showArtist="false"
          :item="item"
          v-if="item"
        ></PlayListCard>
      </li>
      <!-- 推荐歌单 -->
      <li class="playlist">
        <PlayListCard
          type="playlist"
          size="100%"
          :showArtist="false"
          :item="item"
          v-if="item"
        ></PlayListCard>
      </li>
      <li class="playlist">
        <PlayListCard
          type="playlist"
          size="100%"
          :showArtist="false"
          :item="item"
          v-if="item"
        ></PlayListCard>
      </li>
    </ul>
  </section>
</template>
<script>
import { reactive, toRefs } from "vue";
import { getPlaylistDetail } from "../../../apis/playlist";
import { usePlayer } from "../../../store/player";
import { storeToRefs } from "pinia";

import PlayListCard from "../../../components/playListCard.vue";
import ArtistFormat from "../../../components/artistFormat.vue";

export default {
  name: "ForYou",
  setup() {
    const data = reactive({
      item: null,
    });
    const player = usePlayer();
    const { personalFMCurrent } = storeToRefs(player);

    // 获取数据
    const getData = () => {
      getPlaylistDetail(2130746789).then((res) => {
        data.item = res.playlist;
      });
    };

    // getData();
    return { ...toRefs(data), player, personalFMCurrent };
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
  .cover {
    position: relative;
    width: 35%;
    margin-right: 16px;
    margin-left: 5%;
    border-radius: $border-radius-default;
    overflow: hidden;
    img {
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
</style>
