<template>
    <div class="marquee">
        <span>2024.09.01，注意！本公司不會主動通知帳務問題，若有相關疑問請洽客服！小心詐騙！</span>
    </div>

  <NotificationComponent/>
  <MainHeader /> 
      <!-- 懸浮按鈕與彈窗 -->
      <div class="floating-button" @click="toggleModal">
      {{ modalVisible ? '關閉介紹' : '網站介紹' }}
    </div>

    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="toggleModal">&times;</span>
        <div class="notification-box">
          <h2>網站介紹</h2>
          <p>
            本網站前端使用 <strong>Vue.js</strong> 搭配 <strong>Bootstrap 5</strong>，實現響應式設計 (RWD)，<br />
            後端採用 <strong>Node.js</strong> 搭配 <strong>Express</strong>，資料庫使用 <strong>MySQL</strong>，部署於 <strong>Google Cloud Platform (GCP)</strong>。  
          </p>
          <p>
            全站採用 <strong>RESTful API</strong> 設計，前後端完全分離，確保資料交互的高效與穩定，<br>
            提升系統的擴展性與維護性。
          </p>

          <hr>

          <h3>主要功能介紹</h3>
          <ul>
            <li><strong>會員系統：</strong>註冊 / 登入 / 登出 / 忘記密碼 / 修改密碼 / 編輯個人資料</li>
            <li><strong>購物車系統：</strong>商品加入購物車 / 修改數量 / 移除 / 清空購物車</li>
            <li><strong>訂單系統：</strong>查詢 / 修改 / 取消訂單</li>
            <li><strong>商品管理系統：</strong>查看 / 修改 / 刪除商品</li>
            <li><strong>後台管理中心：</strong>會員 / 商品 / 訂單全面控管 / 銷售曲線圖查看銷售額度</li>
            <li><strong>首頁功能：</strong>銷售排行顯示 / 特價商品控管</li>
          </ul>
        </div>
      </div>
    </div>
  <div class="main-content">
      <router-view />
  </div> 
  <MainFooter />

</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import MainHeader from '@/components/MainHeader.vue';
import MainFooter from '@/components/MainFooter.vue';
import NotificationComponent from './components/NotificationComponent.vue';
import './fullcss.css';


export default {
  name: 'App',
  components: {
    MainHeader,
    MainFooter,
    NotificationComponent,
  },
  setup(){
    const store = useStore();
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
    const modalVisible = ref(false);
    const toggleModal = () => {
      modalVisible.value = !modalVisible.value;};
    return {
      isLoggedIn,
      modalVisible,
      toggleModal,
    }
  }
}

</script>

<style scoped>
*{
  box-sizing: border-box;
}
html,body{
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}
body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}
.mainpage{
  display: flex;
  font-weight: bold;
  font-size: 1em;
  padding: 5px;
  text-align: center;
  color: #fedc5e;
  justify-content: center;

}
.main-content{
  flex-grow:1;
  padding: 10px;
  overflow: auto;
}
.marquee{
  width: 100%; /* 跑馬燈的寬度 */
  overflow: hidden; /* 隱藏超出容器範圍的內容 */
  white-space: nowrap; /* 禁止文字換行 */
  box-sizing: border-box;
  padding: 10px; /* 增加一些內邊距來美化 */
  background-color: #85bffa; /* 背景色 */
}
.marquee span{
  display: inline-block;
  padding-left: 100%;
  animation:marquee 10s linear infinite;
  color: crimson;
}
/* 滑鼠移入跑馬燈會暫停 */
.marquee:hover span{
  animation-play-state: paused;
}
/* 懸浮按鈕 */
.floating-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  max-width: 200px;
  bottom: 10px;
  right: 0px;
  margin-right:10px;
  background: linear-gradient(145deg, #007bff, #0056b3);/* 修改背景為線性漸變 */
  color: white;
  padding: 10px 15px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 16px;
  z-index: 1050;
  transition: background 0.5s, box-shadow 0.5s; 
  overflow: hidden; 
  position: fixed;
}
.floating-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: skewX(-25deg);
  animation: shine 2s infinite;
}
.floating-button:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* 增加懸停時的陰影效果 */
}

/* 彈窗設計 */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #add8e6;
  padding: 30px;
  width: 70%;
  max-width: 900px;
  max-height: 80vh;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  color: #333;
  cursor: pointer;
}

.close:hover {
  color: #000;
}

/* 介紹內容排版 */
.notification-box {
  font-family: 'Arial', sans-serif;
  line-height: 1.8;
}

.notification-box h2, .notification-box h3 {
  margin-bottom: 15px;
  color: #333;
}

.notification-box ul {
  list-style: none;
  padding-left: 0;
}

.notification-box li {
  margin-bottom: 12px;
}
@keyframes marquee{
  0%{
    transform:translateX(100%);
  }
  100%{
    transform:translateX(-100%);
  }
}
@keyframes shine {
  0% {
    left: -75%;
  }
  50% {
    left: 125%;
  }
  100% {
    left: -75%;
  }
}
</style>
