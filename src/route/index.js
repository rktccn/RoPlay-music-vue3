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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
