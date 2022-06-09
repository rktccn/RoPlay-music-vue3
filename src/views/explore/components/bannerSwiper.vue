<template>
  <div
      class="swiper"
      @mouseenter.stop="hover = true"
      @mouseleave.stop="hover = false"
      ref="swiper"
      :style="`background-image: url(${activeItem[1]?.imageUrl}?imageView&blur=40x20) `"
  >
    <div
        class="swiper-main"
        :style="setTransform"
        @mousewheel.stop="rollScroll($event)"
    >
      <li v-for="item in activeItem" class="swiper-main__item" id="swiperItem">
        <div
            class="banner-item"
        >
          <img class="pic" :src="`${item.imageUrl}?param=756y280`" alt=""/>
        </div>
      </li>
    </div>

    <div class="swiper-nav">
      <div
          class="swiper-nav__item"
          :class="{ active: currentIndex === item - 1 }"
          :style="{ width: `${hover ? '6px' : '3px'}` }"
          v-for="item in items.length"
          :key="item"
          @click="selectItem(item - 1)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  computed,
  watch,
} from "vue";
import {getBanner} from "../../../apis/others";

let HEIGHT: number;

export default defineComponent({
  setup() {
    const data = reactive({
      currentIndex: 0,
      activeItem: [],
      swiping: false,
      hover: false,
    });
    let direction = 1; // 1: next, -1: prev
    let items = ref([]);
    const swiper = ref(null);

    const setActiveItem = () => {
      const prevIndex =
          data.currentIndex - 1 < 0
              ? items.value.length - 1
              : data.currentIndex - 1;
      const nextIndex =
          data.currentIndex + 1 > items.value.length - 1
              ? 0
              : data.currentIndex + 1;

      data.activeItem = [
        items.value[prevIndex],
        items.value[data.currentIndex],
        items.value[nextIndex],
      ];
    };

    const setActiveIndex = (index: number) => {
      if (data.swiping) {
        return;
      }

      const itemCount = items.value.length;
      if (index < 0) {
        data.currentIndex = itemCount - 1;
      } else if (index >= itemCount) {
        data.currentIndex = 0;
      } else {
        data.currentIndex = index;
      }

      data.swiping = true;

      setTimeout(() => {
        setActiveItem();
        data.swiping = false;
      }, 300);
    };

    const prev = () => {
      direction = -1;
      setActiveIndex(data.currentIndex - 1);
    };

    const next = () => {
      direction = 1;
      setActiveIndex(data.currentIndex + 1);
    };

    const setTransform = computed(() => {
      let style = {
        transform: "translateY(0)",
        transition: "transform 0.3s ease",
      };

      let transform: number;
      let transition: number;

      if (swiper.value) {
        if (data.swiping && direction === 1) {
          transform = 2 * HEIGHT;
          transition = 0.3;
        } else if (data.swiping && direction === -1) {
          transform = 0;
          transition = 0.3;
        } else {
          transform = HEIGHT;
          transition = 0;
        }
      }

      style.transform = `translateY(-${transform}px)`;
      style.transition = ` transform ${transition}s ease`;

      return style;
    });

    const selectItem = (index: number) => {
      // setActiveIndex(index);
    };

    let autoScroll = setInterval(() => {
      next();
    }, 3000);

    function rollScroll(event) {
      // chrome、ie使用的wheelDelta，火狐使用detail

      event.preventDefault();
      event.stopPropagation();

      let scrollVal = event.wheelDelta || event.detail;
      scrollVal > 0 ? prev() : next();
    }

    getBanner().then((res: any) => {
      items.value = res.banners;
      setActiveItem();
    });

    onMounted(() => {
      HEIGHT = swiper.value.offsetHeight;
    });

    watch(
        () => data.hover,
        (val) => {
          if (val) {
            clearInterval(autoScroll);
          } else {
            autoScroll = setInterval(() => {
              next();
            }, 3000);
          }
        }
    );

    return {
      ...toRefs(data),
      items,
      swiper,
      setTransform,
      next,
      prev,
      rollScroll,
      selectItem,
    };
  },
});
</script>

<style lang="scss">
.swiper {
  position: relative;
  height: 100%;
  overflow: hidden;
  transition: all $transition-time-default ease;

  &-main {
    height: 100%;

    &__item {
      width: 100%;
      height: 100%;

      text-align: center;

      .banner-item {
        height: 100%;

        img {
          height: 100%;
          vertical-align: middle;
        }
      }
    }
  }

  &-nav {
    position: absolute;
    right: 5px;
    top: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    height: 100%;
    padding: 20px 0;

    opacity: 0.8;

    &__item {
      flex: 1 1 0;
      margin: 4px 0;
      height: 10px;

      border-radius: 3px;

      background-color: #fff;

      transition: all $transition-time-default ease;

      cursor: pointer;
    }

    .active {
      background-color: var(--main-color);
    }
  }
}
</style>
