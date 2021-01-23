import { createRouter, createWebHistory } from "vue-router";

const routerHistory = createWebHistory();
const Router = createRouter({
  history: routerHistory,
  routes: [
    {
      name: "login",
      path: "/login",
      component: () => import("../pages/Login/index.vue"),
    },
  ],
});

export default Router;
