<script>
import { reactive, toRefs } from "vue";
import { getBanner } from "../../../apis/others.js";

export default {
  name: "exploreBanner",
  setup() {
    const data = reactive({
      bannerList: null,
      category: [
        {
          name: "歌手",
          path: "/room/artist",
          iconName: "person",
        },
        {
          name: "排行",
          path: "/",
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
};
</script>

<template lang="">
  <div class="feed">
    <!-- banner -->
    <!-- |--- 分类(歌手 排行 歌单 电台) -->
    <section class="section-focus">
      <div class="banner">
        <el-carousel height="280px" direction="vertical" :autoplay="true">
          <el-carousel-item v-for="(item, index) in bannerList" :key="index">
            <div
              class="banner-item"
              :style="`background-image: url(${item.imageUrl}?imageView&blur=40x20) `"
            >
              <div
                :style="`background-image: url(${item.imageUrl}?param=756y280) `"
              ></div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="category">
        <div
          class="category-inner"
          v-for="(item, index) in category"
          :key="index"
        >
          <router-link :to="item.path">
            <span class="category-item">
              <span class="category-icon material-icons-round font-size-48">
                {{ item.iconName }}
              </span>
              <em>{{ item.name }}</em>
            </span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.section-focus {
  display: flex;
  margin-top: 8px;

  @media (max-width: $lg) {
    flex-direction: column;
  }

  .banner {
    flex: 1;
    border-radius: $border-radius-default;
    overflow: hidden;
    .el-carousel {
      .banner-item {
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        div {
          height: 100%;
          width: 100%;

          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
      }

      @media screen and (max-width: 1440px) {
        height: 230px;

        .banner-item {
          height: 230px;
          width: 100%;
          div {
            height: 230px;
            width: 100%;
          }
        }
      }
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
