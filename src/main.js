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




const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(BootstrapVue3);
app.mount('#app');

axios.defaults.baseURL = '';

