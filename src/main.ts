import { createApp } from 'vue'
import App from './App.vue';
import Router from "./router"
import Antd from 'ant-design-vue';
import '../node_modules/ant-design-vue/dist/antd.css';

createApp(App).use(Router).use(Antd).mount('#app')
