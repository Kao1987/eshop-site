<template>
    <!-- 整體導航欄 -->
    <div class="header-container">
        <BNavbar toggleable="lg" type ="light" variant="light" class="navbar-overlay px-0">
        <BContainer fluid>
            <!-- 手機版選單的 Toggler 按鈕 -->
            <div class="headerbar d-flex justify-content-between align-items-center">
                <BNavbarToggle @click="toggleNav"></BNavbarToggle>
            </div>
            <!-- 導覽左 -->
            <BCollapse id="nav-collapse" v-model="isNavCollapsed" is-nav>
                <div class="nav-content d-flex w-100 align-items-center justify-content-between">
                    <BNavbarNav class="nav-links me-lg-3">
                        <!-- 功能導航欄 -->
                        <BNavItem
                            v-for = "item in navItems"
                            :key="item.path"
                            :to="item.path"
                            class="nav-item-customer"
                            @click="closeNav">
                            <span class="nav-link-text">{{ item.text }}</span>
                        </BNavItem>
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
                        <router-link class="cart-item me-3" to="/ShopCart">
                            <img src="/img/shopping_cart.png" alt="購物車" class="icon-img">
                            <span class="text-link">購物車</span>
                        </router-link>
                        <router-link class="cart-item" to="/UserLogin">
                            <img src="/img/member_login.png" alt="會員登入" class="icon-img">
                            <span class="text-link">會員登入</span>                            
                        </router-link>
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
            isNavCollapsed:window.innerWidth < 992,
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
            this.isNavCollapsed = !this.isNavCollapsed;                
        },
        closeNav(){
            if(window.innerWidth<992) {
                this.isNavCollapsed = true;
            }
        },        
        checkScreenSize(){
            if (window.innerWidth >= 992) {
            this.isNavCollapsed = false;
            } else {
            this.isNavCollapsed = true;
        }
        },
        handleResize(){
            this.checkScreenSize();
        }
    },
    mounted(){
        this.checkScreenSize();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount(){
        window.removeEventListener('resize', this.handleResize);
    },
};

</script>
<style scoped>
.header-container{
    --header-bg-image:url('/public/img/header_bg.jpg');
    background:var(--header-bg-image);
    background-size: cover;
    background-repeat: no-repeat;
}

.navbar-overlay{
    background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
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
    color: #333;
    position: relative;
    text-decoration: none;
}
.nav-link-text::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #0056b3;
    transition: width 0.3s ease;
}
.nav-item-customer:hover .nav-link-text::after {
    width: 100%;
}
.nav-item-customer{
    position: relative;
    white-space: nowrap;
    padding: 0.5rem 1rem;;
    transition: all 0.3s ease;
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
}
.search-box:focus{
    border-color: #0056b3;
    box-shadow:0 0 0 0.2rem rgba(0,86,179,0.25); 
}
.search-button{
    position: absolute;
    right: 0;
    background-color:#0056b3;
    border-radius: 0 20px 20px 0;
    padding:0.375rem 1.5rem;
    transition: all 0.3s ease; 
}
.search-container{
    display: flex;
    justify-content: center;
    flex-grow:1;
    max-width: 400px;
}

.cartmember{
    display: flex;
    text-align: center;
}
.cart-item{
    display: flex;
    align-items: center;
    padding: 0.5rem;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 20px;
}
.cart-item:hover{
    background-color: red;
    transform: translateY(-2px);
}
/* .cart-link .member-link{
    display: flex;
    align-items:center;
    margin:0 0.5rem;
    color: brown;
    text-decoration: none;
} */
.icon-img{
    width:24px;
    height:24px;
    margin-right: 0.5rem;
    transition:transform 0.3s ease;    
}
.cart-item:hover .icon-img{
    transform: scale(1.1);
}


@media (min-width: 1200px) {
    .navbar-overlay {
        justify-content: space-between;
    }
}
@media (min-width: 992px) {
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
    }
    .nav-links{
        justify-content: center;
        margin-bottom: 1rem;
        width: 100%;
    }
    .nav-item-customer{
        margin:0.25rem 0.5rem;
        text-align:center;
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
        flex-direction: column;
    }
    
    .search-button {
        margin-top: 0.5rem;
        width: 100%;
    }
}

</style>