<template lang="">
  <div class="artist-page">
    <ContextInfo
      class="section"
      :item="item.artist"
      :type="'artist'"
      v-if="item"
    ></ContextInfo>

    <!-- 新专和热歌 -->
    <div class="album-songs">
      <div class="new-album section" v-if="albums">
        <div class="text-style-title">最新发布</div>
        <div class="inner">
          <PlayListCard :item="albums[0]" type="album"></PlayListCard>
          <PlayListCard :item="albums[1]" type="album"></PlayListCard>
        </div>
      </div>

      <div class="top-song section" v-if="hotSongs">
        <div class="text-style-title">热门歌曲</div>
        <div class="inner">
          <CarouselList :length="hotSongs.length" :rows="4">
            <li v-for="(song, index) in hotSongs" :key="index">
              <TrackListItem
                :item="song"
                :index="index"
                class="track-item"
              ></TrackListItem>
            </li>
          </CarouselList>
        </div>
      </div>
    </div>

    <!-- 视频 -->
    <div class="mvs block section" v-if="mvs.length !== 0">
      <div class="text-style-title">视频</div>
      <CarouselList :length="mvs.length" :rows="mvs.length >= 6 ? 2 : 1">
        <li v-for="(mv, index) in mvs" :key="index">
          <PlayListCard
            :item="mv"
            :index="index"
            class="track-item"
            :type="'video'"
          ></PlayListCard>
        </li>
      </CarouselList>
    </div>

    <!-- 相似歌手 -->
    <div class="simi-artist section" v-if="simiArtists.length !== 0">
      <div class="text-style-title">相似歌手</div>

      <CarouselList :length="simiArtists.length">
        <li v-for="(artist, index) in simiArtists" :key="index">
          <PlayListCard
            :item="artist"
            :index="index"
            class="track-item"
            :type="'artist'"
          ></PlayListCard>
        </li>
      </CarouselList>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import {
  getArtist,
  getArtistAlbum,
  getArtistMv,
  getSimilarArtists,
} from "../apis/artist";

import ContextInfo from "../components/contextInfo.vue";
import PlayListCard from "../components/playlistCard.vue";
import CarouselList from "../components/carouselList.vue";
import TrackListItem from "../components/trackListItem.vue";
import { useRoute } from "vue-router";
export default {
  name: "Atrist",
  setup() {
    const data = reactive({
      item: null,
      hotSongs: null,
      albums: null,
      mvs: [],
      simiArtists: [],
      id: null,
    });

    const route = useRoute();
    data.id = route.params.id;

    const getData = (id) => {
      getArtist(id).then((res) => {
        data.item = res;
        data.hotSongs = res.hotSongs.splice(0, 20);
      });

      getArtistAlbum({ id, limit: 2 }).then((res) => {
        data.albums = res.hotAlbums;
        console.log(data.albums);
      });

      getArtistMv({ id, limit: 16 }).then((res) => {
        data.mvs = res.mvs;
      });

      getSimilarArtists(id).then((res) => {
        data.simiArtists = res.artists.splice(0, 5);
      });
    };

    getData(data.id);

    return { ...toRefs(data) };
  },
  components: {
    ContextInfo,
    CarouselList,
    PlayListCard,
    TrackListItem,
  },
};
</script>

<style lang="scss">
.album-songs {
  display: flex;
  justify-content: space-between;

  .new-album {
    @include calc-width(4);

    .inner {
      display: flex;
    }
  }

  .top-song {
    @include calc-width(5.9);

    .track-item {
      @include calc-width(2.5);
    }
  }
}

@media screen and (max-width: $lg) {
  .album-songs {
    flex-direction: column;
    .new-album {
      @include calc-width(5);
    }

    .top-song {
      @include calc-width(5);
      .track-item {
        @include calc-width(4.5);
      }
    }
  }
}
</style>
