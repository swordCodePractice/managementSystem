<template>
  <div class="login-container">
    <!-- 标题 -->
    <p class="title">剑指题解-管理员登录</p>
    <a-divider type="vertical" />
    <div class="form">
      <a-form :model="form">
        <a-form-item class="form-item">
          <a-input
            v-model:value="form.username"
            size="large"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="form.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="form.loading"
            class="loginButton"
            type="primary"
            size="large"
            @click="onSubmit"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
// login
import { loginByPassword } from "../../api/login";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "login",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter();
    // 定义form对象
    const form = ref({
      username: "",
      password: "",
      loading: false,
    });
    const onSubmit = async () => {
      form.value.loading = true;
      const loginResult: ActionResult = await loginByPassword({
        username: form.value.username,
        password: form.value.password,
      });
      form.value.loading = false;
      if (loginResult.success) {
        // 检查是否有admin权限
        console.log(loginResult.data);
        const userInfo = loginResult.data.userInfo;
        if (userInfo.role.includes("admin")) {
          message.success(`登录成功，欢迎您: ${userInfo.nickname}`);
          // 存储相关信息以及token
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          sessionStorage.setItem("uid", loginResult.data.uid);
          sessionStorage.setItem("token", loginResult.data.token);
          // 跳转到首页
          router.replace({
            name: "Index",
          });
        }
      }
    };
    return {
      form,
      onSubmit,
    };
  },
});
</script>
<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  text-align: center;
  background-color: #f0f2f5;
  background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-0vdryl5tm4n61d8ce3/804abfe0-5d63-11eb-b680-7980c8a877b8.svg);
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;
  padding: 10% 0 24px;
}
.form {
  min-width: 260px;
  width: 368px;
  text-align: center;
  margin: 0 auto;
}

.title {
  font-size: 33px;
}
.login-container :deep() .ant-col {
  width: 100%;
}
.login-container :deep() .ant-btn {
  width: 100%;
}
</style>