<template>
  <section>
    <h4 class="text-style-title">推荐歌单</h4>
    <RowList v-if="playlist" :length="numm.length">
      <PlayListCard
        :item="playlist"
        type="playlist"
        v-for="index in numm"
        :key="index"
      ></PlayListCard>
    </RowList>
  </section>
</template>
<script>
import { topPlaylist } from "../../../apis/playlist";
import { reactive, toRefs } from "vue";
import PlayListCard from "../../../components/playListCard.vue";
import RowList from "../../../components/rowList.vue";

export default {
  setup() {
    const data = reactive({
      playlist: null,
      numm: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    });
    topPlaylist().then((res) => {
      console.log(res);
      data.playlist = res.playlists[1];
    });

    return { ...toRefs(data) };
  },
  components: { PlayListCard, RowList },
};
</script>
<style lang="scss" scoped></style>
