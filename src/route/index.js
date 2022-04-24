import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/explore/explore.vue"),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: "/feed",
    name: "feed",
    component: () => import("../views/feed/feed.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/video",
    name: "video",
    component: () => import("../views/feed/feed.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/radio",
    name: "radio",
    component: () => import("../views/feed/feed.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/like",
    name: "like",
    component: () => import("../views/feed/feed.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/recent",
    name: "recent",
    component: () => import("../views/feed/feed.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/cloud",
    name: "cloud",
    component: () => import("../views/feed/feed.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },

  {
    path: "/search/:keyword",
    name: "search",
    component: () => import("../views/search/search.vue"),
  },
  {
    path: "/search/:keyword/:type",
    name: "searchType",
    component: () => import("../views/search/searchType.vue"),
  },
  {
    path: "/search",
    redirect: "/",
  },

  {
    path: "/currentList",
    name: "currentList",
    component: () => import("../views/currentList.vue"),
  },
  {
    path: "/playlist/:id",
    name: "playlist",
    component: () => import("../views/playlist.vue"),
    meta: {
      hideHeader: true, // 移动端隐藏头部
    },
  },
  {
    path: "/playlist",
    redirect: "/",
  },

  {
    path: "/album/:id",
    name: "album",
    component: () => import("../views/album.vue"),
    meta: {
      hideHeader: true, // 移动端隐藏头部
    },
  },
  {
    path: "/album",
    redirect: "/",
  },

  {
    path: "/artist/:id",
    name: "artist",
    component: () => import("../views/artist.vue"),
    meta: {
      hideHeader: true, // 移动端隐藏头部
    },
  },
  {
    path: "/artist",
    redirect: "/",
  },

  // room
  {
    path: "/room/playlist",
    name: "RoomPlaylist",
    component: () => import("../views/room/playlist.vue"),
  },
  {
    path: "/room/artist",
    name: "RoomArtist",
    component: () => import("../views/room/artist.vue"),
  },
  {
    path: "/room/top",
    name: "RoomTop",
    component: () => import("../views/room/topList.vue"),
  },
  {
    path: "/room",
    redirect: "/",
  },

  // login
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/login.vue"),
  },

  // 日推
  {
    path: "/dailysongs",
    name: "DailySongs",
    component: () => import("../views/songList.vue"),
  },

  //听歌排行
  {
    path: "/songsrecord",
    name: "SongsRecord",
    component: () => import("../views/songList.vue"),
  },

  //我的收藏
  {
    path: "/favouritesongs",
    name: "FavouriteSongs",
    component: () => import("../views/songList.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
