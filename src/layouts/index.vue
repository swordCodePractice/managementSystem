<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu @click="handleClick" theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <MenuItem v-for="(item, index) in routeList" :item="item" :menuIndex="index" :key="index"></MenuItem>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <MenuUnfoldOutlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <MenuFoldOutlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { ref } from "vue";
import { constantRoutes } from "../router/index";
import MenuItem from "./components/MenuItem.vue";
import { useRouter } from "vue-router";
export default {
  components: {
    MenuItem,
  },
  data() {
    return {
      selectedKeys: [],
      collapsed: false,
    };
  },
  setup() {
    const router = useRouter();
    const routeList = ref(constantRoutes.filter((c) => !c.hidden));
    const handleClick = (e) => {
      let name = "";
      // 判断key是number还是string，如果是string那么就是折叠菜单的key(0-1, 0-2)
      if(typeof e.key === "string"){
        // 针对折叠多路由
        const subKey = e.key.split("-");
        name = routeList.value[subKey[0]].children[subKey[1]].name; // 取出当前选中的路由的name字段
      }else{
        // 针对单路由
        if(typeof routeList.value[e.key].name === "undefined"){
          console.error("meta字段为single的单路由，需要设置name")
          return;
        }
        name = routeList.value[e.key].name;
      }
       router.replace({
        name
      });
    }
    return {
      routeList,
      handleClick
    };
  },
};
</script>
<style>
#components-layout-demo-custom-trigger {
  height: 100vh;
  overflow-y: hidden;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>