<script setup>
import Banner from "./components/banner.vue";
import RecomendPlaylist from "./components/recomendPlaylist.vue";
import RecomendOther from "./components/recomendOther.vue";
import PlayListTrack from "./components/playListTrack.vue";
import LatestAlbum from "./components/latestAlbum.vue";
import RecomendFM from "./components/recomendFM.vue";
</script>

<template>
  <div>
    <Banner class="section"> </Banner>

    <!-- 推荐歌单 -->
    <RecomendPlaylist class="section"></RecomendPlaylist>

    <!-- 推荐mv,音乐-->
    <RecomendOther class="section"></RecomendOther>

    <!-- 排行榜 -->

    <section class="section">
      <h4 class="text-style-title">排行榜</h4>
      <div class="charts">
        <PlayListTrack
          class="block"
          name="飙升榜"
          :id="19723756"
        ></PlayListTrack>
        <PlayListTrack
          class="block"
          name="新歌榜"
          :id="3779629"
        ></PlayListTrack>
        <PlayListTrack
          class="block"
          name="热歌榜"
          :id="3778678"
        ></PlayListTrack>
      </div>
    </section>

    <!-- 新专 -->
    <LatestAlbum class="section"></LatestAlbum>

    <!-- 推荐电台 -->
    <!-- <RecomendFM class="section"></RecomendFM> -->
  </div>
</template>

<style lang="scss" scoped>
.charts {
  display: grid;
  width: 100%;
  overflow: hidden;
  grid: repeat(1, 1fr) / auto-flow;

  grid-gap: 20px;
  > * {
    flex: 1 0 0;
  }

  @media screen and (max-width: 1440px) {
    grid: repeat(3, 1fr) / auto-flow;
  }
}
</style>
