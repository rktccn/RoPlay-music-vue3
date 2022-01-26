<script setup>
import { reactive } from "vue";
const list = reactive([
  {
    listName: "发现音乐",
    needLog: false,
    listItem: [
      { itemName: "推荐", path: "/recommend", needLog: true },
      { itemName: "探索", path: "/", needLog: false },
      {
        itemName: "视频",
        path: "/video",
        needLog: false,
      },
      { itemName: "电台", path: "/radio", needLog: false },
    ],
  },
  {
    listName: "我的音乐",
    needLog: false,
    listItem: [
      { itemName: "收藏", path: "/like", needLog: true },
      {
        itemName: "最近播放",
        path: "/recent",
        needLog: false,
      },
      { itemName: "云盘", path: "/cloud", needLog: true },
    ],
  },
  {
    listName: "我的歌单",
    needLog: true,
    listItem: [],
  },
]);
</script>

<template>
  <div class="side-nav">
    <span class="logo">Ro&nbsp;Play</span>
    <div class="list">
      <template v-for="(item, i) in list" :key="i">
        <ul v-if="item.needLog ? true : true">
          <span class="list-title white"> {{ item.listName }}</span>
          <template v-for="(value, j) in item.listItem" :key="j">
            <li class="list-item" v-if="value.needLog ? true : true">
              <router-link :to="value.path" class="item-link">
                {{ value.itemName }}
              </router-link>
            </li>
          </template>
        </ul>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-nav {
  display: flex;
  flex-direction: column;
  height: 100%;

  padding: 24px 35px;

  background-color: var(--background-color-primary);

  line-height: 1.5;
}

.logo {
  padding-left: 6px;

  margin: 10px 0 60px;
  font-size: 26px;
  font-weight: bolder;
}

.list {
  width: 100%;
  padding-left: 6px;

  ul {
    margin-bottom: 36px;
  }
  .list-title {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  .list-item {
    color: var(--el-text-color-primary);
    font-size: 16px;
    .item-link {
      display: block;
      width: 100%;
      height: 100%;
      padding: 3px 6px;
      margin: 6px 0;
      margin-left: -6px;
      border-radius: 6px;

      &:hover {
        background-color: var(--hover-color);
      }
    }

    .router-link-active {
      position: relative;
      background-color: var(--main-color) !important;
      color: #fff !important;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: -41px;
        width: 3px;
        height: 100%;
        background-color: var(--main-color);

        border-radius: 2px;
      }
    }
  }
}
</style>
