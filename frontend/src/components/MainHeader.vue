<template>
    <!-- 整體導航欄 -->
    <div class="header-container">
        <BNavbar toggleable="lg" type ="light" variant="light" class="navbar-overlay px-0">
        <BContainer fluid>
            <!-- 手機版選單的 Toggler 按鈕 -->
            <div class="headerbar d-flex align-items-center">
                <BNavbarToggle @click="toggleNav"></BNavbarToggle>
                <div v-if="!isNavOpen" class="nav-toggle-wrapper d-flex align-items-center ms-2">
                    <img 
                    :src="$getImageUrl('arrowleft.png','icon')"
                    alt="導航提示" class="nav-toggle-image" @click="toggleNav"/>
                    <span class="nav-toggle-text ms-1">請點選此處開啟導航欄</span>

                </div>
            </div>
            <!-- 導覽左 -->
            <BCollapse id="nav-collapse" v-model="isNavOpen" is-nav>
                <div class="nav-content d-flex w-100 align-items-center justify-content-between">
                    <BNavbarNav class="nav-links me-lg-3">
                        <!-- 功能導航欄 -->
                        <div
                            v-for = "item in navItems"
                            :key="item.path"
                            :to="item.path"
                            class="nav-item-container"
                            >
                            <router-link :to="item.path" class="nav-link-text" @click="closeNav"
                            >
                            {{ item.text }}</router-link>
                    </div>
                    </BNavbarNav>
                        <!-- 搜尋欄—置中 -->
                        <div class="search-container d-flex mx-lg-3">
                            <div class="search-input-wrapper">
                            <BFormInput  
                                type="text" 
                                v-model="searchQuery" 
                                class="search-box" 
                                placeholder="請輸入想找的商品搜尋" 
                                @keyup.enter="handleSearch">
                            </BFormInput>
                            <BButton class="search-button btn btn-primary ms-2"  @click="handleSearch">搜尋</BButton>
                            </div>

                        </div>
                    <!-- 導覽右—快捷 -->
                    <div class="cartmember d-flex">
                        <router-link class="cart-item me-3" to="/ShopCart" @click="closeNav">
                            <img :src="$getImageUrl('shopping_cart.png','icon')" alt="" class="icon-img">
                            <span class="cart-text">購物車</span>
                        </router-link>
                        <template v-if="isLoggedIn">
                            <div class="member-item">
                                <span class="cart-text">歡迎 {{ userName }}</span>
                                <button class="btn btn-link cart-text" @click="logout">會員登出</button>
                            </div>
                        </template>
                        <template v-else>
                            <router-link class="member-item" to="/UserLogin" @click="closeNav">
                                <img :src="$getImageUrl('member_login.png','icon')" alt="" class="icon-img">
                                <span class="cart-text">會員登入</span>                            
                            </router-link>
                        </template>
                    </div>
                </div>
            </BCollapse>
        </BContainer>
    </BNavbar>
    </div>
</template>

<script>
export default {
    name: 'MainHeader',
    data(){
        return{
            searchQuery:'',
            isNavOpen:window.innerWidth < 992,
            navItems: [
                { path: '/', text: '首頁' },
                { path: '/MembersPage', text: '會員中心' },
                { path: '/ProductsList', text: '產品列表' },
                { path: '/AboutUsPage', text: '關於我們' },
                { path: '/ContactUs', text: '聯絡我們' },
                { path: '/admin', text: '後台' }
            ] 
        };
    },
    computed:{
        isLoggedIn(){
            return this.$store.state.auth.isLoggedIn;
        },
        userName(){
            return this.$store.state.auth.user ? this.$store.state.auth.user.name:'';
        }
    },
    methods:{
        handleSearch(){
            if(this.searchQuery.trim() !== ''){
                this.$router.push({
                path: '/ProductsList',
                query: { search: this.searchQuery.trim() }
            });
            this.closeNav();
            }
        },
        toggleNav(){
            this.isNavOpen = !this.isNavOpen;                
        },
        closeNav(){
            if(window.innerWidth < 992) {
                this.isNavOpen = false;
            }
        },        
        checkScreenSize(){
            if (window.innerWidth >= 992) {
            this.isNavOpen = true;
            } else {
            this.isNavOpen = false;
        }
        },
        handleResize(){
            this.checkScreenSize();
        },
        logout(){
            this.$store.dispatch('auth/logout');
            this.$router.push({path:'/'});
        }
    },
    mounted(){
        this.checkScreenSize();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount(){
        window.removeEventListener('resize', this.handleResize);
    },
    watch:{
        '$route'(){
            this.closeNav();
        }
    }
};
</script>
<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

.headerbar{
    position:relative;
}
.nav-toggle-text{
    margin-left:10px;
    font-size:14px;
    color:#cfcfcf;
}

.header-container{
    --header-bg-image:url('../assets/img/header_bg.jpg');
    background:var(--header-bg-image);
    background-size: cover;
    background-repeat: no-repeat;
}

.navbar-overlay{
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    --bs-bg-opacity:0;
}

.nav-content{
    display:flex;
    flex-wrap:wrap;
    align-items:center;
}

.nav-links{
    display: flex;
    flex-wrap: wrap;
}
.nav-link-text{
    color:#ffffff;
    position: relative;
    text-decoration: none;
    cursor:pointer;
}
.nav-link-text::after {
    width: 100%;
}
.nav-item-container {
    padding: 0.8rem 1.2rem;
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 0.3rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.nav-item-container:hover {
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 添加滑鼠懸停時的底線動畫效果 */
.nav-item-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: #0056b3;
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.nav-item-container:hover::after {
    width: 80%;
}

/* 活躍狀態樣式 */
.nav-item-container.active {
    background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
    color: #0056b3;
}

/* 添加點擊效果 */
.nav-item-container:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 確保文字顏色過渡效果 */
.nav-link-text {
    transition: color 0.3s ease;
}

.nav-item-container:hover .nav-link-text {
    color: #0056b3;
}

.search-input-wrapper{
    position: relative;
    display: flex;
    width: 100%;
    max-width: 400px;
}
.search-box{
    border-radius:20px;
    padding-right: 110px;
    border: 2px solid #ddd;
    transition:all 0.3s ease;    
    height: 38px;
}
.search-box:focus{
    border-color: #0056b3;
    box-shadow:0 0 0 0.2rem rgba(0,86,179,0.25); 
}
.search-button{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background-color:#0056b3;
    border-radius: 0 20px 20px 0;
    padding:0 1.5rem;
    transition: all 0.3s ease; 
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.search-container{
    display: flex;
    justify-content: center;
    flex-grow:1;
    max-width: 400px;
}

.cartmember{
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 1rem;
}
.cart-item{
    display: flex;
    align-items: center;
    padding: 0.5rem;
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 20px;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.cart-item:hover{
    background-color: #2563b3;
    transform: translateY(-2px);
}
.icon-img{
    width:24px;
    height:24px;
    margin-right: 0.5rem;
    transition:transform 0.3s ease;    
}
.cart-item:hover .icon-img{
    transform: scale(1.1);
}

/* 新增的閃爍動畫 */
@keyframes blink {
    0%, 50%, 100% {
        opacity: 1;
    }
    25%, 75% {
        opacity: 0;
    }
}

.nav-toggle-image {
    margin-left: 10px;
    width: 24px; /* 根據需要調整大小 */
    height: 24px; /* 根據需要調整大小 */
    animation: blink 1.5s infinite;
    cursor: pointer;
}

@media (min-width: 1200px) {
    .navbar-overlay {
        justify-content: space-between;
    }
}
@media (min-width: 992px) {
    .nav-toggle-text{
        display:none;
    }
    .navbar-overlay{
        position:relative;
    }
    .topheader,
    .search-container,
    .cartmember{
        flex-direction: row;
        align-items: center;
    }      
    .cartmember{
        white-space: nowrap;
    }

}

@media (max-width: 991px) {
    .nav-content{
        flex-direction: column;
        align-items:center;
    }
    .nav-links{
        justify-content: center;
        margin-bottom: 1rem;
        width: 100%;
    }
    .nav-item-container{
        margin:0.25rem 0.5rem;
        text-align:center;
        justify-content: center;
    }
    .search-container {
        margin:0.5rem 0;
        justify-content: center;
    }
    .cartmember{
        width: 100%;
        justify-content:center;
        margin-top:0.5rem;
    }
    .cart-item{
        margin-left: 0.5rem;
    }
    .nav-link-text{
        text-align: center;
    }
}
@media (max-width: 576px) {
    .nav-links {
        justify-content: flex-start;
    }
    
    .nav-item-custom {
        flex: 0 0 auto;
        margin: 0.5rem 0;
        width: 100%;
    }
    .cart-item {
        margin: 0.25rem 0.5rem;
    }
}
@media (max-width: 375px) {
    .text-link{
        display: none;
    }
    .icon-img{
        margin-right: 0;
    }
    .nav-item-custom {
        font-size: 14px;
        margin: 0.25rem;
    }
    
    .search-container {
        flex-direction: row;
    }
    
    .search-button {
        position: absolute;
        margin-top: 0;
        width: auto;
        right: 0;
    }
}
@media (min-width: 992px) and (max-width: 1121px) {
    .nav-content {
        justify-content: space-between;
        flex-wrap: nowrap; /* 防止項目換行 */
    }
    .cartmember {
        white-space: nowrap;
        flex-shrink: 0; /* 防止購物車和登入按鈕縮小 */
    }
    .nav-links {
        flex-shrink: 1; /* 允許導航鏈接縮小以適應空間 */
    }
    .search-container {
        margin: 0 1rem; /* 在兩側加一些間距 */
        min-width: 200px; /* 設置最小寬度 */
        flex-shrink: 1; /* 允許搜索框縮小 */
    }
    .nav-item-container {
        padding: 0.5rem; /* 稍微減少水平內邊距 */
    }
    /* 可能需要調整搜索框的樣式 */
    .search-input-wrapper {
        max-width: 100%; /* 允許搜索框完全縮小到容器寬度 */
    }
    .search-box {
        padding-right: 90px; /* 稍微減少右側內邊距 */
    }
    .search-button {
        padding: 0.375rem 1rem; /* 稍微減少按鈕的內邊距 */
    }
}

/* 新增 .member-item 樣式 */
.member-item{
    display: flex;
    align-items: center;
    padding: 0.5rem;
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 20px;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.member-item:hover{
    background-color: #2563b3;
    transform: translateY(-2px);
}

.member-item .text-link{
    margin-right: 0.5rem;
}

.member-item .btn-link{
    color: #ffffff;
    text-decoration: none;
}

.member-item .btn-link:hover{
    color: #e6f3ff;
}


.cart-text {
    color: #ffffff;
    display: inline;
}


@media (max-width: 576px) {
    .cart-text {
        display: none;  /* 在手機尺寸下隱藏 */
    }
}

</style>