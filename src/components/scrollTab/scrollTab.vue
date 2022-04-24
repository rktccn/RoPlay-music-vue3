<template>
  <div class="scroll-tab">
    <div
      class="scroll-tab-item"
      :style="
        active
          ? {
              width: scrollWidth + 'px',
              transform: `translate(${contentBoxLeft}px, 0)`,
              transitionDuration: delay + 's',
            }
          : {}
      "
      ref="scrollTabItem"
      @touchstart="active ? handleTouchStart($event) : ''"
      @touchmove="active ? handleTouchMove($event) : ''"
      @touchend="active ? handleTouchEnd($event) : ''"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
export default {
  name: "scrollTab",
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
    active: {
      // 是否启用
      type: Boolean,
      default: false,
    },
  },
  emits: ["selectChange"],
  setup(props, { emit }) {
    const clientWidth = document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : document.body.clientWidth;
    const clientHeight = document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : document.body.clientHeight;

    const usetabIndex = (emit) => {
      let tabIndex = ref(0);
      watch(tabIndex, () => {
        emit("selectChange", tabIndex.value);
      });
      return tabIndex;
    };

    /**
     * @param tabIndex 当前显示的 page
     * @param contentBoxLeft 当前轮播的位置
     * @param clientWidth 页面的宽度
     * @param length 页面的数量
     * @param scrollWidth 轮播图总的宽度
     */
    const useMoveTouch = (
      tabIndex,
      contentBoxLeft,
      clientWidth,
      length,
      scrollWidth
    ) => {
      let moveOptions = reactive({
        direction: "", // ? 方向
        isStart: false, // ? 是否按下
        startPos: null, // ? 记录开始的位置
        endPos: null, // ? 记录结束的位置
      });
      const calcluateBoxLeft = (index) => {
        window.scrollTo(0, 0);
        return -(clientWidth * index);
      };
      const handleTouchStart = (e) => {
        moveOptions.isStart = true;
        moveOptions.startPos = e.touches[0];
        moveOptions.endPos = e.touches[0];
      };
      const handleTouchMove = (e) => {
        // ? 根据当前 e的位置，判断出是向 上下 还是 左右滑动
        let left = e.touches[0].clientX - moveOptions.endPos.clientX;
        let top = e.touches[0].clientY - moveOptions.endPos.clientY;
        if (moveOptions.isStart) {
          moveOptions.direction = Math.abs(left) > Math.abs(top) ? "X" : "Y";
        }
        moveOptions.endPos = e.touches[0];
        if (moveOptions.direction === "X") {
          e.preventDefault();
          // todo 左右移动
          // ? 1. 定义移动的 速率
          let coefficient = 1;
          if (
            contentBoxLeft.value >= 20 ||
            contentBoxLeft.value < -(scrollWidth.value - clientWidth + 20)
          ) {
            coefficient = 0;
          } else if (left >= 0 && tabIndex.value === 0) {
            coefficient = 0.3;
          } else if (left <= 0 && tabIndex.value === length.value - 1) {
            coefficient = 0.3;
          }
          contentBoxLeft.value += coefficient * left;
        }
      };
      const handleTouchEnd = (e) => {
        if (moveOptions.direction !== "X") return;
        // ? 1. 获取移动的距离
        const moveLen =
          moveOptions.endPos.clientX - moveOptions.startPos.clientX;
        if (moveLen > 80 && tabIndex.value !== 0) {
          tabIndex.value--;
        } else if (moveLen < -80 && tabIndex.value !== length.value - 1) {
          tabIndex.value++;
        }
        // ? 计算出偏移量
        contentBoxLeft.value = calcluateBoxLeft(tabIndex.value);
      };
      return {
        calcluateBoxLeft,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
      };
    };

    const scrollWidth = ref(0);
    const contentBoxLeft = ref(0);
    const delay = ref(0.3);
    const scrollTabItem = ref(null);
    let length = ref(0);
    let children = reactive([]);
    let tabIndex = usetabIndex(emit);

    const {
      calcluateBoxLeft,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    } = useMoveTouch(
      tabIndex,
      contentBoxLeft,
      clientWidth,
      length,
      scrollWidth
    );

    // 计算 scrollWidth
    const calculateScrollWidth = () => {
      children = scrollTabItem.value.children;
      length.value = children.length;
      scrollWidth.value = children.length * clientWidth;
    };

    watch(props, () => {
      contentBoxLeft.value = calcluateBoxLeft(props.tabIndex);
      tabIndex = props.tabIndex;
    });

    onMounted(() => {
      calculateScrollWidth();
    });

    return {
      clientWidth,
      clientHeight,
      children,
      length,
      scrollWidth,
      contentBoxLeft,
      delay,
      scrollTabItem,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    };
  },
};
</script>
<style lang="scss" scoped>
.scroll-tab {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.scroll-tab-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  height: 100%;
}
</style>
作者：随风君69221 链接：https://juejin.cn/post/7004818185731964941
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
