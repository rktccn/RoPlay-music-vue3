<template>
  <div class='artist' :style='setStyle()'>
    <template v-for='(artist, j) in artistList' :key='j'>
      <router-link :to='`/artist/${artist.id}`'> {{ artist.name }}</router-link>
      <em v-if='artistList.length !== j + 1'>/</em>
    </template>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'artistFormat',
  props: {
    artistList: { type: Object, require: true },
    fontSize: { type: String, default: '12px' }
  },
  setup(props) {
    const setStyle = () => {
      return {
        fontSize: props.fontSize
      };
    };

    return { setStyle };
  }
});
</script>

<style lang='less' scoped>
// 歌手
.artist {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  a {
    color: inherit;
    opacity: 0.88;

    &:hover {
      opacity: 1;
    }
  }

  em {
    margin: 0 2px;
  }
}
</style>
