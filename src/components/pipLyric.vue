<template lang="">
  <div class="pip-lyric">
    <canvas width="300" height="300" ref="lyric"></canvas>

    <div style="border: 1px dashed #ccc">
      <h2>视频</h2>
      <video
        id="video"
        width="300"
        height="300"
        controls
        autoplay
        ref="video"
      ></video>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, watch } from "vue";
export default {
  name: "PIPlyric",
  props: {
    currentLyric: { type: String, required: true },
    nextLyric: { type: String, required: true },
    color: { type: Object, required: true },
    // 开启画中画
    isPIP: { type: Boolean, required: true },
  },
  setup(props) {
    const lyric = ref(null);
    const video = ref(null);

    // 文本宽度超出canvas宽度时，截取文本
    const setLyrics = (str, ctx) => {
      const maxWidth = ctx.canvas.width - 60;
      let tempLine = "";
      const lines = [];
      const measures = [];

      // 文本宽度超出canvas宽度时，截取文本
      for (let i = 0; i < str.length; i++) {
        const word = str[i];
        const line = tempLine + word;
        const mea = ctx.measureText(line);
        const isSpace = /\s/.test(word);
        if (mea.width > maxWidth && tempLine && !isSpace) {
          lines.push(tempLine); // 将本行文本添加到数组
          tempLine = word; // 将下一个字符设置为新的一行
        } else {
          tempLine = line;
          if (!isSpace) {
          }
        }
      }
      if (tempLine !== "") {
        lines.push(tempLine);
      }
      return lines;
    };

    // 绘制歌词
    const drawLyrics = (str, ctx, top) => {
      for (let i = 0; i < str.length; i++) {
        if (top >= 250) return;
        const line = str[i];
        ctx.font =
          "bold 24px -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma, Simsun, sans-serif";
        ctx.fillText(line, 30, top);
        top += 30;
      }
      return top;
    };

    // const drawBackground = () => {};

    function draw(canvas, rotation = 0) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 设置背景
      ctx.fillStyle = props.color.main;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let top = 50;

      // 当前歌词
      ctx.fillStyle = "white";
      let lines = setLyrics(props.currentLyric, ctx);
      top = drawLyrics(lines, ctx, top) + 30;

      // 下一句歌词
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      lines = setLyrics(props.nextLyric, ctx);
      drawLyrics(lines, ctx, top);
    }

    // 录制视频
    function record(canvas, time, onstop) {
      const stream = canvas.captureStream();
      const recorder = new MediaRecorder(stream, {
        videoBitsPerSecond: 2500000,
        mimeType: "video/webm",
      });

      const data = [];
      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size) {
          data.push(event.data);
        }
      };

      recorder.onstop = () => {
        const url = URL.createObjectURL(
          new Blob(data, {
            type: "video/webm",
          })
        );

        onstop(url);
      };

      recorder.start();
      setTimeout(() => recorder.stop(), time);
    }

    onMounted(async () => {
      if (props.currentLyric) {
        draw(lyric.value);
        record(lyric.value, 100, (url) => {
          video.value.src = url;
        });
      }
    });

    watch(
      () => props.currentLyric,
      () => {
        draw(lyric.value);
        record(lyric.value, 100, (url) => {
          video.value.src = url;
        });
      }
    );

    watch(
      () => props.isPIP,
      async () => {
        if (props.isPIP) {
          try {
            await video.value.requestPictureInPicture();
          } catch (error) {}
        } else {
          document.exitPictureInPicture();
        }
      }
    );

    return { lyric, video };
  },
};
</script>
<style lang="scss" scoped>
.pip-lyric {
  display: none;
}
</style>
