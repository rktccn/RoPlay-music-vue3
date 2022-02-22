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
        v-show="itemLength !== active + pageSize && itemLength >= pageSize"
      >
        chevron_right
      </span>

      <div class="carousel" ref="carousel" :style="setRow()">
        <slot></slot>
      </div>
    </div>
  </section>
</template>
<script>
import { reactive, ref, toRefs, onMounted, watch, nextTick } from "vue";
import PlayListCard from "./playListCard.vue";

export default {
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
    const calcPageSize = () => {
      data.itemLength = Math.ceil(props.length / props.rows);

      let carouselWidth = carousel.value.offsetWidth;
      let itemwidth = carousel.value.children[0].offsetWidth;
      let pageSize = Math.round(carouselWidth / itemwidth);

      if (pageSize - carouselWidth / itemwidth >= 0.05 && pageSize !== 1) {
        pageSize = pageSize - 1;
      }

      data.pageSize = pageSize;
    };

    const changePage = (direction) => {
      let slider = carousel.value;
      let products = carousel.value.children[0];

      if (direction === "next") {
        slider.scrollLeft += data.pageSize * products.offsetWidth;
      } else if (direction === "prev") {
        slider.scrollLeft -= data.pageSize * products.offsetWidth;
      }
    };

    // 设置控件显示
    const setActive = () => {
      let slider = carousel.value;
      let products = carousel.value.children[0];
      // 左侧已显示内容数量
      let active = Math.ceil(slider.scrollLeft / products.offsetWidth);
      data.active = active;
    };

    const setRow = () => {
      let styles = { gridTemplateRows: null };
      styles.gridTemplateRows = `repeat(${props.rows}, 1fr)`;
      return styles;
    };

    onMounted(() => {
      calcPageSize();
      carousel.value.addEventListener("scroll", setActive);
      window.addEventListener("resize", () => calcPageSize(), false);
    });

    return { carousel, ...toRefs(data), changePage, setRow };
  },
  components: { PlayListCard },
};
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
    z-index: 99;
    cursor: pointer;
    user-select: none;
  }

  .btn-prev,
  .btn-next {
    @include button-style();

    @media screen and (max-width: $lg) {
      @include button-style();
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
  // grid-template-columns: 1fr;
}
</style>
