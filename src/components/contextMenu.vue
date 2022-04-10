<template lang="">
  <div class="context-menu" ref="contextMenu">
    <div class="inner block">
      <ul>
        <li @click="playSong">
          <span class="material-icons-round"> play_arrow </span>播放
        </li>
        <li>
          <span class="material-icons-round font-size-20"> redo </span
          >下一首播放
        </li>
        <li @click="removeSong">
          <span class="material-icons-round"
            >{{ isInList ? "playlist_remove" : "playlist_play" }} </span
          >{{ isInList ? "从播放列表移除" : "添加到播放列表" }}
        </li>
      </ul>
      <span class="gap"></span>
      <ul>
        <li>
          <span class="material-icons-round font-size-20"> favorite_border</span
          >收藏
        </li>
        <li><span class="material-icons-round"> playlist_add </span>添加到</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from "vue";

export default {
  name: "ContextMenu",
  props: {
    onClose: { type: Function, required: true },
    mousePosition: { type: Object, required: true },
    id: { type: Number, required: true },
    player: { type: Object, required: true },
  },
  setup(props) {
    const data = reactive({
      isInList: false, // 是否在播放列表中
    });

    const contextMenu = ref(null);
    let menuTop = null,
      menuLeft = null;

    // 播放音乐
    const playSong = () => {
      props.player.replaceCurrentTrack(props.id);
      props.onClose();
    };

    // 通过id检查是否在播放列表中
    const checkIsInList = async () => {
      const res = props.player.checkInTrackList(props.id);
      data.isInList = res;
    };

    // 移除/添加歌曲
    const removeSong = () => {
      if (data.isInList) {
        props.player.removeTrack(props.id);
      } else {
        props.player.addTrack(props.id);
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
    const handleClick = (e) => {
      if (!contextMenu.value.contains(e.target)) {
        document.onmousedown = null;
        props.onClose();
      }
    };

    // 设置菜单位置
    onMounted(() => {
      getPos();
      contextMenu.value.style.top = menuTop;
      contextMenu.value.style.left = menuLeft;
      document.onmousedown = handleClick;
      checkIsInList();
    });

    onUnmounted(() => {
      document.onmousedown = null;
    });

    return {
      ...toRefs(data),
      contextMenu,
      playSong,
      removeSong,
    };
  },
};
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