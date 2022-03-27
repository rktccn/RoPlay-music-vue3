<template>
  <div class="artist" :style="setStyle()">
    <template v-for="(artist, j) in artistList" :key="j">
      <a :href="'https://music.163.com/#/artist?id=' + artist.id">{{
        artist.name
      }}</a
      ><em v-if="artistList.length !== j + 1">/</em>
    </template>
  </div>
</template>

<script>
export default {
  name: "artistFormat",
  props: {
    artistList: { type: Object, require: true },
    fontSize: { type: String, default: "12px" },
    discribeInfo: { type: String, default: null },
  },
  setup(props) {
    const setStyle = () => {
      let styles = {
        fontSize: props.fontSize,
      };
      return styles;
    };

    return { setStyle };
  },
};
</script>

<style lang="less" scoped>
// 歌手
.artist {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  a {
    // color: var(--text-color-secondary);
    color: inherit;
    opacity: 0.88;

    &:hover {
      color: var(--main-color);
    }
  }
  em {
    margin: 0px 2px;
  }
}
</style>
