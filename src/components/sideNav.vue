<script setup>
import { reactive, watch } from "vue";
import { useStore } from "../store";

const store = useStore();
let playlistItem = reactive({
  listName: "我的歌单",
  needLog: true,
  listItem: [],
});
// 如果登陆，则传入四个歌单到歌单列表
const getList = () => {
  if (store.isLoggedIn !== -1) {
    for (let i = 0; i < 4; i++) {
      const item = store.userPlaylist[i];
      if (!item) return;
      playlistItem.listItem.push(item);
    }
  }
};

watch(
  () => store.userPlaylist,
  () => {
    playlistItem.listItem = [];
    getList();
  }
);

const list = reactive([
  {
    listName: "发现音乐",
    needLog: false,
    listItem: [
      { itemName: "推荐", path: "/feed", icon: "home", needLog: true },
      { itemName: "探索", path: "/", icon: "home", needLog: false },
      {
        itemName: "视频",
        path: "/video",
        icon: "home",
        needLog: false,
      },
      { itemName: "电台", path: "/radio", icon: "home", needLog: false },
    ],
  },
  {
    listName: "我的音乐",
    needLog: false,
    listItem: [
      { itemName: "收藏", path: "/like", icon: "home", needLog: true },
      {
        itemName: "最近播放",
        path: "/recent",
        icon: "home",
        needLog: false,
      },
      { itemName: "云盘", path: "/cloud", icon: "home", needLog: true },
    ],
  },
]);
</script>

<template>
  <div class="side-nav">
    <span class="logo">Ro&nbsp;Play</span>
    <div class="list">
      <template v-for="(item, index) in list" :key="index">
        <ul v-if="item.needLog ? true : true">
          <ol class="list-title white">
            {{
              item.listName
            }}
          </ol>
          <template v-for="(value, j) in item.listItem" :key="j">
            <li
              class="list-item"
              v-if="value.needLog ? true : true"
              @click="store.setOverlay(false)"
            >
              <router-link :to="value.path" class="item-link">
                <span class="material-icons-round" v-if="value.icon !== ''">
                  {{ value.icon }}
                </span>
                <div class="text-truncate">
                  {{ value.itemName }}
                </div>
              </router-link>
            </li>
          </template>
        </ul>
      </template>
      <ul v-if="playlistItem.needLog">
        <ol class="list-title white">
          {{
            playlistItem.listName
          }}
        </ol>
        <li
          class="list-item"
          @click="store.setOverlay(false)"
          v-for="(playlist, i) in playlistItem.listItem"
          :key="i"
        >
          <router-link :to="`/playlist/${playlist.id}`" class="item-link">
            <div class="text-truncate">
              {{ playlist.name }}
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes flood-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
.side-nav {
  display: flex;
  flex-direction: column;
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
      position: relative;
      display: flex;
      align-items: center;

      overflow: hidden;
      width: 100%;
      height: 100%;
      padding: 3px 6px;
      margin: 6px 0;
      margin-left: -6px;
      border-radius: 6px;

      span {
        margin-right: 8px;
      }

      &::after {
        content: "";
        position: absolute;
        left: -100%;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--main-color);
        opacity: 0.12;
        border-radius: 0 25px 25px 0;
        transition: left $transition-time-default ease-in-out;
      }

      &:hover {
        // background-color: var(--hover-color);
        &::after {
          left: 0;
        }
      }
    }

    .router-link-active {
      position: relative;
      background-color: var(--main-color) !important;
      color: #fff !important;

      span {
        color: #fff !important;
      }

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
