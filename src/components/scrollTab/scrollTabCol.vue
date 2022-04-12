<template>
  <div class="scroll-tab-col" :style="setStyle" :class="{ item: active }">
    <!-- // todo 空白页 -->
    <div v-if="!show && active"></div>
    <!-- // todo 具体的页面 -->
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  loading: Boolean,
  active: { type: Boolean, default: false }, // 是否启用
});
const clientWidth = document.documentElement.clientWidth
  ? document.documentElement.clientWidth
  : document.body.clientWidth;
const clientHeight = document.documentElement.clientHeight
  ? document.documentElement.clientHeight
  : document.body.clientHeight;

const setStyle = () => {
  if (!props.active) return {};
  return { width: clientWidth + "px", height: clientHeight + "px" };
};

//  控制显示 空白页，还是挂载
const show = ref(false);
// 根据 props.loading 控制挂载

const stop = watch(
  props,
  () => {
    if (props.loading) {
      show.value = true;
      setTimeout(() => {
        stop();
      });
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.item {
  flex: 1 1 0;
  height: 100%;
}
</style>
作者：随风君69221 链接：https://juejin.cn/post/7004818185731964941
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
