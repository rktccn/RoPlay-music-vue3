<script>
import { reactive, toRefs } from "vue";
import { getBanner } from "../../../apis/others.js";

export default {
  setup() {
    const data = reactive({
      bannerList: null,
      category: [
        {
          name: "歌手",
          path: "/",
          iconName: "person",
        },
        {
          name: "排行",
          path: "/",
          iconName: "bar_chart",
        },
        {
          name: "歌单",
          path: "/",
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
      console.log(res);
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
        <template v-for="(item, index) in category" :key="index">
          <span class="category-item">
            <span class="category-icon material-icons-round font-size-48"> {{ item.iconName }} </span>
            <em>{{ item.name }}</em>
          </span>
        </template>
      </div>
    </section>
   
  </div>
</template>

<style lang="scss" scoped>
$gap: null;
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

    @mixin grid-size {
      grid-template-columns: ($gap * 6.5) ($gap * 6.5);
      grid-gap: $gap;
      margin-left: $gap;
    }

    @media screen and (min-width: $lg) {
      $gap: 16.5px !global;
      @include grid-size;
    }
    @media screen and (min-width: 1440px) {
      $gap: 20px !global;
      @include grid-size;
    }

    @media screen and (max-width: $lg) {
      $gap: 20px !global;
      grid-template-columns: repeat(4, ($gap * 6.5));
      grid-gap: $gap;
      height: $gap * 6.5;
      margin-top: $gap;

      // overflow-x: scroll;
    }

    .category-item {
      background-color: var(--background-color-primary);
      border-radius: $border-radius-default;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      transition: all 0.15s;

      em,
      .category-icon {
        transform: translateY(3px);
        transition: all 0.15s;
      }

      &:hover {
        background-color: var(--main-color);

        em,
        .category-icon {
          color: #fff;
        }
      }
    }
  }
}
</style>
