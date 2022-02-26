<script setup>
import Banner from "./components/banner.vue";
import RecomendPlaylist from "./components/recomendPlaylist.vue";
import RecomendOther from "./components/recomendOther.vue";
import TopList from "./components/topList.vue";
</script>

<template>
  <div>
    <Banner class="section"> </Banner>

    <!-- 推荐歌单 -->
    <RecomendPlaylist class="section"></RecomendPlaylist>

    <!-- 推荐mv,音乐-->
    <RecomendOther class="section"></RecomendOther>

    <!-- 排行榜 -->
    <section class="charts section">
      <TopList></TopList>
      <TopList></TopList>
    </section>
    <!-- 新单，新歌 -->

    <!-- 推荐电台 -->

    <br />
    <br />
  </div>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 24px;
}

.charts {
  display: flex;
  width: 100%;

  overflow: hidden;

  > * {
    flex: 1 0 0;
  }
}
</style>
