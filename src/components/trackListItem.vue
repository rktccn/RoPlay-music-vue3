<template lang="">
  <div>
    <div class="cover">
      <img src="" alt="" />
    </div>
    <div class="description">
      <div class="title"></div>
      <div class="artist"></div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { ToplistOfMV } from "../apis/mv";

export default {
  setup() {
    const data = reactive({
      video: {},
    });

    ToplistOfMV().then((res) => {
      data.video = res.data[0];
    });

    return { ...toRefs(data) };
  },
};
</script>
<style lang=""></style>
