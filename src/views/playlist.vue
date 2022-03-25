<template lang="">
  <div class="playlist" v-if="item">
    <ContextInfo class="playlist-info" :item="item"></ContextInfo>
    <TrackList class="playlist-list" :tracks="item.tracks"></TrackList>
  </div>
</template>
<script>
import ContextInfo from "../components/contextInfo.vue";
import TrackList from "../components/trackListItem.vue";

import { getPlaylistDetail } from "../apis/playlist";
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
export default {
  name: "playlist",
  props: {
    // id: { required: true, type: Number },
  },
  setup(props) {
    // if (!props.id) {
    //   throw "playlist页面需要输入id";
    // }
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const data = reactive({
      item: null,
      tracks: null,
    });

    getPlaylistDetail(id)
      .then((res) => {
        data.item = res.playlist;
      })
      .catch((err) => {
        console.log(err);
        ElMessageBox.alert("没有相关内容", "错误", {
          confirmButtonText: "返回主页",
          callback: () => {
            router.push({ name: "home" });
          },
        });
      });

    return {
      ...toRefs(data),
    };
  },
  components: { ContextInfo, TrackList },
};
</script>
<style lang="scss" scoped>
.playlist-list {
  margin-top: 72px;
  margin-bottom: 36px;

  @media screen and(max-width:$lg) {
    margin-top: 36px;
  }

  @media screen and(max-width:$lg) {
    margin: 0px;
  }
}
</style>
