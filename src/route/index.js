import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/feed/feed.vue"),
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
