<script setup>
import { ref, watch, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { useStore } from "../store/index";

let keyword = ref("");
let searchFocus = ref(false);
let sideNav = ref(false); // 侧边菜单显示
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const doSearch = () => {
  if (keyword.value === "") {
    ElNotification({
      title: "错误",
      message: "请输入搜索内容",
      position: "bottom-right",
      type: "error",
    });
    return;
  }
  let input = document.getElementsByName("searchBox")[0];
  searchFocus.value = false;
  input.blur();
  router.push(`/search/${keyword.value}`);
};

const toggleSideNav = () => {
  sideNav.value = !sideNav.value;
};

const goTo = (name) => {
  router.push({ name });
};

watch(
  () => route.params.keyword,
  () => {
    keyword.value = route.params.keyword;
  }
);
</script>

<template lang="">
  <div class="header">
    <div class="button">
      <span class="material-icons-round font-size-48 navigate"
        >navigate_before</span
      >
      <span class="material-icons-round font-size-48 navigate"
        >navigate_next</span
      >
      <span
        class="material-icons-round font-size-40 menu"
        @click="store.setOverlay(true)"
        >menu</span
      >
    </div>
    <div class="search" :class="{ active: searchFocus }">
      <div class="icon" @click="doSearch()">
        <span class="material-icons-round font-size-24">search</span>
      </div>
      <div class="search-box">
        <input
          type="text"
          name="searchBox"
          placeholder="搜索"
          @focus="searchFocus = true"
          @blur="searchFocus = false"
          @keydown.enter="doSearch()"
          v-model="keyword"
        />
      </div>
    </div>
    <div class="right">
      <router-link
        :to="{ name: 'Setting' }"
        class="material-icons-round font-size-36"
        v-if="store.isLoggedIn === -1"
      >
        account_circle</router-link
      >
      <router-link
        class="avator"
        :to="{ name: 'Setting' }"
        v-if="store.userInfo.avatarUrl"
      >
        <el-image
          lazy
          class="pic"
          :src="`${store.userInfo.avatarUrl}?param=128y128`"
          alt=""
        />
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;

  .button {
    flex: 1;
    text-align: left;

    display: flex;
    align-items: center;

    span {
      border-radius: 6px;
      height: 100%;
      transition: all $transition-time-default;

      cursor: pointer;
      &:hover {
        background-color: var(--hover-color);
      }
    }
    .menu {
      display: none;
    }

    @media screen and(max-width:$sm) {
      .navigate {
        display: none;
      }
      .menu {
        display: block;
      }
    }
  }

  .search {
    display: flex;
    align-items: center;
    flex: 3;

    text-align: left;

    height: 40px;
    padding: 0 10px;
    border-radius: 20px;

    background-color: var(--background-color-primary);

    .icon {
      margin-top: 3px;
      display: flex;
      align-items: center;
      user-select: none;
      cursor: pointer;
    }

    .search-box {
      margin: 0 6px;
      flex: 1;
      input {
        width: 100%;
      }
    }
    box-shadow: var(--main-color) 0 0 0 0px;
    transition: all $transition-time-default;
    &.active {
      box-shadow: var(--main-color) 0 0 0 2px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 2;

    height: 100%;

    .avator {
      display: flex;
      align-items: center;
      height: 100%;
      line-height: 0;

      .pic {
        height: 80%;
        border-radius: 50%;
      }
    }
  }
}
</style>
