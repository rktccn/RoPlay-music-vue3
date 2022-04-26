<template lang="">
  <section class="section">
    <div class="text-style-title">关注</div>
  </section>
</template>
<script>
import {
  getFollowedArtistNewSongs,
  getFollowedArtistNewMvs,
} from "../../../apis/artist";

export default {
  name: "FeedFollow",
  setup() {
    // getFollowedArtistNewSongs().then((res) => {
    //   console.log(res);
    // });
  },
};
</script>
<style lang=""></style>
