import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      musicId: 21,
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
