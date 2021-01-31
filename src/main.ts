import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router";
import Antd from "ant-design-vue";
import * as Icons from "@ant-design/icons-vue";
import "../node_modules/ant-design-vue/dist/antd.css";
const app = createApp(App);
const icons: any = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}
app.use(Router).use(Antd).mount("#app");
