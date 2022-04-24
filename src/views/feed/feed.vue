<template lang="">
  <div>
    <ForYou class="section"></ForYou>

    <FavouriteAndRecord class="section"></FavouriteAndRecord>
    <!-- 心动模式 -->
    <section>
      <div class="text-style-title">根据「温柔」推荐</div>
    </section>

    <!-- 歌单雷达 -->
    <section>
      <div class="text-style-title">歌单雷达</div>
    </section>

    <!-- 推荐歌单 -->
    <section>
      <div class="text-style-title">推荐歌单</div>
    </section>

    <!-- 动态更新 -->
    <section>
      <div class="text-style-title">不要错过</div>
    </section>
  </div>
</template>
<script>
import ForYou from "./components/forYou.vue";
import FavouriteAndRecord from "./components/favouriteAndRecord.vue";

export default {
  name: "Feed",
  setup() {},
  components: {
    ForYou,
    FavouriteAndRecord,
  },
};
</script>
<style lang="scss" scoped></style>
