import { createRouter, createWebHistory } from "vue-router";
const routerHistory = createWebHistory();
import Layout from "../layouts/index.vue";

export const constantRoutes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("/@/pages/Login/index.vue"),
    hidden: true,
  },
  {
    path: "/",
    name: "Index",
    component: Layout,
    redirect: "/index",
    meta: {
      title: "首页",
      icon: "FundOutlined",
      single: true
    },
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("/@/pages/Dashboard/index.vue"),
        meta: {
          title: "首页",
        },
      },
    ],
  },
  {
    path: "/exmine",
    component: Layout,
    meta: {
      title: "审核",
      icon: "MonitorOutlined",
    },
    children: [
      {
        path: "exmineQuestion",
        name: "exmineQuestion",
        component: () => import("/@/pages/Examine/ExamineQuestion/ExamineQuestion.vue"),
        meta: {
          title: "审核题目",
          icon: "BookOutlined",
        },
      },
    ],
  },
  {
    path: "/app",
    component: Layout,
    meta: {
      title: "APP",
      icon: "RobotOutlined",
    },
    children: [
      {
        path: "/area",
        name: "area",
        component: () => import("/@/pages/App/Area/index.vue"),
        meta: {
          title: "专区管理",
          icon: "BlockOutlined",
        },
      },
      {
        path: "/tag",
        name: "tag",
        component: () => import("/@/pages/App/Tag/index.vue"),
        meta: {
          title: "标签管理",
          icon: "TagOutlined",
        },
      }
    ],
  },
];

const Router = createRouter({
  history: routerHistory,
  routes: constantRoutes,
});

export default Router;
