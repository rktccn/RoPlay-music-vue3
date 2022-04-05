<template lang="">
  <section>
    <h4 class="text-style-title">视&nbsp;·&nbsp;听</h4>
    <div class="container">
      <div class="left-video">
        <div class="video-container" ref="videoItem">
          <CarouselList
            :length="video.length"
            v-if="video"
            :rows="2"
            key="video"
          >
            <div class="video-list" v-for="(item, index) in video" :key="index">
              <PlayListCard :item="item" type="video"></PlayListCard>
            </div>
          </CarouselList>
        </div>
      </div>
      <div class="right-song">
        <CarouselList
          :length="song.length"
          v-if="song && songRows !== 0"
          :rows="songRows"
          key="song"
        >
          <div v-for="(value, index) in song" :key="index">
            <TrackListItem
              class="track-item"
              :height="songItemHeight"
              :item="value.song"
            ></TrackListItem>
          </div>
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
import PlayListCard from "../../../components/playListCard.vue";

export default {
  name: "exploreOther",
  setup() {
    const data = reactive({
      video: null,
      song: null,
      songRows: 0,
      songItemHeight: "64px",
    });

    ToplistOfMV({ limit: 20 }).then((res) => {
      data.video = res.data;
      setSongRows();
    });

    recommendNewSong().then((res) => {
      data.song = res.result;
    });

    const videoItem = ref(null);

    // 设置歌曲列表显示列数
    const setSongRows = (height) => {
      if (window.innerWidth < 1250) {
        data.songRows = 2;
        data.songItemHeight = "64px";
        return;
      }
      let size = height / 70;
      size = Math.floor(size);
      data.songRows = size;
      data.songItemHeight = height / size + "px";
    };

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        setSongRows(cr.height);
      }
    });

    onMounted(() => {
      ro.observe(videoItem.value);
    });

    return { ...toRefs(data), videoItem };
  },
  components: { CarouselList, TrackListItem, PlayListCard },
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
    width: 100%;
    max-width: 100%;
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
    width: 100%;
    max-width: 100%;
  }
  .track-item {
    @include calc-width(2.5);
    @media (max-width: $lg) {
      @include calc-width(4.3);
    }
  }
}
</style>
