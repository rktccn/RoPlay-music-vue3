<script setup>
import { ref } from "vue";

let searchFocus = ref(false);
</script>

<template lang="">
  <div class="header">
    <div class="button">
      <span class="material-icons-round font-size-48">navigate_before</span>
      <span class="material-icons-round font-size-48">navigate_next</span>
    </div>
    <div class="search" :class="{ active: searchFocus }">
      <div class="icon">
        <span class="material-icons-round font-size-24">search</span>
      </div>
      <div class="search-box">
        <input
          type="text"
          name="searchBox"
          placeholder="搜索"
          @focus="searchFocus = true"
          @blur="searchFocus = false"
        />
      </div>
    </div>
    <div class="right">{{ searchFocus }}</div>
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
      transition: all 0.15s;

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
    }

    .search-box {
      margin: 0 6px;
      flex: 1;
      input {
        width: 100%;
      }
    }
    box-shadow: var(--main-color) 0 0 0 0px;
    transition: all 0.15s;
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
