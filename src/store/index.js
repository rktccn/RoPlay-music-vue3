import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      isLoggedIn: false,
    };
  },
  getters: {
    returnMusicId(state) {
      return state.musicId;
    },
  },
  actions: {
    setMusicId(param) {
      this.musicId = param;
    },
  },
});
