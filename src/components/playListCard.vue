<template>
  <div>
    <div class="cover">
      <div class="cover-inner">
        <img src="" alt="" />
        <div class="mask"></div>
        <div class="played-count"></div>
      </div>
    </div>
    <div class="dec">
      <div class="tit"></div>
      <div class="info"></div>
    </div>
  </div>
</template>
<script>
import { reactive } from "vue";

import { getPlaylistDetail } from "../apis/playlist";

export default {
  setup() {
    const data = reactive({
      playlistDetail: null,
    });

    getPlaylistDetail(6970160184).then((res) => {
      data.playlistDetail = res;
      console.log(res);
    });
  },
};
</script>
<style lang="scss" scoped></style>
