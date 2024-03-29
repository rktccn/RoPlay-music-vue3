<script>
import { reactive, toRefs } from "vue";
import { getBanner } from "../../../apis/others.js";
import BannerSwiper from "./bannerSwiper.vue";

export default {
  name: "exploreBanner",
  setup() {
    const data = reactive({
      bannerHeight: "280px",
      bannerList: null,
      category: [
        {
          name: "歌手",
          path: "/room/artist",
          iconName: "person",
        },
        {
          name: "排行",
          path: "/room/top",
          iconName: "bar_chart",
        },
        {
          name: "歌单",
          path: "/room/playlist",
          iconName: "queue_music",
        },
        {
          name: "电台",
          path: "/",
          iconName: "radio",
        },
      ],
    });
    getBanner().then((res) => {
      data.bannerList = res.banners;
    });
    return { ...toRefs(data) };
  },
  components: { BannerSwiper },
};
</script>

<template>
  <!-- banner -->
  <!-- |--- 分类(歌手 排行 歌单 电台) -->
  <section class="section-focus">
    <div class="banner" id="banner-main">
      <BannerSwiper></BannerSwiper>
    </div>
    <div class="category">
      <div
        class="category-inner"
        v-for="(item, index) in category"
        :key="index"
      >
        <router-link :to="item.path">
          <span class="category-item">
            <svg-icon
              class="category-icon"
              :name="`round-${item.iconName}`"
              :size="48"
              color="currentColor"
            />

            <em>{{ item.name }}</em>
          </span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-focus {
  display: flex;
  margin-top: 8px;

  @media screen and (max-width: $lg) {
    display: block;
  }

  .banner {
    flex: 1;
    border-radius: $border-radius-default;
    overflow: hidden;
    height: 280px;

    @media screen and(max-width:1440px) {
      height: 230px;
    }
  }

  .category {
    display: grid;

    @mixin grid-size($gap) {
      grid-template-columns: ($gap * 6.5) ($gap * 6.5);
      grid-gap: $gap;
      margin-left: $gap;
    }

    @media screen and (min-width: $lg) {
      @include grid-size($gap: 16.5px);
    }
    @media screen and (min-width: 1440px) {
      @include grid-size($gap: 20px);
    }

    @media screen and (max-width: $lg) {
      max-width: 580px;
      $gap: 3%;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: $gap;
      margin-top: $gap;
    }

    .category-inner {
      position: relative;
      width: 100%;
      padding-top: 100%;
      background-color: var(--background-color-primary);
      border-radius: $border-radius-default;
      transition: all $transition-time-default;

      &:hover {
        background-color: var(--main-color);

        em,
        .category-icon {
          color: #fff;
          fill: #fff;
        }
      }
    }

    .category-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      border-radius: $border-radius-default;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      transition: all $transition-time-default;

      @media screen and (max-width: $md) {
        transform: scale(0.9);
      }

      em,
      .category-icon {
        transform: translateY(3px);
        transition: all $transition-time-default;
      }
    }
  }
}
</style>
