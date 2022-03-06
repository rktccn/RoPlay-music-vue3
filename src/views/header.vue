<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";

let keyword = ref("");

const router = useRouter();
const route = useRoute();

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

  router.push(`/search/${keyword.value}`);
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
      <span class="material-icons-round font-size-48">navigate_before</span>
      <span class="material-icons-round font-size-48">navigate_next</span>
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
    <div class="right">{{ keyword }}</div>
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
    flex: 2;
    text-align: right;
  }
}
</style>
