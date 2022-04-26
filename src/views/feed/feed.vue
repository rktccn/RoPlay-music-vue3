<template lang="">
  <div>
    <ForYou class="section"></ForYou>

    <FavouriteAndRecord class="section"></FavouriteAndRecord>

    <!-- <MyPlaylist></MyPlaylist> -->

    <!-- <Follow></Follow> -->

    <Playlist></Playlist>
  </div>
</template>
<script>
import ForYou from "./components/forYou.vue";
import FavouriteAndRecord from "./components/favouriteAndRecord.vue";
import MyPlaylist from "./components/myPlaylist.vue";
import Follow from "./components/follow.vue";
import Playlist from "./components/playlist.vue";

export default {
  name: "Feed",
  setup() {},
  components: {
    ForYou,
    FavouriteAndRecord,
    MyPlaylist,
    Follow,
    Playlist,
  },
};
</script>
<style lang="scss" scoped></style>
