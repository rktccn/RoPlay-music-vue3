<template lang="">
  <div class="context-info">
    <div class="avatar">
      <img :src="getImgUrl()" alt="alt" />
    </div>
    <div class="gap"></div>
    <div class="info">
      <span class="type font-size-12">歌单</span>
      <h2 class="title font-size-26">{{ item.name }}</h2>
      <div class="describe">
        <p>
          {{ item.description }}
        </p>
      </div>
      <div class="control">
        <button class="play">
          <span class="material-icons-round">play_arrow</span>
          播放
        </button>
        <button class="like"></button>
        <button class="more"></button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
export default {
  name: "contextInfo",
  props: {
    item: { type: Object, required: true },
  },
  setup(props) {
    console.log(props.item);
    const data = reactive({
      imgUrl: null,
    });

    const getImgUrl = () => {
      let url = props.item?.coverImgUrl;

      return `${url}?param=960y960`;
    };

    const initData = () => {};

    initData;

    return { ...toRefs(data), getImgUrl };
  },
};
</script>
<style lang="scss" scoped>
.context-info {
  position: relative;
  width: 100%;
  display: flex;

  .avatar {
    overflow: hidden;
    width: 280px;
    align-items: center;
    line-height: 0;

    img {
      position: relative;
      top: 50%;
      transform: translateY(-50%);

      width: 100%;

      border-radius: $border-radius-default * 2;
    }
  }

  .gap {
    width: 34px;
  }

  .info {
    --gap: 12px;
    @media screen and(max-width:$md) {
      --gap: 8px;
    }

    flex: 1;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    padding: calc(var(--gap) * 3) 0;
    .type {
      width: auto;
      color: var(--text-color-secondary);
    }

    .title {
      padding-top: var(--gap);
      @include text-overflow(2);
    }

    .describe {
      padding-top: calc(var(--gap) * 2);
      white-space: pre-line;
      @include text-overflow(3);
      color: var(--text-color-secondary);
    }
    .control {
      padding-top: calc(var(--gap) * 2);
      // align-items: center;
    }
  }
}

@media screen and(max-width:$lg) {
  .context-info {
    .avatar {
      @include calc-width(3.5);
    }

    .gap {
      @include calc-width(0.5);
    }
    .info {
      @include calc-width(6);

      .describe {
        @include text-overflow(1);
      }
    }
  }
}

@media screen and(max-width:$sm) {
  .context-info {
    flex-direction: column;
    .avatar {
      @include calc-width(5);

      img {
        transform: translateY(0%);
      }
    }

    .info {
      padding-top: 0px;
      width: 100%;

      .type {
        position: absolute;
        top: 5%;
        right: 5%;

        padding: 4px 8px;
        border-radius: $border-radius-default;
        color: var(--text-color-primary-container);
        background-color: var(--primary-container-color);
      }

      .title {
        // transform: translateY(-100%);
      }

      .describe {
        display: none;
      }
    }
  }
}
</style>
