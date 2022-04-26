<template lang="">
  <section class="section">
    <div class="text-style-title">我的歌单</div>
  </section>
  <CoverRow v-if="list[0]">
    <PlayListCard
      v-for="(playlist, index) in list"
      :key="index"
      type="playlist"
      :item="playlist"
    ></PlayListCard>
  </CoverRow>
</template>
<script>
import { onMounted, onUnmounted, reactive, toRefs } from "vue";
import { getUserPlaylist } from "../../../apis/user";
import { useStore } from "../../../store";
import { isScrollBottom } from "../../../utils/common";

import CoverRow from "../../../components/coverRow.vue";
import PlayListCard from "../../../components/playListCard.vue";

export default {
  name: "FeedMyPlaylist",
  setup() {
    const store = useStore();
    const data = reactive({
      hasMore: true,
      list: [],
    });
    let loading = false;

    // 获取歌单，每次加载50个
    const getPlaylist = async () => {
      if (loading) return;
      loading = true;
      const res = await getUserPlaylist({
        uid: store.userInfo.userId,
        limit: 50,
        offset: data.list.length,
      });
      if (res.code === 200) {
        data.list = data.list.concat(res.playlist);
        if (res.playlist.length < 50) {
          data.hasMore = false;
          document
            .getElementsByClassName("el-main")[0]
            .removeEventListener("scroll", loadMore);
        }
      }
      loading = false;
    };

    // 滚动到底部加载
    const loadMore = () => {
      if (isScrollBottom()) {
        getPlaylist();
      }
    };

    getPlaylist();

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

    return { ...toRefs(data) };
  },
  components: {
    CoverRow,
    PlayListCard,
  },
};
</script>
<style lang="scss" scoped></style>
