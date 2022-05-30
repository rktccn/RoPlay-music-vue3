<template lang="">
  <div v-if="resultList[0]">
    <div class="songs" v-if="TYPE === 'songs'">
      <TrackList :tracks="resultList" scrollerSelector=".el-main"></TrackList>
    </div>

    <div :class="TYPE" v-if="TYPE !== 'songs'">
      <CoverRow :type="TYPE">
        <li v-for="(item, index) in resultList" :key="index">
          <PlayListCard
            class="item"
            :item="item"
            :type="TYPE.slice(0, -1)"
          ></PlayListCard>
        </li>
      </CoverRow>
    </div>
  </div>
  <p class="load-info font-size-12">
    {{ hasMore ? "正在加载" : "已加载全部" }}
  </p>
</template>
<script lang="ts">
import { onMounted, onUnmounted, reactive, toRefs, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { getArtistSongs, getArtistAlbum, getArtistMv } from "../apis/artist";
import { isScrollBottom } from "../utils/common";

import TrackList from "../components/trackList.vue";
import CoverRow from "../components/coverRow.vue";
import PlayListCard from "../components/playListCard.vue";

let TYPE = "songs";
let ARTIST_ID = 0;
export default defineComponent({
  name: "artistType",
  setup() {
    const route = useRoute();

    TYPE = route.params.type.toString();
    ARTIST_ID = +route.params.id;

    const data = reactive({
      resultList: [],
      hasMore: false,
      type: null,
    });
    let loading = false;

    // 获取搜索结果
    const getResult = (params: { offset: number; limit?: number }) => {
      if (loading) return;
      loading = true;
      switch (TYPE) {
        case "songs":
          getArtistSongs({ id: ARTIST_ID, ...params }).then((res: any) => {
            data.resultList.push(...res.songs);

            data.hasMore = res.more;
            loading = false;
          });

          break;
        case "albums":
          getArtistAlbum({ id: ARTIST_ID, ...params }).then((res: any) => {
            data.resultList.push(...res.hotAlbums);
            data.hasMore = res.more;
            loading = false;
          });
          break;
        case "videos":
          getArtistMv({ id: ARTIST_ID, ...params }).then((res: any) => {
            data.resultList.push(...res.mvs);
            data.hasMore = res.more;
            loading = false;
          });
          break;
        default:
          getArtistSongs({ id: ARTIST_ID, ...params }).then((res: any) => {
            data.resultList.push(...res.songs);
            data.hasMore = res.more;
            loading = false;
          });
          break;
      }
    };

    // 滚动加载
    const loadMore = () => {
      if (isScrollBottom()) {
        if (data.hasMore) {
          getResult({
            offset: data.resultList.length,
            limit: 50,
          });
        } else {
          document
            .getElementsByClassName("el-main")[0]
            .removeEventListener("scroll", loadMore);
        }
      }
    };

    onMounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .addEventListener("scroll", loadMore);
    });

    onUnmounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .removeEventListener("scroll", loadMore);
    });

    getResult({
      offset: data.resultList.length,
      limit: 50,
    });
    return { ...toRefs(data), TYPE };
  },

  components: {
    TrackList,
    CoverRow,
    PlayListCard,
  },
});
</script>
<style lang="scss" scoped>
.videos,
.mvs {
  li {
    zoom: 0.83333;
  }
}
</style>
