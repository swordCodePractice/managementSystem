import { createRouter, createWebHistory } from "vue-router";
const routerHistory = createWebHistory();
import Layout from "../layouts/index.vue";

const constantRoutes = [
  {
    path: "/login",
    component: () => import("/@/pages/Login/index.vue"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    meta: {
      title: "首页",
      icon: "home-4-line",
      affix: true,
    },
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("/@/pages/Dashboard/index.vue"),
        meta: {
          title: "首页",
          icon: "home-4-line",
          affix: true,
        },
      },
    ],
  },
];

const Router = createRouter({
  history: routerHistory,
  routes: constantRoutes,
});

export default Router;
