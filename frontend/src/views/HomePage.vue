<template>
    <div class="homepage container mt-5">
        <!-- 圖片輪播 -->
        <div class="carousel-section">
            <div v-if="isLoading.carousel"
            id="mainCarousel"
            class="carousel slide"
            >
            <!-- 指示器 -->
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">加載中...</span>
                </div>
            </div>
            <div v-else-if="errors.carousel" class="alert alert-warning">
                {{ errors.carousel }} 
            </div>
            <div v-else-if="carouselImages && carouselImages.length" id="carouselExampleIndicators" class="carousel slide position-relative" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button v-for="(image,index) in carouselImages"
                        :key="'indicator-'+index"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        :data-bs-slide-to="index"
                        :class="{active:index===0}"
                        :aria-current="index===0"
                        :aria-label="'Slide' + (index +1)"
                        >
                    </button>
                </div>
                <div class="carousel-inner">
                    <div v-for="(image, index) in carouselImages" 
                        :key="index" 
                        :class="['carousel-item',{active:index === 0}]">
                        <img :src="getImageUrl(image.url)" class="d-block w-100" :alt="'圖片' + (index +1)">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" >
                    <span class="carousel-control-next-icon" aria-hidden="true" ></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

        </div>
    </div>
    <!-- 隨機推薦商品 -->
    <div class="sales-ranking mt-5" v-if="randomProducts && randomProducts.length > 0">
        <h2>為您推薦</h2>
        <div class="product-list">
            <div v-for="(product,index) in randomProducts"
                :key="index"
                class="product-item">
            <img :src="getProductImage(product.product_id)" class="product-thumbnail">
            <div>{{ index + 1 }}.{{ product.name }}</div>
            <div v-if="product.quantity_sold === '-'">熱門推薦</div>    
        </div>
        </div>
    </div>
    <!-- 七日銷售排行 -->
    <div class="sales-ranking mt-5" v-if="sevenDaySalesRanking && sevenDaySalesRanking.length >0">
        <h2>過去7日銷售排行</h2>
        <div class="product-list">
            <div v-for="(product, index) in sevenDaySalesRanking"
                :key="index" 
                class="product-item">
                <img :src="getProductImage(product.product_id)" class="product-thumbnail">
                <div>{{ index + 1 }}.{{ product.name }}</div>
                <div>賣出 {{ product.quantity_sold }}件</div>
            </div>
        </div>
    </div>

    <!-- 月銷售排行 -->
    <div class="sales-ranking mt-5" v-if=" monthSalesRanking && monthSalesRanking.length>0">
        <h2>過去30日銷售排行</h2>
        <div class="product-list">
                <div v-for="(product,index) in monthSalesRanking" 
                    :key="index"
                    class="product-item">
                    <img :src="getProductImage(product.product_id)" class="product-thumbnail">
                    <div>{{ index + 1 }}.{{ product.name }}</div> 
                    <div>賣出{{ product.quantity_sold }}件</div>
                </div>
            </div>
    </div>


    <!-- 特價商品倒數計時 -->
    <div class="countdown-special-offers mt-4" v-if="processedSpecialOffers.length > 0">
        <h2>特價倒數計時商品</h2>
        <div class="product-list">
                <div v-for="(offer, index) in processedSpecialOffers" 
                :key="index" class="product-item">
                <img :src="getProductImage(offer.product_id)" class="product-thumbnail">
                <div>{{ offer.name }} </div>
                <div>特價 {{ offer.price }}元</div>
                <div class="countdown-timer">
                    倒數{{ formatTime(offer.countdown) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api';
import axios from 'axios';
import { handleApiError } from '@/utils/errorHandler';
import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


const FALLBACK_DATA = {
        carouselImages:[
            {url:'/static/img/welcome.jpg'},
            {url:'/static/img/welcome.jpg'},
        ]
    };

export default {
    name: 'HomePage',
    beforeUnmount() {
                this.clearCountdownIntervals();
            },
    data() {
        return {
            isPageLoading: true,
            // 七日銷售排行
            sevenDaySalesRanking: [ ],
            // 月銷售排行
            monthSalesRanking: [ ],
            // 特價商品
            specialOffers: [ ],
            // 輪播圖片
            carouselImages: FALLBACK_DATA.carouselImages,
            // 產品列表
            products:[],
            // 儲存倒數計時
            countdownIntervals: [],
            isLoading:{
                sales: false,
                offers:false,
                carousel:false,
                products:false,
            },
            errors:{
                sales: null,
                offers: null,
                carousel: null,
                products: null,
            },
            randomProducts:[],

        }
    },
    async mounted(){
        try{
            await this.loadHomePageData();
            this.randomProducts = this.getRandomProducts();
            this.$nextTick(()=>{
                this.startCountdown();
                this.initializeCarousel();
            });
        }catch(error){
            console.error('Failed to load home page data',error);
        }
    },
    methods: {
        handleError(section, error) {
            console.error(`Error in ${section}:`, error.message || error);
            this.errors[section] = `無法加載 ${section} 數據，請稍後再試。`;
            if (section === 'carousel') {
                this.carouselImages = FALLBACK_DATA.carouselImages;
            }
        },
        async loadHomePageData(){
                // // 重置錯誤狀態
                // Object.keys(this.errors).forEach(key=>{
                //     this.errors[key] = null;
                // });
            // 並行加載所有數據
            try{
                await this.loadProductsData();

                await Promise.allSettled([
                this.loadSalesData(),
                this.loadOffersData(),
                this.loadCarouselData(),
                ]);
            }catch (error) {
                console.error('讀取主頁資料失敗', error);
            }
        },
        async loadSalesData(){
            this.isLoading.sales = true;
            try{
                console.log(this.$axios.defaults.baseURL); // 打印 Axios 的 baseURL

                const [sevenDaysResponse, monthResponse] = await Promise.all([
                    ApiService.rankingAPI.getRanking(7),
                    ApiService.rankingAPI.getRanking(30),
                ]);
                const sevenDaysSales = sevenDaysResponse.data || [];
                const monthSales = monthResponse.data || [];

                this.sevenDaySalesRanking = this.processSalesRanking(sevenDaysSales);
                console.log('Processed Seven Day Sales Ranking:', this.sevenDaySalesRanking);

                this.monthSalesRanking = this.processSalesRanking(monthSales);
                console.log('Processed Month Sales Ranking:', this.monthSalesRanking);

            } catch(error){
                console.error('加載銷售數據失敗',error);
                this.errors.sales = '無法加載銷售排行數據';
                this.sevenDaySalesRanking = [];
                this.monthSalesRanking = [];
            } finally{
                this.isLoading.sales = false;
            }
        },
        processSalesRanking(salesData){
            return salesData.map((item)=>{
                const productId = Number(item.product_id);
                const product = this.products.find((p) => p.id === productId);
                return{
                    product_id: productId,
                    name: product? product.name : `Product ID: ${productId}`,
                    quantity_sold: item.quantity_sold,
                    image:product && product.image ? `api${product.image}` : '/img/default-product.jpg',
                };
            })
            .slice(0,10);
        },
        async loadOffersData(){
            this.isLoading.offers = true;
            try{
                const response = await ApiService.specialOffersAPI.getAllSpecialOffers();
                this.specialOffers = response.data || [];
            } catch(error){
                console.error('加載特價商品失敗',error);
                this.errors.offers = '無法加載特價商品數據';
                this.specialOffers = [];
            } finally{
                this.isLoading.offers = false;
            }
        },
        async loadCarouselData(){
            this.isLoading.carousel = true;
            try{
                const response = await ApiService.carouselAPI.getCarouselImages();
                this.carouselImages = response.data || [];
                console.log('Loaded carousel images:', this.carouselImages);

            } catch(error){
                console.error('加載輪播圖片失敗',error);
                this.errors.carousel = '無法加載輪播圖片';
                this.carouselImages = FALLBACK_DATA.carouselImages;
            } finally{
                this.isLoading.carousel = false;
            }
        },
        async loadProductsData(){
            this.isLoading.products = true;
            try{
                    const response = await ApiService.productAPI.getAllProducts();
                this.products = response || [];
            } catch(error){
                console.error('加載商品數據失敗',error);
                this.errors.products = '無法加載商品列表';
                this.products = [];
            } finally{
                this.isLoading.products = false;
            }
        },
        convertToSortedRankingWithProducts(salesObject){
            return Object.entries(salesObject)
                    .map(([product_id,quantity_sold])=>{
                        const productId = Number(product_id);
                        const product = this.products.find(p => p.id === productId);
                        return {
                            product_id,
                            quantity_sold,
                            name:product ? product.name:'未知商品',
                            image:product ? product.image:'/img/wrong.png'
                        };
                    })
                    .sort((a, b)=>b.quantity_sold - a.quantity_sold)
                    .slice(0,5);
        },
        startCountdown(){
            this.clearCountdownIntervals();
            if(!this.specialOffers || this.specialOffers.length === 0) return;
    
            this.specialOffers.forEach((offer, index)=>{
                if (!offer.countdown) return;

                const interval = setInterval(()=> {
                    if (offer.countdown > 0) {
                        this.specialOffers[index] = {
                        ...offer,
                        countdown: offer.countdown - 1,
                        };
                    } else {
                        clearInterval(interval);
                    }
        }, 1000);
                    this.countdownIntervals.push(interval);
            });
        },
        clearCountdownIntervals() {
            this.countdownIntervals.forEach(interval => clearInterval(interval));
            this.countdownIntervals = [];
        },
        formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours}時${minutes}分${remainingSeconds}秒`;
        },
        getImageUrl(url){
            if (!url) return '/img/wrong.png';
            if (url.startsWith('http')) return url;
            return `api/img/carousel/${url.split('/').pop()}`;
        },
        getProductImage(productId){
            const id = Number(productId);
            const product = this.products.find(p => p.id === id);
            if(!product || !product.image){
                return '/img/wrong.png';
            } 
            return `api/img/products/${product.image.split('/').pop()}`;
        },
        getRandomProducts(count = 5){
            const shuffled = [...this.products];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, count).map(product =>({
                product_id:product.id,
                name: product.name,
                image: this.getProductImage(product.id),
                quantity_sold:'-'
            }));
        },
        initializeCarousel() {
            const carouselEl = document.getElementById('carouselExampleIndicators');
            if (carouselEl) {
                new bootstrap.Carousel(carouselEl, {
                    interval: 5000,
                    ride: true
                });
            }
        }
    },
    computed:{
        processedSpecialOffers() {
            if (!this.specialOffers || !this.products) return [];
            return this.specialOffers.map(offer => {
                const product = this.products.find(p => p.id === offer.product_id);
                return {
                    ...offer,
                    name: product ? product.name : '未知商品'
                };
            });
        },
    }
};

</script>

<style scoped>
.carousel-section{
    max-width:1200px;
    margin:0 auto;
    border-radius: 16px;
    overflow: hidden;
    position:relative;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.carousel-inner{
    position:relative;
    width:100%;
    border-radius: 16px;
}
.carousel-inner img{
    height:400px;
    object-fit:cover;
}
.carousel-item {
    /* 圖片顯示 */
    width: 100%;
    height: 450px; /* 固定高度 */
    overflow: hidden;
    transition: all 0.5s ease;
}
.carousel-item img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px ;
    transition: transform 0.5s ease;
}
.carousel-item img:hover{
    transform:scale(1.05);
}
.carousel-indicators{
    bottom: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
}
.carousel-indicators button{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    transition: all 0.3s ease;
}
.carousel-indicators button.active {
    width: 24px;
    border-radius: 12px;
    background-color: white;
}
.carousel-control-prev,
.carousel-control-next{
    position: absolute;
    top:50%;
    transform:translateY(-50%);
    width:50px;
    height:50px;
    background-color: rgba(0,0,0,0.5);/* 半透明背景 */
    border-radius: 50%;
    display:flex;
    align-items: center;
    justify-content: center;
    z-index:10 ;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}
.carousel-control-prev:hover,
.carousel-control-next:hover{
    opacity: 1;
}
.carousel-control-prev{
    left:20px;
}
.carousel-control-next{
    right:20px;
}
.loading-spinner{
    text-align: center;
    padding: 20px;
}
.alert{
    padding: 15px;
    margin-bottom:20px;
    border:1px solid transparent;
    border-radius: 4px;
}
.alert-warning{
    color:#856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
.countdown-timer{
    font-weight:bold;
    color:red;
}
.sales-ranking h3,
.countdown-special-offers h3 {
    text-align: left;
}
.product-list{
    display:flex;
    flex-wrap:wrap;
    gap:20px;
}

.product-item{
    border:1px solid #ddd;
    padding:10px;
    width:150px;
    text-align:center;
}

.product-item{
    border: 1px solid #ddd;
    padding: 10px;
    width:200px;
    text-align: center;
    display:flex;
    flex-direction: column;
    align-items: center;
}
.product-thumbnail{
    width: 100px;
    height:100px;
    object-fit: cover;
    margin-bottom:10px;
}
@media (max-width: 991px) {
    .carousel-section {
        margin-top: 30px; /* 在導航折疊時增加更多間距 */
    }
    
    .carousel-control-prev,
    .carousel-control-next {
        width: 30px;
        height: 30px;
    }

    .carousel-control-prev {
        left: 10px;
    }

    .carousel-control-next {
        right: 10px;
    }
}
@media (max-width: 767px) {
    .product-list {
        flex-direction: column;
        align-items: center;
    }
    .product-item {
        width: 100%;
        max-width: 300px;
    }
}

</style>
