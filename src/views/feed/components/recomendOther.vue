<template lang="">
  <section>
    <h4 class="text-style-title">音乐</h4>
    <div class="container">
      <div class="left-video">
        <div class="video-container">
          <CarouselList :length="video.length" v-if="video" :rows="2">
            <template v-for="(item, index) in video" :key="index">
            <div class="video-list">
              <PlayListCard :item="item" type="video"></PlayListCard>
            </div>
            </template>
          </CarouselList>
        </div>
      </div>
      <div class="right-song"></div>
    </div>
  </section>
</template>
<script>
import { reactive, toRefs } from "vue";
import { ToplistOfMV } from "../../../apis/mv";
import CarouselList from "../../../components/carouselList.vue";

export default {
  setup() {
    const data = reactive({
      video: null,
      numm:[1,2,3,4,5,6,7,8,9,10]
    });

    ToplistOfMV().then((res) => {
      data.video = res.data;
    });

    return { ...toRefs(data) };
  },
  components: { CarouselList },
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
}
.left-video,
.right-song {
  background-color: var(--background-color-primary);
  border-radius: $border-radius-default;
  padding: 8px 12px;
}

.left-video {
  @include calc-width(6.9);

  .video-container {
    .video-list {
      flex: 0 0 33.3%;
      scroll-snap-align: start;
    }
  }
}
.right-song {
  @include calc-width(2.9);
}
</style>
