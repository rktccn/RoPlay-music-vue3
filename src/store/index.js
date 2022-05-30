import { defineStore } from "pinia";
import {
  getUserPlaylist,
  userLikedSongsIDs,
  getAnonymityCookie,
} from "../apis/user";
import { usePlayer } from "./player";

export const useStore = defineStore("main", {
  state: () => {
    return {
      showOverlay: false,
      showLyric: false,

      // 登陆相关
      isLoggedIn: -1, // -1: 未登录, 1: 已登录, 2: 通过搜索用户名登陆
      userInfo: {}, // 用户信息
      userPlaylist: null, // 用户歌单
      likedSongIDs: null, // 喜欢的歌曲id
      userCookie: null,
      // 默认cookie
      defaultCookie: "",
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
    init() {
      // 获取匿名cookie
      if (this.defaultCookie === "") {
        getAnonymityCookie().then((res) => {
          this.defaultCookie = res.cookie;
          // location.reload();
        });
      }

      const player = usePlayer();
      // 初始化用户信息
      if (this.isLoggedIn === -1) return;
      const userId = this.userInfo.userId;

      // 密码登陆
      if (this.isLoggedIn === 1) {
        // 获取私人FM
        player.getPersonalFM();

        // 获取收藏的歌曲
        userLikedSongsIDs().then((res) => {
          this.likedSongIDs = res.ids;
        });

        // 获取用户歌单
        getUserPlaylist({ uid: userId, limit: 100, offset: 0 }).then((res) => {
          this.userPlaylist = res.playlist;
        });
      }

      // 搜索用户名
      if (this.isLoggedIn === 2) {
        // 获取用户歌单
        getUserPlaylist({ uid: userId, limit: 100, offset: 0 }).then((res) => {
          this.userPlaylist = res.playlist;
        });
      }
    },

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

    // 退出登陆
    logout() {
      this.isLoggedIn = -1;
      this.userInfo = {};
      this.userPlaylist = null;
      this.likedSongIDs = null;
      this.userCookie = null;
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
        paths: ["isLoggedIn", "userInfo", "userCookie"],
      },
      {
        key: "anonymityUser",
        storage: sessionStorage,
        paths: ["defaultCookie"],
      },
    ],
  },
});
