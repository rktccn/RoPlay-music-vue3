<template>
  <div class="context-menu" ref="contextMenu" id="contextMenu">
    <div class="inner block">
      <ul>
        <li @click="playSong">
          <svg-icon :name="`round-play_arrow`" :size="24" color="#454f63" />

          播放
        </li>
        <li>
          <svg-icon :name="`round-redo`" :size="20" color="#454f63" />
          下一首播放
        </li>
        <li @click="removeSong">
          <svg-icon
            :name="`round-${isInList ? 'playlist_remove' : 'playlist_play'}`"
            :size="24"
            color="#454f63"
          />

          {{ isInList ? "从播放列表移除" : "添加到播放列表" }}
        </li>
      </ul>
      <span class="gap"></span>
      <ul>
        <li>
          <svg-icon
            :name="`round-favorite_border`"
            :size="20"
            color="#454f63"
          />
          收藏
        </li>
        <li>
          <svg-icon :name="`round-playlist_add`" :size="24" color="#454f63" />

          添加到
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";

export default defineComponent({
  name: "ContextMenu",
  props: {
    onClose: { type: Function, required: true },
    mousePosition: { type: Object, required: true },
    id: { type: Number, required: true },
    player: { type: Object, required: true },
  },
  setup(props) {
    const player: any = props.player;
    const data = reactive({
      isInList: false, // 是否在播放列表中
    });

    const contextMenu = ref(null);
    let menuTop = null,
      menuLeft = null;

    // 播放音乐
    const playSong = () => {
      player.replaceCurrentTrack(props.id);
      props.onClose();
    };

    // 通过id检查是否在播放列表中
    const checkIsInList = async () => {
      data.isInList = player.checkInTrackList(props.id);
    };

    // 移除/添加歌曲
    const removeSong = () => {
      if (data.isInList) {
        player.removeTrack(props.id);
      } else {
        player.addTrack(props.id);
      }
      props.onClose();
    };

    // 获取位置
    const getPos = () => {
      let top = props.mousePosition.clientY;
      let left = props.mousePosition.clientX;

      let largestHeight =
        window.innerHeight - contextMenu.value.offsetHeight - 5;
      let largestWidth = window.innerWidth - contextMenu.value.offsetWidth - 25;
      if (top > largestHeight) top = largestHeight;
      if (left > largestWidth) left = largestWidth;
      menuTop = top + "px";
      menuLeft = left + "px";
    };

    // 点击外部事件关闭
    const handleClick = (e: any) => {
      if (!contextMenu.value.contains(e.target)) {
        document.removeEventListener("mousedown", handleClick);
        props.onClose();
      }
    };

    // 设置菜单位置
    onMounted(() => {
      getPos();
      contextMenu.value.style.top = menuTop;
      contextMenu.value.style.left = menuLeft;
      document.addEventListener("mousedown", handleClick);
      checkIsInList();
    });

    onUnmounted(() => {
      document.removeEventListener("mousedown", handleClick);
    });

    return {
      ...toRefs(data),
      contextMenu,
      playSong,
      removeSong,
    };
  },
});
</script>
<style lang="scss" scoped>
.context-menu {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: $border-radius-default;
  @include shadow();
  z-index: 10;

  .inner {
    position: relative;
    width: 250px;
    box-shadow: 0 0 0 1px hsl(210, 26%, 87%);
  }

  ul {
    li {
      display: flex;
      padding: 4px 0;
      height: 32px;
      align-items: center;
      border-radius: $border-radius-default;

      span {
        margin-right: 6px;
      }

      &:hover {
        background-color: var(--background-color-secondary);
        cursor: pointer;
      }
    }
  }

  .gap {
    display: block;
    width: 100%;
    height: 1px;
    background-color: var(--background-color-secondary);
    margin: 8px 0;
  }
}
</style>
