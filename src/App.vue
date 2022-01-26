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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@mixin display-center {
  padding: 0 calc(5vw + 20px);
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
}

.wrap {
  height: 100vh;
  background-color: var(--background-color-secondary);
}

.el-header {
  background-color: var(--background-color-secondary);
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 23px;
  @include display-center;
}

.el-footer {
  line-height: 23px;
  @include display-center;
}

.el-aside {
  background-color: var(--background-color-primary);
  color: var(--el-text-color-primary);
}

.el-main {
  background-color: var(--background-color-secondary);
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 23px;

  @include display-center;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
