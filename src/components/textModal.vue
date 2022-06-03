<template>
  <div class="modal">
    <transition name="fade" mode="out-in">
      <div class="overlay" v-if="show"></div>
    </transition>

    <div class="block-outer" @click.self="closeMessage">
      <transition name="drop-up" mode="out-in">
        <div class="block" v-if="show">
          <h2 class="header">
            {{
              title
            }}<span class="material-icons-round" @click.self="closeMessage">
              close
            </span>
          </h2>
          <p class="text">
            {{ message }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";

export default defineComponent({
  name: "TextModal",
  props: {
    title: {type: String, required: true},
    message: {type: String, required: true},
    onClose: {
      type: Function, default: () => {
      }
    },
  },

  setup(props) {
    let show = ref(false);

    onMounted(() => {
      show.value = true;
    });

    const closeMessage = async () => {
      await new Promise((resolve) => {
        show.value = false;
        setTimeout(resolve, 300);
      });

      props.onClose();
    };

    return { show, closeMessage };
  },
});
</script>
<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
  backdrop-filter: saturate(160%) blur(20px) brightness(46%);
}

.block-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}
.block {
  width: 45vw;
  max-width: 800px;
  box-shadow: 0 2px 20px -5px var(--main-color);
  padding: 24px 0;

  .header {
    display: flex;
    justify-content: space-between;
    line-height: 1.4;
    padding: 0 34px;
  }

  .text {
    line-height: 1.6;
    margin-top: 16px;
    max-height: 45vh;
    overflow: scroll;
    white-space: pre-line;
    padding: 0 34px;
  }
}
</style>
