<template>
<header class="navbar navbar-expand-lg navbar-light bg-light px-0">
<div class="container-fluid headerbar">
    <!-- 手機版選單的 Toggler 按鈕 -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <!-- 導覽左 -->
    <div class="collapse navbar-collapse topheader me-auto " id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item">
                <router-link class="nav-link" to="/">首頁</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/MembersPage">會員中心</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/ProductsList">產品列表</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/AboutUsPage">關於我們</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/ContactUs">聯絡我們</router-link>
            </li>
        </ul>
    </div>
    <!-- 中間的搜尋欄—置中 -->
    <div class="search-container d-flex justify-content-between mx-auto w-100">
        <input  type="text" v-model="searchQuery" class="search-box w-100" placeholder="請輸入想找的商品搜尋" @input="handleSearch">
        <button class="search-button btn btn-primary ">搜尋</button>
        </div>
        <!-- 導覽右—快捷 -->
    <div class="cartmember d-flex ms-auto">
        <router-link class="cart-item me-3" to="/ShopCart">查看購物車</router-link>
        <router-link class="cart-item" to="/UserLogin">會員登入</router-link>
    </div>
</div>
</header>
</template>

<script>
export default {
    name: 'MainHeader',
};
</script>
<style scoped>

.headerbar{
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 5px;
    background:url('/public/img/header_bg.jpg  ') ;
    background-size: cover;
    white-space: nowrap;
}
.topheader {
flex-wrap: nowrap;
flex-grow: 1;
}

.navbar-nav{
    margin-left: 0;
    padding-left: 0;
    flex-grow: 1;
}
.search-container{
display: flex;
justify-content: center;
margin: 0 auto;

}

.search-box{
max-width:450;
margin-right: 10px;
padding: 4px;
}

.search-button{
font-size: large;
padding: 4px 10px;
background: inherit;;
background-size: cover;
background-color: blue;
border: none;
cursor: pointer;
}
.cartmember{
display: flex;
text-align: center;
padding: 5px;  
margin: 5px 5px 5px 5xp; 
font-size:18px;
}
.cart-item{
margin-left: 5px;
color: brown;

}

@media (max-width: 768px) {
.search-box {
    max-width: 100%; /* 畫面縮小時，搜尋欄的最大寬度為 100% */
}
}

</style>
    