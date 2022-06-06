<template>
  <svg aria-hidden="true"
       class="svg-icon"
       :style="{
    width:`${size}px`,
    height:`${size}px`,
  }"
  >
    <use :xlink:href="symbolId" :fill="color"/>
  </svg>
</template>

<script>
import {defineComponent, computed} from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    size: {
      type: Number,
      default: 24
    },
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    const size = computed(() => props.size)
    return {symbolId, size}
  },
})
</script>
<style lang="scss" scoped>
.svg-icon {
  cursor: pointer;
  vertical-align: middle;
}
</style>