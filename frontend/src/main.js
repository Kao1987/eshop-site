// main.js
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';
import BootstrapVue3 from 'bootstrap-vue-3';
import router from './router';
import axios from 'axios';
import store from './store';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import request from '@/utils/request';


const app = createApp(App);

// 掛載全域 Axios
app.config.globalProperties.$axios = request;

// 使用插件
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(BootstrapVue3);

app.mount('#app');