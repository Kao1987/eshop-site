<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-3">
                <h4>篩選條件</h4>
                <div>
                    <label>價格區間</label>
                    <input type="range" v-model="priceRange" min="0" max="50000" step="500" @input="filterProducts"/>
                    <p>價格：{{ priceRange }}元</p>
                </div>

            </div>
        </div>
    </div>
    <div class="container mt-5">
        <h2 class="mb-4">商品列表</h2>
        <div class="row">
            <div class="col-md-3 mb-4" v-for="product in filteredProducts" :key="product.id">
                    <ProductCard :product="product" @add-to-cart="addToCart"/>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
import ProductCard from './ProductCard.vue';

export default {
    name: 'ProductsList',
    components: {
        ProductCard,
    },

data() {
    return {
        products: [],
        priceRange: 50000,
        isLoggedIn: false,
    };
},
mounted() {
    this.loadProducts();
    console.log("正在加載產品...");
    this.checkLoginStatus();
},

    computed: {
        searchQuery(){
            return this.$route.query.search || '';
        },
        filteredProducts(){
            console.log("篩選後的商品:",this.products);
            return this.products.filter(product => {
                const productPrice = Number(product.price);
                return product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) && Number(productPrice) <= this.priceRange;
            });
        }
    },
    methods:{
        async loadProducts(){
            try{
                const response = await axios.get('/api/products');
                console.log("商品數據:",response.data);
                this.products = response.data;
            }catch(error){
                console.error("加載商品時出錯",error);
                alert("加載產品時出錯，請稍候再試！");
            }
        },
        // 檢查登入狀態
        checkLoginStatus(){
            this.isLoggedIn = !!localStorage.getItem('authToken');
        },
        // 加入購物車方法  
        addToCart(product){
            if(!this.isLoggedIn){
                // 未登入將跳轉至登入頁面
                alert('請先登入會員在加入購物車！');
                this.$router.push('/login');
                return;
            }
            console.log('該商品以加入購物車：',product.name);
        }
    },
};
</script>

<style scoped>
/* 自定義樣式 */
</style>
