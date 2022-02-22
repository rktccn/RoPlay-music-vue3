<script setup>
import Banner from "./components/banner.vue";
import RecomendPlaylist from "./components/recomendPlaylist.vue";
import RecomendOther from "./components/recomendOther.vue";
</script>

<template>
  <div>
    <Banner class="section"> </Banner>

    <!-- 推荐歌单 -->
    <RecomendPlaylist class="section"></RecomendPlaylist>

    <!-- 推荐mv,音乐-->
    <RecomendOther class="section"></RecomendOther>
    <br />
    <br />

    <!-- 排行榜 -->

    <!-- 新单，新歌 -->

    <!-- 推荐电台 -->
  </div>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 24px;
}
</style>
