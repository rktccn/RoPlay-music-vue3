<template>
  <div class="album" ref="trackList">
    <ContextInfo
        class="album-info"
        :item="item"
        v-if="item"
        v-loading="item === null"
        :type="'album'"
    ></ContextInfo>
    <TrackList
        class="album-list"
      :tracks="tracks"
      v-if="tracks"
      type="album"
      scrollerSelector=".el-main"
    >
    </TrackList>
    <span class="company font-size-12" v-if="item?.company">{{
      item.company
    }}</span>
  </div>
</template>
<script>
import ContextInfo from "../components/contextInfo.vue";
import TrackList from "../components/trackList.vue";

import {getAlbum} from "../apis/album";

import {reactive, ref, toRefs} from "vue";
import {useRoute} from "vue-router";

export default {
  name: "playlist",
  props: {},
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const trackList = ref(null);

    const data = reactive({
      item: null,
      tracks: null,
      trackCount: null,
    });

    const getData = async () => {
      await getAlbum(id).then((res) => {
        data.tracks = res.songs;
        data.item = res.album;
      });
    };

    getData();

    return {
      ...toRefs(data),
      trackList,
    };
  },
  components: { ContextInfo, TrackList },
};
</script>
<style lang="scss" scoped>
.album-list {
  margin-top: 48px;
  margin-bottom: 24px;

  @media screen and(max-width:$lg) {
    margin-top: 36px;
  }

  @media screen and(max-width:$lg) {
    margin: 0;
  }
}

.company {
  color: var(--text-color-secondary);
  // display: inline-block;
  // margin-bottom: 12px;
}
</style>
