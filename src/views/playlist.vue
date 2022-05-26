<template lang="">
  <div class="playlist" ref="trackList">
    <ContextInfo
      class="playlist-info"
      :item="item"
      v-if="item"
      v-loading="item === null"
      :type="'playlist'"
    ></ContextInfo>
    <TrackList
      class="playlist-list"
      :tracks="tracks"
      scrollerSelector=".el-main"
      v-if="tracks"
    >
    </TrackList>
  </div>
  <p class="load-info font-size-12" @click="dododo">
    {{ hasMore ? "正在加载" : "已加载全部" }}
  </p>
</template>
<script>
import ContextInfo from "../components/contextInfo.vue";
import TrackList from "../components/trackListItem.vue";

import { getPlaylistDetail, getPlaylistTracks } from "../apis/playlist";
import { reactive, toRefs, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { isScrollBottom } from "../utils/common";
export default {
  name: "playlist",
  props: {},
  setup() {
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const trackList = ref(null);
    let loading = false; // 滚动加载
    let overTracks = []; // 多出部分的歌曲
    let offset = 0;

    const data = reactive({
      item: null,
      tracks: null,
      trackCount: null,
      maxPage: 0, //最大页数
      hasMore: true,
    });

    const loadMore = async () => {
      if (loading || data.tracks === null) return;
      if (isScrollBottom()) {
        loading = true;
        data.offset++;

        await getPlaylistTracks({ id, offset: ++offset }).then((res) => {
          if (offset >= data.maxPage) {
            data.tracks.push(...res.songs.splice(-overTracks));
            data.hasMore = false;
            document
              .getElementsByClassName("el-main")[0]
              .removeEventListener("scroll", loadMore);
            return;
          }
          data.tracks.push(...res.songs);
          loading = false;
        });
      }
    };

    const getData = async () => {
      await getPlaylistDetail(id)
        .then((res) => {
          if (res.code === 200) {
            data.item = res.playlist;
            data.trackCount = res.playlist.trackCount;

            return;
          }

          let msg = "";
          if (res.code === 404) {
            msg = "歌单不存在";
          } else if (res.code === 20001) {
            msg = "需要登陆";
          } else {
            msg = "没有相关内容";
          }

          ElMessageBox.alert(msg, "错误", {
            confirmButtonText: "返回主页",
            callback: () => {
              router.push({ name: "home" });
            },
          });
        })
        .catch((err) => {
          // ElMessageBox.alert("没有相关内容", "错误", {
          //   confirmButtonText: "返回主页",
          //   callback: () => {
          //     router.push({ name: "home" });
          //   },
          // });
        });

      await getPlaylistTracks({ id }).then((res) => {
        data.tracks = res.songs;
        data.maxPage = Math.ceil(data.trackCount / 20) - 1;
        overTracks = data.trackCount % 20; // 多余歌曲

        if (data.maxPage === 0) {
          loading = false;
          data.hasMore = false;

          document
            .getElementsByClassName("el-main")[0]
            .removeEventListener("scroll", loadMore);
          return;
        }
      });
    };

    getData();

    onMounted(() => {
      document
        .getElementsByClassName("el-main")[0]
        .addEventListener("scroll", loadMore);
    });

    onBeforeUnmount(() => {
      document
        .getElementsByClassName("el-main")[0]
        .removeEventListener("scroll", loadMore);
    });
    return {
      ...toRefs(data),
      trackList,
    };
  },
  components: {
    ContextInfo,
    TrackList,
    // TextModal
  },
};
</script>
<style lang="scss" scoped>
.playlist-list {
  margin-top: 48px;
  margin-bottom: 24px;

  @media screen and(max-width:$lg) {
    margin-top: 36px;
  }

  @media screen and(max-width:$lg) {
    margin: 0px;
  }
}

.load-info {
  color: var(--text-color-secondary);
}
</style>
