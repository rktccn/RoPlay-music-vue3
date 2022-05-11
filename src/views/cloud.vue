<template lang="">
  <div>
    <!-- <TrackList></TrackList> -->
  </div>
</template>
<script>
import { reactive } from "vue-demi";
import { getCloud } from "../apis/cloud";

import TrackList from "../components/trackList.vue";

export default {
  name: "Cloud",
  setup() {
    const data = reactive({
      trackList: [],
    });

    getCloud().then((res) => {
      console.log(res);
      data.trackList = res.data;
    });
  },
  components() {
    TrackList;
  },
};
</script>
<style lang=""></style>
