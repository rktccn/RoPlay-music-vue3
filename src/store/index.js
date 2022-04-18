import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      showOverlay: false,
      showLyric: false,

      // 登陆相关
      isLoggedIn: -1, // -1: 未登录, 1: 已登录, 2: 通过搜索用户名登陆
      userInfo: {}, // 用户信息
      userPlaylist: [], // 用户歌单
    };
  },
  getters: {
    returnMusicId(state) {
      return state.musicId;
    },
    getOverlay(state) {
      return state.showOverlay;
    },
  },
  actions: {
    setMusicId(param) {
      this.musicId = param;
    },
    setOverlay(param) {
      if (param !== null) {
        this.showOverlay = param;
      } else {
        this.showOverlay = !this.showOverlay;
      }
    },

    // 设置用户信息
    // @param {Object} params
    // @param {String} params.logMode 登陆模式 , 可选值 : "password" , "name"
    // 模式为 "name"时
    // @param {Object} params.userInfo 用户信息
    // @param {Array} params.userPlaylist 用户歌单
    setUserInfo(params) {
      if (params.logMode === "name") {
        this.isLoggedIn = 2;
        this.userInfo = params.userInfo;
      } else {
      }
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
        paths: ["isLoggedIn", "userInfo"],
      },
    ],
  },
});
