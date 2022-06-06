<script setup>
import "./styles/normalize.scss";


// import player from "./utils/player";
import SideNav from "./components/sideNav.vue";
import HeaderVue from "./views/header.vue";
import AudioControl from "./components/audioControl.vue";
import LyricPage from "./views/lyricPage.vue";

import {useRoute} from "vue-router";
import {useStore} from "./store/index";
import {usePlayer} from "./store/player";

const route = useRoute();
const store = useStore();

const player = usePlayer();
player.init();
store.init();

const clientWidth = document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : document.body.clientWidth;

const isSm = (width) => {
  return width <= 768;
};

const showHeader = () => {
  return !(route.meta.hideHeader && isSm(clientWidth));

};
</script>

<template>
  <el-container class="wrap">
    <el-aside width="220px" :class="{ active: store.getOverlay }">
      <SideNav></SideNav>
    </el-aside>
    <el-container>
      <el-header v-if="showHeader()">
        <HeaderVue></HeaderVue>
      </el-header>
      <el-main>
        <main class="main-inner">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component
                  :is="Component"
                  v-if="$route.meta.keepAlive"
                  :key="$route.path"
              />
            </keep-alive>
            <component
                :is="Component"
                v-if="!$route.meta.keepAlive"
                :key="$route.path"
            />
          </router-view>

          <AudioControl class="audio-control"></AudioControl>
          <div class="control-placeholder"></div>
        </main>
      </el-main>
    </el-container>
  </el-container>

  <transition name="slide-up" mode="out-in">
    <LyricPage v-if="store.showLyric"></LyricPage>
  </transition>

  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div
          v-if="store.getOverlay"
          class="overlay"
          @click="store.setOverlay(false)"
      ></div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>


@mixin display-center {
  padding: 0;
  width: var(--view-size);
  max-width: 1680px;
  margin: 0 auto;
  overflow: visible;
}

.wrap {
  height: 100vh;
  background-color: var(--background-color-secondary);
}

.el-header {
  background-color: var(--background-color-secondary);
  color: var(--text-color-primary);
  @include display-center;
}

.el-footer {
  @include display-center;
}

.el-aside {
  @media screen and (min-width: 2160px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-220px - 855px, -50%);
    height: 90%;
    border-radius: 25px;
    z-index: 30;
  }

  @media screen and (max-width: $sm) {
    position: absolute;
    left: -260px;
    height: 100vh;
    transition: all $transition-time-default;
    z-index: 30;

    &.active {
      left: 0;
    }
  }

  background-color: var(--background-color-primary);
  color: var(--text-color-primary);
}

.el-main {
  position: relative;
  background-color: var(--background-color-secondary);
  color: var(--text-color-primary);
  overflow-y: scroll;

  .main-inner {
    height: 100%;
    @include display-center;

    .audio-control {
      position: fixed;
      bottom: 20px;
    }

    .control-placeholder {
      height: 136px;
    }
  }
}

body > .el-container {
  margin-bottom: 40px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  background-color: rgba(33, 33, 33, 0.46);
}
</style>
