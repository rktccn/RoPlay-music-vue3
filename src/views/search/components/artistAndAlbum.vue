<template lang="">
  <section class="artist-album">
    <div class="artist section block" v-if="artist.length !== 0">
      <div class="title">
        <h4 class="text-style-title">音乐人</h4>
        <router-link :to="`/search/${w}/artists`" class="text-style-info"
          >查看全部</router-link
        >
      </div>
      <ul class="list">
        <li class="list-item" v-for="(item, index) in artist" :key="index">
          <PlaylistCard :item="item" type="artist" class="card"></PlaylistCard>
        </li>
      </ul>
    </div>
    <div class="gap"></div>
    <div class="album section block" v-if="album.length !== 0">
      <div class="title">
        <h4 class="text-style-title">专辑</h4>
        <router-link :to="`/search/${w}/albums`" class="text-style-info"
          >查看全部</router-link
        >
      </div>
      <ul class="list">
        <li
          class="list-item"
          :class="[{ 'grid-large': index === 0 || index === 2 }, 'grid-small']"
          v-for="(item, index) in album"
          :key="index"
        >
          <PlaylistCard
            class="card"
            :item="item"
            type="album"
            :showDec="false"
            :size="'100%'"
          ></PlaylistCard>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import { reactive, toRefs } from "vue";
import { search } from "../../../apis/others";

import PlaylistCard from "../../../components/playListCard.vue";

export default {
  name: "searchArtistAndAlbum",
  props: {
    w: { type: String, required: true },
  },
  setup(props) {
    const data = reactive({
      artist: [],
      album: [],
      showDec: false,
    });

    const getArtist = () => {
      let params = {
        keywords: props.w,
        limit: 3,
        type: 100,
      };

      search(params).then((res) => {
        let result = res.result.artists;
        data.artist = result;
      });
    };

    const getAlbum = () => {
      let params = {
        keywords: props.w,
        limit: 9,
        type: 10,
      };
      search(params).then((res) => {
        let result = res.result.albums;
        data.album = result;
      });
    };

    getArtist();
    getAlbum();
    return { ...toRefs(data) };
  },
  components: { PlaylistCard },
};
</script>
<style lang="scss" scoped>
.artist-album {
  display: flex;

  @media screen and(max-width:$lg) {
    flex-direction: column;
  }
  .gap {
    width: 32px;
    @media screen and(max-width:$lg) {
      display: none;
    }
  }

  .artist,
  .album {
    position: relative;
    flex: 1 1 0;
    .card {
      width: 100%;
    }
  }
}

.list {
  position: relative;
  display: grid;
  grid: auto-flow / repeat(15, 1fr);
  grid-auto-flow: dense;
  .list-item {
    grid-column: span 5;
    grid-row: span 5;

    &.grid-small {
      grid-column: span 3;
      grid-row: span 3;
    }

    &.grid-large {
      grid-column: span 6;
      grid-row: span 6;
    }
  }
}
</style>
