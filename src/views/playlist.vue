<template lang="">
  <div class="playlist">
    <ContextInfo :item="item" v-if="item"></ContextInfo>
    <TrackList :tracks="item.tracks"></TrackList>
  </div>
</template>
<script>
import ContextInfo from "../components/contextInfo.vue";
import TrackList from "../components/trackListItem.vue";

import { getPlaylistDetail } from "../apis/playlist";
import { reactive, toRefs } from "vue";

export default {
  name: "playlist",
  setup() {
    const id = 5039004880;
    const data = reactive({
      item: null,
      tracks: null,
    });

    getPlaylistDetail(id).then((res) => {
      data.item = res.playlist;
      console.log(data.item);
    });

    return {
      ...toRefs(data),
    };
  },
  components: { ContextInfo, TrackList },
};
</script>
<style lang=""></style>
