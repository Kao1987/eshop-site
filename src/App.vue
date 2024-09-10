<template>
    <div class="marquee">
        <span>注意！本公司不會主動通知帳務問題，若有相關疑問請洽客服！小心詐騙！</span>
    </div>

<div id="app">
  <MainHeader /> 
  <div class="main-content">
      <router-view />
  </div> 
  <MainFooter />
</div>
</template>

<script>
import MainHeader from './components/MainHeader.vue';
import MainFooter from './components/MainFooter.vue';
import './fullcss.css';
export default {
  name: 'App',
  components: {
    MainHeader,
    MainFooter,
  }
}

</script>

<style scoped>
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
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-content{
  flex-grow:1;
  padding: 20px;
  overflow: auto;
}
.marquee{
  width: 100%; /* 跑馬燈的寬度 */
  overflow: hidden; /* 隱藏超出容器範圍的內容 */
  white-space: nowrap; /* 禁止文字換行 */
  box-sizing: border-box;
  padding: 10px; /* 增加一些內邊距來美化 */
  background-color: #85bffa; /* 背景色 */
  border: 1px solid #ccc; /* 邊框 */
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
@keyframes marquee{
  0%{
    transform:translateX(100%);
  }
  100%{
    transform:translateX(-100%);
  }
}

</style>
