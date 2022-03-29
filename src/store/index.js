import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      isLoggedIn: false,
      showOverlay: false,
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
  },
});
