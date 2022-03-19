<template lang="">
  <div class="playlist">
    <ContextInfo :item="item" v-if="item"></ContextInfo>
  </div>
</template>
<script>
import ContextInfo from "../components/contextInfo.vue";

import { getPlaylistDetail } from "../apis/playlist";
import { reactive, toRefs } from "vue";

export default {
  name: "playlist",
  setup() {
    // id 5039004880
    const id = 5039004880;
    const data = reactive({
      item: null,
      tracks: null,
    });

    getPlaylistDetail(id).then((res) => {
      data.item = res.playlist;
    });

    return {
      ...toRefs(data),
    };
  },
  components: { ContextInfo },
};
</script>
<style lang=""></style>
