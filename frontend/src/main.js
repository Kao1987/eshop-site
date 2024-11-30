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




const app = createApp(App);

axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5001';
app.config.globalProperties.$axios = axios;

app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(BootstrapVue3);


app.mount('#app');
