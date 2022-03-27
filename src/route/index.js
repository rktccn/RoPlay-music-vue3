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
    path: "/recommend",
    name: "recommend",
    component: () => import("../views/recommend.vue"),
    meta: {
      keepAlive: true,
      savePosition: true,
      requireLogin: true,
    },
  },
  {
    path: "/video",
    name: "video",
    component: () => import("../views/recommend.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/radio",
    name: "radio",
    component: () => import("../views/recommend.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/like",
    name: "like",
    component: () => import("../views/recommend.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/recent",
    name: "recent",
    component: () => import("../views/recommend.vue"),
    meta: {
      // keepAlive: true,
      // savePosition: true,
      // requireLogin: true,
    },
  },
  {
    path: "/cloud",
    name: "cloud",
    component: () => import("../views/recommend.vue"),
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
