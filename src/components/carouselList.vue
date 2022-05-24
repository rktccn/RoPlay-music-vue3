<template>
  <section>
    <div class="container">
      <!-- {{ active }}
      {{ pageSize }}
      {{ itemLength }} -->
      <span
        class="material-icons-round font-size-24 btn-prev"
        @click="changePage('prev')"
        v-show="active !== 0"
      >
        chevron_left
      </span>
      <span
        class="material-icons-round font-size-24 btn-next"
        @click="changePage('next')"
        v-show="itemLength >= pageSize && !(itemLength <= active + pageSize)"
      >
        chevron_right
      </span>

      <div class="carousel" ref="carousel" :style="setRow()">
        <slot></slot>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  onBeforeUnmount,
  defineComponent,
} from "vue";

export default defineComponent({
  name: "carouselList",
  props: {
    length: {
      type: Number,
      required: true,
    },
    rows: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const carousel = ref(null);

    const data = reactive({
      pageSize: null,
      active: 0,
      itemLength: 1,
    });

    // 计算页面容量
    const calcPageSize = (carouselWidth: number) => {
      data.itemLength = Math.ceil(props.length / props.rows);

      let itemwidth = carousel.value.children[0].offsetWidth;
      let pageSize = Math.round(carouselWidth / itemwidth);

      if (pageSize - carouselWidth / itemwidth >= 0.05 && pageSize !== 1) {
        pageSize = pageSize - 1;
      }

      data.pageSize = pageSize;
    };

    const changePage = (direction: string) => {
      let slider = carousel.value;

      if (direction === "next") {
        slider.scrollLeft +=
          data.pageSize * carousel.value.children[0].offsetWidth;
      } else if (direction === "prev") {
        slider.scrollLeft -=
          data.pageSize * carousel.value.children[0].offsetWidth;
      }
    };

    // 设置控件显示
    const setActive = () => {
      let slider = carousel.value;
      // 左侧已显示内容数量
      carousel.value.children[0];
      let active = Math.ceil(
        slider.scrollLeft / carousel.value.children[0].offsetWidth
      );
      data.active = active;
    };

    const setRow = () => {
      let styles = { gridTemplateRows: null };
      styles.gridTemplateRows = `repeat(${props.rows}, 1fr)`;
      return styles;
    };

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        calcPageSize(cr.width);
      }
    });

    onMounted(() => {
      carousel.value.addEventListener("scroll", setActive);
      ro.observe(carousel.value);
    });

    onBeforeUnmount(() => {
      carousel.value.removeEventListener("scroll", setActive);
      ro.disconnect();
    });

    return { carousel, ...toRefs(data), changePage, setRow };
  },
});
</script>
<style lang="scss" scoped>
.container {
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }

  @mixin button-style() {
    position: absolute;
    top: 50%;
    padding: 8px;
    background-color: var(--background-color-primary);
    border-radius: 50px;
    box-shadow: 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%),
      0 2px 4px -1px rgb(0 0 0 / 40%);
    z-index: 10;
    cursor: pointer;
    user-select: none;
  }

  .btn-prev,
  .btn-next {
    @include button-style();

    @media screen and(max-width:$sm) {
      display: none;
    }
  }

  .btn-prev {
    left: 0;
    transform: translate(-50%, -80%);
  }

  .btn-next {
    right: 0;
    transform: translate(50%, -80%);
  }
}
.carousel {
  display: grid;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  overflow-y: hidden;

  grid-auto-flow: column;

  @media screen and(max-width:$sm) {
  }
}
</style>
