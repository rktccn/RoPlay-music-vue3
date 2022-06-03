<template>
  <div class="room-artist">
    <div class="tab">
      <div class="type">
        <!-- 切换歌手类型控件 -->
        <div
            v-for="(type, index) in typeList"
            :key="index"
            @click="chageType(type.code)"
            :class="{ primary: type.code === curType }"
            class="tab-item text-style-title"
        >
          {{ type.name }}
        </div>
      </div>

      <div class="area">
        <!-- 切换歌手地区控件 -->
        <div
          v-for="(area, index) in areaList"
          :key="index"
          @click="chageArea(area.code)"
          :class="{ primary: area.code === curArea }"
          class="tab-item text-style-title"
        >
          {{ area.name }}
        </div>
      </div>
    </div>

    <CoverRow v-if="artistList">
      <li v-for="(artist, index) in artistList" :key="index">
        <PlayListCard :item="artist" type="artist"></PlayListCard>
      </li>
    </CoverRow>
    <p class="load-info font-size-12" @click="dododo">
      {{ hasMore ? "正在加载" : "已加载全部" }}
    </p>
  </div>
</template>
<script>
import {onMounted, onUnmounted, reactive, toRefs} from "vue";
import {getArtistList} from "../../apis/artist";
import {isScrollBottom} from "../../utils/common";

import PlayListCard from "../../components/playListCard.vue";
import CoverRow from "../../components/coverRow.vue";

export default {
  name: "RoomArtist",
  setup() {
    const data = reactive({
      artistList: null,
      // type : -1:全部 1:男歌手 2:女歌手 3:乐队
      typeList: [
        {
          name: "全部",
          code: -1,
        },
        {
          name: "男歌手",
          code: 1,
        },
        {
          name: "女歌手",
          code: 2,
        },
        {
          name: "乐队",
          code: 3,
        },
      ],
      // area : -1:全部 7:华语 96:欧美 8:日本 16:韩国 0:其他
      areaList: [
        {
          name: "全部",
          code: -1,
        },
        {
          name: "华语",
          code: 7,
        },
        {
          name: "欧美",
          code: 96,
        },
        {
          name: "日本",
          code: 8,
        },
        {
          name: "韩国",
          code: 16,
        },
        {
          name: "其他",
          code: 0,
        },
      ],
      curType: -1,
      curArea: -1,
      hasMore: true,
    });
    let loading = false;

    // 获取歌手列表
    const getData = async (params) => {
      loading = true;
      const res = await getArtistList(params);
      data.artistList = res.artists;
      loading = false;
    };

    let params = { type: 3, area: 7, limit: 50, offset: 0, initial: -1 };
    getData(params);

    // 滚动到底部加载
    const loadMore = () => {
      if (isScrollBottom()) {
        loading = true;
        getArtistList({
          offset: data.artistList.length,
          limit: 20,
          type: data.curType,
          area: data.curArea,
        }).then((res) => {
          data.artistList = data.artistList.concat(res.artists); // 拼接数组
          loading = false;
          if (res.artists.length < 20) {
            data.hasMore = false;
            document
              .getElementsByClassName("el-main")[0]
              .removeEventListener("scroll", loadMore);
          }
        });
      }
    };

    // 切换歌手类型时，传入code并重新加载
    const chageType = (code) => {
      data.curType = code;
      data.artistList = null;
      data.hasMore = true;
      loading = false;
      params = {
        type: data.curType,
        area: data.curArea,
        limit: 50,
        offset: 0,
        initial: -1,
      };
      getData(params);
    };

    // 切换歌手类型时，传入code并重新加载
    const chageArea = (code) => {
      data.curArea = code;
      data.artistList = null;
      data.hasMore = true;
      loading = false;
      params = {
        type: data.curType,
        area: data.curArea,
        limit: 50,
        offset: 0,
        initial: -1,
      };
      getData(params);
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

    return { ...toRefs(data), chageType, chageArea };
  },
  components: {
    PlayListCard,
    CoverRow,
  },
};
</script>
<style lang="scss" scoped>
.tab {
  .type,
  .area {
    display: flex;
    flex-wrap: wrap;
  }

  .tab-item {
    margin-right: 20px;
    margin-bottom: 16px;
    padding: 8px 26px;
    border-radius: $border-radius-default;
    background-color: var(--background-color-primary);
    cursor: pointer;
    transition: all $transition-time-default;

    @media (max-width: $sm) {
      margin-right: 10px;
      margin-bottom: 8px;
      padding: 4px 8px;
      font-size: 12px;
    }

    &:hover {
      background-color: var(--primary-container-color);
    }

    &.primary {
      background-color: var(--main-color);
    }
  }
}

.load-info {
  color: var(--text-color-secondary);
}
</style>
