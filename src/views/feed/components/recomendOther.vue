<template lang="">
<section>
    <h4 class="text-style-title">视&nbsp;·&nbsp;听</h4>
    <div class="container">
      <div class="left-video">
        <div class="video-container" ref="videoItem">
          <CarouselList :length="video.length" v-if="video" :rows="2" key="video">
            <template v-for="(item, index) in video" :key="index">
              <div class="video-list">
                <PlayListCard :item="item" type="video"></PlayListCard>
              </div>
            </template>
          </CarouselList>
        </div>
      </div>
      <div class="right-song">
        <CarouselList :length="song.length" v-if="song && songRows !== 0" :rows="songRows" key="song" >
          <template v-for="(value, index) in song" :key="index">
            <TrackListItem class="track-item" :height="songItemHeight" :item="value"></TrackListItem>
          </template>
        </CarouselList>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { ToplistOfMV } from "../../../apis/mv";
import { recommendNewSong } from "../../../apis/personalized";

import CarouselList from "../../../components/carouselList.vue";
import TrackListItem from "../../../components/trackListItem.vue";

export default {
  setup() {
    const data = reactive({
      video: null,
      song: null,
      songRows: 0,
      songItemHeight: "64px",
    });

    ToplistOfMV()
      .then((res) => {
        data.video = res.data;
      })
      .then(() => {
        setSongRows();
      });

    recommendNewSong().then((res) => {
      data.song = res.result;
    });

    const videoItem = ref(null);

    // 设置歌曲列表显示列数
    const setSongRows = () => {
      if (window.innerWidth < 1250) {
        data.songRows = 2;
        data.songItemHeight = null;
        return;
      }
      console.log(data.songRows);

      let height = videoItem.value.offsetHeight;
      let size = height / 70;
      size = Math.floor(size);
      data.songRows = size;
      data.songItemHeight = height / size + "px";
    };

    onMounted(() => {
      window.addEventListener("resize", () => setSongRows(), false);
    });

    return { ...toRefs(data), videoItem };
  },
  components: { CarouselList, TrackListItem },
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;

  @media (max-width: $lg) {
    flex-direction: column;
  }
}
.left-video,
.right-song {
  background-color: var(--background-color-primary);
  border-radius: $border-radius-default;
  padding: 8px 12px;
}
.left-video {
  @include calc-width(6.9);
  @media (max-width: $lg) {
    @include calc-width(10);
  }

  .video-container {
    .video-list {
      flex: 0 0 33.3%;
      scroll-snap-align: start;
    }
  }
}
.right-song {
  @include calc-width(2.9);
  @media (max-width: $lg) {
    margin-top: 12px;
    @include calc-width(10);
  }
  .track-item {
    @include calc-width(2.5);
    @media (max-width: $lg) {
      @include calc-width(4.8);
    }
  }
}
</style>
