import { defineStore } from "pinia";
import { Howl, Howler } from "howler";
import { ElNotification } from "element-plus";
import { getTrackDetail, getMP3 } from "../apis/track";

export const usePlayer = defineStore("player", {
  state: () => {
    return {
      _isPlaying: false,
      _progress: 0, // 当前播放进度
      _volume: 0.5, // 音量 0-1

      _currentTrack: null,

      _howler: null,
    };
  },
  getters: {},
  actions: {
    playOrPause() {
      this._isPlaying = !this._isPlaying;
      this._isPlaying ? this._howler.play() : this._howler.pause();
    },

    playSong(source) {
      Howler.unload();
      this._howler = new Howl({
        src: [source],
        html5: true,
        volume: this._volume,
        format: ["mp3", "flac"],
      });
      this._isPlaying = true;
      this._howler.play();
    },

    replaceCurrentTrack(id) {
      getTrackDetail(id).then((res) => {
        console.log(res);
        this._currentTrack = res.songs[0];
        getMP3(id).then((res2) => {
          if (res2.data[0].url) {
            this.playSong(res2.data[0].url);
          } else {
            ElNotification({
              title: "错误",
              message: "该歌曲暂时无法播放",
              position: "bottom-right",
              type: "error",
            });
          }
        });
      });
    },
  },
});
