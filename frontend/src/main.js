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
import ApiService from '@/services/api'; // 確保使用 ApiService 管理 Axios 請求
import { getImageUrl } from '@/utils/imageUrl'; // 引入圖片幫助函數
import { Tooltip } from 'bootstrap'


const app = createApp(App);

// 掛載全域 Axios
app.config.globalProperties.$axios = request;
app.config.globalProperties.$getImageUrl = getImageUrl;
// 使用插件
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(BootstrapVue3);
// 確認環境變數載入
console.log('API Base URL:', process.env.VUE_APP_API_BASE_URL);
console.log('Carousel Image Base URL:', process.env.VUE_APP_CAROUSEL_IMAGE_BASE_URL);
console.log('Product Image Base URL:', process.env.VUE_APP_PRODUCT_IMAGE_BASE_URL);
// 註冊全局自定義指令 v-tooltip
app.directive('tooltip', {
    mounted(el) {
    new Tooltip(el)
    },
    unmounted(el) {
        const tooltip = Tooltip.getInstance(el)
        if (tooltip) {
            tooltip.dispose()
        }
    }
})
store.dispatch('auth/checkAuthStatus').then(() => {
    app.mount('#app');
}).catch(error => {
    console.error('認證狀態檢查失敗:', error);
    app.mount('#app');
});