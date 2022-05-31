import { defineStore } from "pinia";
import { Howl, Howler } from "howler";
import { ElNotification } from "element-plus";
import { getTrackDetail, getMP3, scrobble } from "../apis/track";
import { getPlaylistDetail } from "../apis/playlist";
import { getAlbum } from "../apis/album";
import { timeFormat } from "../utils/common";
import { getArtist } from "../apis/artist";
import { personalFM } from "../apis/personalized";

export const usePlayer = defineStore("player", {
  state: () => {
    return {
      // 播放信息
      isPlaying: false,
      progress: 0, // 当前播放进度
      volume: 0.5, // 音量 0-1

      // 播放模式
      playMode: 0, // 0: 循环 1: 单曲 2: 随机
      randomList: [], // 随机播放列表
      randomIndex: 0, // 随机播放索引

      // 歌曲信息
      currentTrack: null,
      trackList: [386538, 528272281],
      currentIndex: 0, // 当前歌曲在列表中的index
      deleteTrackIndex: -1, // 从播放列表中删除的歌曲index

      // 私人FM
      isPersonalFM: false, // 是否是私人FM
      personalFMCurrent: {}, // 当前歌曲信息
      personalFMNext: [], // 会储存三首未播放的歌曲，如果为空则加载新推荐

      // 个人信息
      likedSongIDs: [], // 喜欢的歌曲id

      howler: null,
    };
  },
  getters: {
    getCurrentDuration() {
      return timeFormat(this.currentTrack?.dt) || "00:00";
    },

    getProgress() {
      return this.progress;
    },

    getVolume() {
      return this.volume;
    },

    // 获取播放模式
    getPlayMode() {
      switch (this.playMode) {
        case 0:
          return "loop";
        case 1:
          return "loop_one";
        case 2:
          return "random";
        default:
          return "loop";
      }
    },
  },

  actions: {
    init() {
      this.isPersonalFM = false;
      if (this.currentIndex > this.trackList.length) {
        this.currentIndex = 0;
      }
      if (!this.trackList || this.trackList.length === 0) return;
      this.replaceCurrentTrack(
        this.trackList[this.currentIndex],
        false,
        this.progress,
        false
      );
    },

    // 播放
    songPlay() {
      this.isPlaying = true;
      this.howler.play();
    },

    // 暂停
    songPause() {
      this.isPlaying = false;
      this.howler.pause();
    },

    playOrPause() {
      if (!this.trackList || this.trackList.length === 0) return;
      this.isPlaying = !this.isPlaying;
      this.isPlaying ? this.songPlay() : this.songPause();
    },

    // 上一首
    playPrev() {
      if (this.isPersonalFM) return;

      if (this.playMode === 2) {
        if (!this.randomList || this.randomList.length === 0) return;
        this.randomIndex === 0
          ? (this.randomIndex = this.randomList.length - 1)
          : this.randomIndex--;

        this.replaceCurrentTrack(this.randomList[this.randomIndex]);

        return;
      } else if (this.playMode === 1) {
        this.howler.seek(0);
        this.songPlay();
        return;
      } else {
        if (!this.trackList || this.trackList.length === 0) return;
        this.currentIndex === 0
          ? (this.currentIndex = this.trackList.length - 1)
          : this.currentIndex--;

        this.replaceCurrentTrack(this.randomList[this.randomIndex]);
      }
    },

    // 下一首
    playNext() {
      if (this.playMode === 2) {
        if (!this.randomList || this.randomList.length === 0) return;
        this.randomIndex === this.randomList.length - 1
          ? (this.randomIndex = 0)
          : this.randomIndex++;

        this.replaceCurrentTrack(
          this.randomList[this.randomIndex],
          true,
          -1,
          false
        );
        return;
      } else if (this.playMode === 1) {
        this.howler.seek(0);
        this.songPlay();
        return;
      }

      if (this.isPersonalFM) {
        this.playNextPersonalFM();
        return;
      } else {
        if (!this.trackList || this.trackList.length === 0) return;
        this.currentIndex === this.trackList.length - 1
          ? (this.currentIndex = 0)
          : this.currentIndex++;

        this.replaceCurrentTrack(
          this.trackList[this.currentIndex],
          true,
          -1,
          false
        );
      }
    },

    // 播放指定歌曲
    playSong(source, autoPlay, progress) {
      Howler.unload();
      this.howler = new Howl({
        src: [source],
        html5: true,
        volume: this.volume,
        format: ["mp3", "flac"],
      });
      this.setCurTimeIntervals();
      autoPlay ? this.songPlay() : this.songPause();
      this.howler.seek(Math.floor(progress / 1000));
      document.title = `Ro Play - ${this.currentTrack.name} · ${this.currentTrack.ar[0].name}`;

      this.howler.once("end", () => {
        let id = this.currentTrack.id;
        let time = this.currentTrack.dt / 1000;
        scrobble({ id, time, sourceid: 0 });
        this.playNext();
      });
    },

    // 替换当前歌曲
    replaceCurrentTrack(
      id,
      autoPlay = true,
      progress = 0, // 如果为-1则播放下一首
      isPersonalFM = false
    ) {
      this.isPersonalFM = isPersonalFM;
      getTrackDetail(id).then((res) => {
        getMP3(id).then((res2) => {
          if (res2.data[0].url) {
            if (!this.isPersonalFM) {
              let index = this.trackList.indexOf(id);
              if (index === -1) {
                this.trackList.push(id);
                this.currentIndex = this.trackList.length - 1;
                if (this.playMode === 2) {
                  this.setRandomList();
                }
              } else {
                this.currentIndex = index;
                if (this.playMode === 2) {
                  this.randomIndex = this.randomList.indexOf(id);
                }
              }
            }
            this.currentTrack = res.songs[0];
            this.playSong(res2.data[0].url, autoPlay, progress);
          } else {
            ElNotification({
              title: "错误",
              message: "该歌曲暂时无法播放",
              position: "bottom-right",
              type: "error",
            });
            if (progress === -1) {
              this.playNext();
            }

            return;
          }
        });
      });
    },

    // 更新当前歌曲播放时间
    setCurTimeIntervals() {
      setInterval(() => {
        if (this.howler === null) return;
        this.progress = this.howler.seek() * 1000;
      }, 500);
    },

    // 设置当前歌曲时间
    setProgress(value) {
      if (this.howler) {
        this.howler.seek(value / 1000);
      }
    },

    setVolume(value) {
      if (value > 1) value = 1;
      if (value < 0) value = 0;

      if (Howler) {
        Howler.volume(value);
      }
      this.volume = value;
    },

    // 传入id,检查是否在播放列表中
    checkInTrackList(id) {
      return this.trackList.indexOf(id) !== -1;
    },

    // 传入id,从播放列表中移除
    removeTrack(id) {
      this.deleteTrackIndex = -1;
      let index = this.trackList.indexOf(id);

      if (index !== -1) {
        // 如果删除的是当前歌曲就播放下一首
        if (index === this.currentIndex) {
          this.trackList.length === 1 ? "" : this.playNext();
        }
        index < this.currentIndex ? this.currentIndex-- : "";
        this.deleteTrackIndex = index;
        this.trackList.splice(index, 1);

        if (this.trackList.length === 0) {
          Howler.stop();
        }

        ElNotification({
          title: "删除成功",
          message: "已从播放列表中删除",
          position: "bottom-right",
          type: "success",
        });
      }
    },

    // 传入id,添加到播放列表
    addTrack(id) {
      if (this.checkInTrackList(id)) return;
      this.trackList.push(id);
      ElNotification({
        title: "添加成功",
        message: "已添加到播放列表",
        position: "bottom-right",
        type: "success",
      });
    },

    // 通过id获取歌单所有歌曲并重置播放列表
    playSongByPlaylist(id) {
      let ids = [];
      getPlaylistDetail(id).then((res) => {
        res.playlist.trackIds.map((item) => {
          ids.push(item.id);
        });
        this.trackList = ids;
        this.currentIndex = 0;
        this.replaceCurrentTrack(ids[0]);
      });
    },

    // 通过id获取专辑所有歌曲并重置播放列表
    playSongByAlbum(id) {
      let ids = [];
      getAlbum(id).then((res) => {
        res.songs.map((item) => {
          ids.push(item.id);
        });
        this.trackList = ids;
        this.currentIndex = 0;
        this.replaceCurrentTrack(ids[0]);
      });
    },

    // 通过id获取歌手热门歌曲并重置播放列表
    playSongByArtist(id) {
      let ids = [];
      getArtist(id).then((res) => {
        res.hotSongs.map((item) => {
          ids.push(item.id);
        });
        this.trackList = ids;
        this.currentIndex = 0;
        this.replaceCurrentTrack(ids[0]);
      });
    },

    // 获取私人FM歌曲
    async getPersonalFM() {
      if (this.personalFMNext.length === 0) {
        await personalFM().then((res) => {
          this.personalFMNext = res.data;
          if (!this.personalFMCurrent.name) {
            this.personalFMCurrent = this.personalFMNext[0];
            this.personalFMNext.splice(0, 1);
          }
        });
      }
    },

    // 播放私人fm歌曲
    async playPersonalFM() {
      if (!this.personalFMCurrent.name) {
        await this.getPersonalFM();
      }
      if (this.isPersonalFM) {
        this.playOrPause();
      } else {
        this.replaceCurrentTrack(this.personalFMCurrent.id, true, 0, true);
      }
    },

    // 播放下一首私人FM
    async playNextPersonalFM() {
      if (this.personalFMNext.length === 0) {
        await this.getPersonalFM();
      }
      this.personalFMCurrent = this.personalFMNext[0];
      this.personalFMNext.splice(0, 1);
      this.replaceCurrentTrack(this.personalFMCurrent.id, true, 0, true);
      if (this.personalFMNext.length === 0) {
        this.getPersonalFM();
      }
    },

    // 更换播放模式
    changePlayMode() {
      this.playMode = (this.playMode + 1) % 3;
      if (this.playMode === 2) {
        this.setRandomList();
      } else if (this.playMode === 0) {
        this.currentIndex = this.trackList.indexOf(this.currentTrack.id);
      }
    },

    // 随机列表
    setRandomList() {
      console.log("123123123");
      this.randomIndex = 0;
      this.randomList = [];
      this.randomList.push(...this.trackList);
      this.randomList = this.randomList.sort(() => {
        return 0.5 - Math.random();
      });
      this.randomList = Array.from(
        new Set([this.currentTrack.id, ...this.randomList])
      );
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: [
          "progress",
          "volume",
          "currentIndex",
          "trackList",
          "currentTrack",
        ],
      },
    ],
  },
});
