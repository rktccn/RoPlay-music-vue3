<script setup>
import "./styles/normalize.scss";

import SideNav from "./components/sideNav.vue";
import HeaderVue from "./views/header.vue";
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
        </main>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@mixin display-center {
  padding: 0;
  width: $view-size;
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
  color: var(--el-text-color-primary);
  @include display-center;
}

.el-footer {
  @include display-center;
}

.el-aside {
  background-color: var(--background-color-primary);
  color: var(--el-text-color-primary);
}

.el-main {
  background-color: var(--background-color-secondary);
  color: var(--el-text-color-primary);
  overflow-y: scroll;

  .main-inner {
    height: 100%;
    @include display-center;
  }
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
