<template lang="">
  <!-- 个人设置 -->
  <!-- 登陆/退出登陆 -->
  <div class="setting">
    <h4 class="setting__header text-style-title">个人设置</h4>
    <div class="setting__item">
      <span class="setting__item__title">账户: </span>
      <span class="setting__item__operate">
        <el-button class="setting__item__operate-btn" @click="handleLog()">
          {{ isLoggedIn ? "退出登陆" : "登陆" }}</el-button
        >
      </span>
    </div>
  </div>

  <!-- 其他设置 -->
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    const data = reactive({
      isLoggedIn: store.isLoggedIn !== -1,
    });
    console.log(data.isLoggedIn);
    console.log(store.isLoggedIn);

    const handleLog = () => {
      if (data.isLoggedIn) {
        store.logout();
        router.push("/");
      } else {
        router.push("/login");
      }
    };

    return {
      ...toRefs(data),
      handleLog,
    };
  },
});
</script>
<style lang="scss">
.setting {
  @include calc-width(5);
  margin: 0 auto;

  &__header {
    width: 100%;
    margin-bottom: 16px;
    box-shadow: 0 1px 0 0 var(--text-color-secondary);
  }

  &__item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__operate {
      &-btn {
        padding: 12px 24px;
        font-weight: 600;
      }
    }
  }
}
</style>
