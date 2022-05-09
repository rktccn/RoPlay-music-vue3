<template lang="">
  <div v-if="resultList !== []">
    <div class="songs" v-if="type === 'songs'">
      <TrackList :tracks="resultList"></TrackList>
    </div>

    <div :class="type" v-if="type !== 'songs'">
      <CoverRow :type="type">
        <li v-for="(item, index) in resultList" :key="index">
          <PlayListCard
            class="item"
            :item="item"
            :type="type.slice(0, -1)"
          ></PlayListCard>
        </li>
      </CoverRow>
    </div>
  </div>
  <p class="load-info font-size-12">
    {{ hasMore ? "正在加载" : "已加载全部" }}
  </p>
</template>
<script>
import { onMounted, onUnmounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { search } from "../../apis/others";
import { isScrollBottom } from "../../utils/common";

import TrackList from "../../components/trackList.vue";
import CoverRow from "../../components/coverRow.vue";
import PlayListCard from "../../components/playListCard.vue";

export default {
  name: "searchType",
  setup() {
    //   type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
    const typeList = {
      songs: 1,
      albums: 10,
      artists: 100,
      playlists: 1000,
      users: 1002,
      mvs: 1004,
      lyrics: 1006,
      djRadios: 1009,
      videos: 1014,
    };
    const route = useRoute();
    let typeCode = 1;
    let keywords = route.params.keyword;
    const data = reactive({
      resultList: [],
      hasMore: false,
      type: null,
    });
    data.type = route.params.type;

    // 检查type是否合法
    if (!typeList[data.type]) {
      typeCode = 1;
      data.type = "songs";
    } else {
      typeCode = typeList[data.type];
    }

    // 获取搜索结果
    const getResult = async (params) => {
      const res = await search(params);
      data.resultList = data.resultList.concat(res.result[data.type]);
      console.log(res.result);

      if (res.result[data.type].length < 30) {
        data.hasMore = false;
        document
          .getElementsByClassName("el-main")[0]
          .removeEventListener("scroll", loadMore);
      } else {
        data.hasMore = true;
      }
    };

    // 滚动加载
    const loadMore = () => {
      if (isScrollBottom()) {
        if (data.hasMore) {
          getResult({
            keywords,
            type: typeCode,
            limit: 30,
            offset: data.resultList.length,
          });
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
      keywords,
      type: typeCode,
      limit: 30,
      offset: 0,
    });
    return { ...toRefs(data) };
  },

  components: {
    TrackList,
    CoverRow,
    PlayListCard,
  },
};
</script>
<style lang="scss" scoped>
.videos,
.mvs {
  li {
    zoom: 0.83333;
  }
}
</style>
