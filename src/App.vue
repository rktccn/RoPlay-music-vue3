<script setup>
import "./styles/normalize.scss";

// import player from "./utils/player";

import SideNav from "./components/sideNav.vue";
import HeaderVue from "./views/header.vue";
import AudioControl from "./components/audioControl.vue";
</script>

<template>
  <el-container class="wrap">
    <el-aside width="220px">
      <SideNav></SideNav>
    </el-aside>
    <el-container>
      <el-header>
        <HeaderVue></HeaderVue>
      </el-header>
      <el-main>
        <main class="main-inner">
          <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
            <keep-alive :max="10">
              <component :is="Component" />
            </keep-alive>
          </router-view>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
          <AudioControl class="audio-control"></AudioControl>
          <div class="control-placeholder"></div>
        </main>
      </el-main>
    </el-container>
  </el-container>
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
    z-index: 999;
  }

  @media screen and (max-width: $sm) {
    display: none;
  }

  background-color: var(--background-color-primary);
  color: var(--text-color-primary);
}

.el-main {
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
      height: 120px;
    }
  }
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
