<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();
    // 判断是否有登录用户，后期版本需要checktoken校验
    const token = sessionStorage.getItem("token");
    if (token === null || token === "") {
      message.warning(`您未登录或凭证到期，请重新登录`);
      router.replace({
        name: "Login",
      });
    }
  },
});
</script>

<style>
</style>