<template>
  <div class="section" v-if="playLists.length !== 0">
    <div class="title">
      <h4 class="text-style-title">歌单</h4>
      <router-link :to="`/search/${w}/playlists`" class="text-style-info"
      >查看全部
      </router-link
      >
    </div>
    <CarouselList :length="playLists.length">
      <li v-for="(item, index) in playLists" :key="index">
        <PlaylistCard :item="item" type="playlist"></PlaylistCard>
      </li>
    </CarouselList>
  </div>
</template>
<script>
import {reactive, toRefs} from "vue";
import {search} from "../../../apis/others";

import PlaylistCard from "../../../components/playListCard.vue";
import CarouselList from "../../../components/carouselList.vue";

export default {
  name: "searchPlayList",
  props: {
    w: {type: String, required: true},
  },
  setup(props) {
    const data = reactive({
      playLists: [],
    });

    const getPlaylists = () => {
      let params = {
        keywords: props.w,
        limit: 10,
        type: 1000,
      };
      search(params).then((res) => {
        data.playLists = res.result.playlists;
      });
    };

    getPlaylists();

    return { ...toRefs(data) };
  },
  components: { PlaylistCard, CarouselList },
};
</script>
<style lang="scss" scoped></style>
