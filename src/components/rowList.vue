<template>
  <section>
    <div class="container">
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
        v-show="active !== length - pageSize"
      >
        chevron_right
      </span>

      <div class="row" ref="row">
        <slot></slot>
      </div>
    </div>
  </section>
</template>
<script>
import { topPlaylist } from "../apis/playlist";
import { reactive, ref, toRefs, onMounted } from "vue";
import PlayListCard from "./playListCard.vue";

export default {
  props: {
    length: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const row = ref(null);

    const data = reactive({
      pageSize: null,
      active: 0,
    });

    let calcPageSize = () => {
      let rowWidth = row.value.offsetWidth;
      let itemwidth = row.value.childNodes[2].offsetWidth;
      let pageSize = Math.round(rowWidth / itemwidth);
      data.pageSize = pageSize;
    };

    let changePage = (direction) => {
      let slider = row.value;
      let products = row.value.childNodes[2];

      if (direction === "next") {
        slider.scrollLeft += data.pageSize * products.offsetWidth;
      } else if (direction === "prev") {
        slider.scrollLeft -= data.pageSize * products.offsetWidth;
      }
    };

    let setActive = () => {
      let slider = row.value;
      let products = row.value.childNodes[2];

      let active = Math.round(slider.scrollLeft / products.offsetWidth);

      data.active = active;
      console.log(props.length - data.pageSize);
    };

    onMounted(() => {
      calcPageSize();
      row.value.addEventListener("scroll", setActive);
      window.onresize = () => {
        calcPageSize();
      };
    });

    return { row, ...toRefs(data), changePage };
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

  @mixin button-style($rate) {
    position: absolute;
    top: calc(($rate * $grid-default) / 2);
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
    @include button-style(2);

    @media screen and (max-width: $lg) {
      @include button-style(2.5);
    }
  }

  .btn-prev {
    left: 0;
    transform: translate(-50%, -50%);
  }

  .btn-next {
    right: 0;
    transform: translate(50%, -50%);
  }
}
.row {
  display: flex;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  overflow-y: hidden;
}
</style>
