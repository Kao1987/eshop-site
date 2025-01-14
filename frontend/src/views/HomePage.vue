<template>
    <div class="loading-overlay" v-if="isPageLoading">
        <img :src="loadingGif" alt="載入中" class="loading-gif">
    </div>
    <div class="homepage container mt-5">
        <!-- 輪播圖片載入中 -->
        <div class="carousel-section">
            <div v-if="isLoading.carousel" class="loading-spinner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">加載中...</span>
                </div>
            </div>
            <!-- 輪播圖片 -->
            <div v-else-if="carouselImages && carouselImages.length" 
                id="mainCarousel" 
                class="carousel slide position-relative carousel-fade"
                data-bs-ride="carousel">
                <!-- 指示器 -->
                <div class="carousel-indicators custom-indicators">
                    <button v-for="(image,index) in carouselImages"
                        :key="'indicator-'+index"
                        type="button"
                        data-bs-target="#mainCarousel"
                        :data-bs-slide-to="index"
                        :class="{active:index===0}"
                        :aria-current="index===0"
                        :aria-label="'Slide' + (index +1)"
                        class="indicator-dot"
                        >
                    </button>
                </div>
                <!-- 輪播圖片內容、 -->
                <div class="carousel-inner rounded-4 shadow-lg">
                    <div v-for="(image, index) in carouselImages" 
                        :key="'slide-'+index" 
                        :class="['carousel-item',{active:index === 0}]">
                        <div class="carousel-image-container">
                            <img :src="$getImageUrl(image.url,'carousel')" 
                                class="d-block w-100" 
                                :alt="'輪播圖片'"
                                @error="handleCarouselImageError">
                        </div>
                    </div>
                </div>

                <button class="carousel-control-prev custom-control" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                    <button class="carousel-control-next custom-control" type="button" data-bs-target="#mainCarousel" data-bs-slide="next" >
                    <span class="carousel-control-next-icon" aria-hidden="true" ></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

        </div>
    </div>
    <!-- 隨機推薦商品 -->
    <div class="product-section mt-5" v-if="randomProducts && randomProducts.length > 0">
        <div class="section-header">
            <h2 class="section-title">為您推薦</h2>
            <div class="section-subtitle">精選優質商品，專屬於您</div>
        </div>
        <div class="product-grid">
            <div v-for="(product,index) in randomProducts"
                :key="index"
                class="product-card"
                :style="{ animationDelay: index * 0.1 + 's' }"
            >
                <div class="product-image-wrapper">
                    <img :src="$getImageUrl(product.image,'product')" class="product-image" @error="handleImageError">
                    <div class="product-overlay">
                        <button class="view-details-btn" @click="viewDetails(product)" :disabled="!product || !product.id">
                            查看詳情
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <div class="product-tag" v-if="product.quantity_sold === '-'">熱門推薦</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 添加分隔線 -->
    <div class="section-divider"></div>

    <!-- 七日銷售排行 -->
    <div class="sales-ranking mt-5">
        <h2>過去7日銷售排行</h2>
        <div v-if="isLoading.sales">載入中...</div>
        <div v-else-if="errors.sales">{{ errors.sales }}</div>
        <div v-else-if="sevenDaySalesRanking.length === 0">暫無銷售數據</div>
        <div class="product-list">
            <div v-for="(product, index) in sevenDaySalesRanking"
                :key="index" 
                class="product-item">
                <div class="product-thumbnail-wrapper">
                    <img :src="$getImageUrl(product.image,'product')" 
                        class="product-thumbnail" 
                        @error="handleImageError">
                        <div class="product-overlay">
                            <button class="view-details-btn" 
                                    @click="viewDetails(product)" 
                                    :disabled="!product || !product.id">
                            查看詳情
                            </button>
                        </div>
                </div>
                <div class="product-details">
                    <div class="range-name">銷售排行第
                        <span class="range-number" :class="rankClass[index + 1]">{{ index + 1 }}</span>名
                    </div>
                        <div class="product-name">{{ product.name }}</div>
                    <div class="sales-count">賣出 {{ product.sales_count }} 件</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 添加分隔線 -->
    <div class="section-divider"></div>

    <!-- 月銷售排行 -->
    <div class="sales-ranking mt-5">
        <h2>過去30日銷售排行</h2>
        <div v-if="isLoading.sales">載入中...</div>
        <div v-else-if="errors.sales">{{ errors.sales }}</div>
        <div v-else-if="monthSalesRanking.length === 0">暫無銷售數據</div>
        <div class="product-list">
                <div v-for="(product,index) in monthSalesRanking" 
                    :key="index"
                    class="product-item">
                    <div class="product-thumbnail-wrapper">
                        <img :src="$getImageUrl(product.image,'product')" 
                            class="product-thumbnail" 
                            @error="handleImageError">
                            <div class="product-overlay">
                                <button class="view-details-btn" 
                                        @click="viewDetails(product)" 
                                        :disabled="!product || !product.id">
                                查看詳情
                                </button>
                            </div>
                    </div>
                    <div class="product-details">
                        <div class="range-name">銷售排行第
                            <span class="range-number" :class="rankClass[index + 1]">{{ index + 1 }}</span>名
                        </div>
                        <div class="product-name">{{ product.name }}</div>
                        <div class="sales-count">賣出 {{ product.sales_count }} 件</div>
                    </div>
                </div>
            </div>
    </div>

    <!-- 添加分隔線 -->
    <div class="section-divider"></div>

    <!-- 特價商品倒數計時 -->
    <div class="sales-ranking mt-4" v-if="processedSpecialOffers.length > 0">
        <h2>特價倒數計時商品</h2>
        <div class="product-list">
            <div v-for="(offer, index) in processedSpecialOffers" :key="index" class="product-item">
                <div class="product-thumbnail-wrapper">
                    <img :src="$getImageUrl(offer.image,'product')" 
                        class="product-thumbnail" 
                        @error="handleSpecialOfferImageError">
                    <div class="product-overlay">
                        <button class="view-details-btn"
                                @click="viewDetailsById(offer.product_id)"
                                :disabled="!offer.product_id">
                            查看詳情
                        </button>
                    </div>
                </div>
                <div class="product-details">
                    <div class="product-name">{{ offer.name }}</div>
                    <div class="price" style="color:red;">特價 {{ formatPrice(offer.price) }}元</div>
                    <div class="countdown-timer" :class="offer.status">
                        {{ offer.status === 'upcoming' ? '即將開始' : '剩餘時間' }}
                        倒數{{ formatTime(offer.countdown) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api';
import axios from 'axios';
import { handleApiError } from '@/utils/errorHandler';
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadingGif from '@/assets/loading.gif' 


const FALLBACK_DATA = {
        carouselImages:[
        {url:'/static/img/happynewyear.png'},
        {url:'/static/img/welcome.jpg'},
        ]
    };

export default {
    name: 'HomePage',
    data() {
        return {
            isPageLoading: true,
            loadingTimeout: null,
            loadingGif,
            // 七日銷售排行
            sevenDaySalesRanking: [],
            // 月銷售排行
            monthSalesRanking: [],
            // 特價商品
            specialOffers: [],
            // 產品列表
            products: [],
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
            randomProducts:null,
            carouselImages: [...FALLBACK_DATA.carouselImages],
            rankClass: {
                '1': 'gold',
                '2': 'silver',
                '3': 'bronze',
            },

        }
    },
    async mounted(){
        this.loadingTimeout = setTimeout(()=>{
            if(this.isPageLoading){
                window.location.reload();
            }
        }, 10000);
        // console.log('環境變數:', {
        //     API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
        //     CAROUSEL_IMAGE_URL: process.env.VUE_APP_CAROUSEL_IMAGE_BASE_URL,
        //     PRODUCT_IMAGE_URL: process.env.VUE_APP_PRODUCT_IMAGE_BASE_URL
        // });
        try{
            await this.loadHomePageData();
            if(this.carouselImages.length > 0){
                await this.$nextTick();
                this.initializeCarousel();
            }
            // console.log('輪播圖片狀態:',{
            //     images:this.carouselImages,
            //     domElement:document.getElementById('mainCarousel'),
            // });
            this.startCountdown();
        }catch(error){
            console.error('讀取首頁資料失敗',error);
        }finally{
            this.isPageLoading = false;
            clearTimeout(this.loadingTimeout);
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
        handleSpecialOfferImageError(e) {
        if (!e || !e.target) return;
        e.target.onerror = null;
            e.target.src = '/img/wrong.png';
        },
        handleCarouselImageError(e){
            if (!e || !e.target) return;
            if (e.target.src.includes('happynewyear.png')) return;
            e.target.onerror = null;
            e.target.src = '/static/img/happynewyear.png'
        },
        async loadHomePageData(){
            try{
                await this.loadProductsData();
                this.randomProducts = this.getRandomProducts(5);
                await this.loadCarouselData();

                setTimeout(() => {
                    this.loadSalesData();
                    this.loadOffersData();
                },2000);

            }catch (error) {
                console.error('獲取主頁資料失敗', error);
            }
        },
        async loadSalesData(){
            this.isLoading.sales = true;
            try{
                const [resp7, resp30] = await Promise.all([
                    ApiService.rankingAPI.getRanking(7),
                    ApiService.rankingAPI.getRanking(30),
                ]);
                // console.log('原始銷售數據:', resp7.data, resp30.data);
                if(resp7.success && Array.isArray(resp7.data)){
                    this.sevenDaySalesRanking = this.processSalesRanking(resp7.data);
                }else{
                    this.sevenDaySalesRanking = [];
                }    
                // console.log('處理後的銷售數據:', this.sevenDaySalesRanking);
                if(resp30.success && Array.isArray(resp30.data)){
                    this.monthSalesRanking = this.processSalesRanking(resp30.data);
                }else{
                    this.monthSalesRanking = [];
                }
                // console.log('月排行:', this.monthSalesRanking);
            } catch(error){
                console.error('銷售數據載入失敗:', error);
            } finally{
                this.isLoading.sales = false;
            }
        },
        processSalesRanking(salesData){
            if(!Array.isArray(salesData)) return [];    

            return salesData.map((item)=>{
                return{
                    id: item.id,
                    name: item.name,
                    sales_count: item.sales_count || 0,
                    image: item.image ? this.$getImageUrl(item.image,'product') : '/img/wrong.png'
                };
            })
            .filter(item => item.sales_count > 0) 
            .slice(0,10);
        },
        async loadOffersData(){
            this.isLoading.offers = true;
            try{
                const response = await ApiService.specialOffersAPI.getAllSpecialOffers();
                if(response && Array.isArray(response)){
                    this.specialOffers = response.map(offer => ({
                        ...offer,
                        countdown: offer.countdown || 36000, //預設倒數時間
                        product_id: Number(offer.product_id),
                    }));
                    // console.log('讀取到的特價商品:', this.specialOffers);
                } 
            } catch(error){
                console.error('加載特價商品失敗',error);
                this.errors.offers = '無法加載特價商品數據';
                this.specialOffers = [];
            } finally{
                this.isLoading.offers = false;
            }
        },
        async loadCarouselData() {

            try {
                const response = await ApiService.carouselAPI.getAllCarouselImages();
                
                if (Array.isArray(response) && response.length > 0) {
                    this.carouselImages = response
                    .filter(image => image.visible)
                    .map(image => ({
                        ...image,
                        url: this.$getImageUrl(image.url,'carousel')
                    }));
                    // console.log('處理後的輪播圖數據:', this.carouselImages);
                } else {
                    this.carouselImages = FALLBACK_DATA.carouselImages;
                }
            } catch (error) {
                console.error('載入輪播圖失敗:', error);
                this.carouselImages = FALLBACK_DATA.carouselImages;
            }finally{
                this.isLoading.carousel = false;
            }
        },
        async loadProductsData(){
            this.isLoading.products = true;
            try{
                    const response = await ApiService.productAPI.getAllProducts();
                    // console.log('商品資料:', response); // 檢查資料結構
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
            
            const updateAllCountdowns = ()=>{
                const now = Date.now();
                this.specialOffers = this.specialOffers.map(offer => {
                    const startTime = new Date(offer.start_time).getTime();
                    const endTime = offer.end_time ? new Date(offer.end_time).getTime()
                                    : startTime + offer.duration * 1000;

                    let remainingTime = 0;
                    let status = 'active';

                    if(now < startTime){
                        remainingTime = startTime - now;
                        status = 'upcoming';
                    }else if(now >= endTime && now <=endTime){
                        remainingTime = endTime - now;
                        status = 'active';
                    }else{
                        remainingTime = 0;
                        status = 'ended';
                    }
                    return {
                        ...offer,
                        countdown: Math.floor(remainingTime / 1000),
                        status,
                    };
                });
            };
            updateAllCountdowns();
            const interval = setInterval(updateAllCountdowns, 1000);
            this.countdownIntervals.push(interval);
        },
        clearCountdownIntervals() {
            this.countdownIntervals.forEach(interval => clearInterval(interval));
            this.countdownIntervals = [];
        },
        formatTime(seconds) {
            if(seconds <= 0) return '已結束';

            const days = Math.floor(seconds / (24*3600));
            const hours = Math.floor((seconds % (24*3600)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            if(days > 0){
                return `${days}天${hours}時${minutes}分${remainingSeconds}秒`;
            }else if(hours > 0){
                return `${hours}時${minutes}分${remainingSeconds}秒`;
            }else if(minutes > 0){
                return `${minutes}分${remainingSeconds}秒`;
            }else{
                return `${remainingSeconds}秒`;
            }
        },
        getProductImage(productId) {
            const product = this.products.find(p => p.id === Number(productId));
            return product && product.image
                ? this.$getImageUrl(product.image,'product')
                : '/img/wrong.png';
        },
        getRandomProducts(count = 5){
            const shuffled = [...this.products];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, count).map(product =>({
                ...product,
                quantity_sold:'-'
            }));
        },
        initializeCarousel() {
            this.$nextTick(() => {
                const carouselElement = document.getElementById('mainCarousel');
                if (carouselElement) {
                    new bootstrap.Carousel(carouselElement, {
                        interval: 5000,
                        touch: true,  // 支援觸控滑動
                        pause: 'hover', // 滑鼠懸停時暫停
                        keyboard: true // 支援鍵盤控制
                    });
                }
            });
        },
        viewDetails(product) {
            console.log('查看商品:', product); // 檢查傳入的商品資料
            if(product && product.id){
                this.$router.push({
                    name:'ProductDetail',
                    params:{
                        id:String(product.id)
                    }
                });
            }else{
                console.error('無效的商品ID:', product);
                this.$store.dispatch('notifications/showNotification', {
            type: 'error',
                    message: '無法查看商品詳情，請稍後再試'
                });

            }
        },
        formatPrice(price) {
            if (!price && price !== 0) return '0';
            return price.toLocaleString('zh-TW', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        },
    },
    beforeUnmount(){
        this.clearCountdownIntervals();
        if(this.isPageLoading){
            clearTimeout(this.loadingTimeout);
        }
    },
    computed:{
        processedSpecialOffers() {
            const now = Date.now();
            return [...this.specialOffers]
            .filter(offer => {
                const startTime = new Date(offer.start_time).getTime();
                const endTime = new Date(offer.end_time).getTime();
                return( 
                    ((now >= startTime && now <= endTime) || now<startTime) 
                    && offer.countdown > 0 
                    && offer.price >0
                );
            })
            .sort((a,b)=> {
                if(a.status !==b.status){
                    return a.status === 'active' ? -1 : 1;
                }
                return a.countdown - b.countdown;
            });
        },
    }
};

</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-gif {
    max-width: 200px;
    max-height: 200px;
}

.homepage.container {
    max-width: 1200px;  /* 大螢幕最大寬度 */
    width: 95%;         /* 響應式寬度 */
    margin: 0 auto;
    padding: 0 15px;
    margin-top: 2rem !important;    /* 與 header 的間距 */
}

/* 輪播區塊樣式 */
.carousel-section {
    max-width: 780px;   /* 1200px * 0.65 = 780px */
    width: 100%;
    margin: 0 auto;
}

.carousel-inner {
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.carousel-image-container {
    position: relative;
    width: 100%;
    padding-top: 42%;   /* 16:9 的黃金比例（56% * 0.75） */
}

.carousel-image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f8f9fa;
}

/* 定義指示器 */
.custom-indicators {
    bottom: 20px;
}

.indicator-dot {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    background-color: rgba(255,255,255,0.5) !important;
    border: 2px solid rgba(255,255,255,0.7) !important;
    margin: 0 6px !important;
}

.indicator-dot.active {
    background-color: #fff !important;
    transform: scale(1.2);
}

/* 商品區塊樣式 */
.product-section {
    max-width: 1000px;
    margin: 3rem auto;
    padding: 0 1rem;
}

.section-header {
    text-align: center;
    margin-bottom: 2rem;
}

.section-title {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    color: #666;
    font-size: 1.1rem;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* 商品卡片最佳寬度 */
    gap: 24px;  /* 商品之間的間距 */
    padding: 1.5rem;
}

.product-card {
    max-width: 280px;
    margin: 0 auto;
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-image-wrapper {
    position: relative;
    padding-top: 100%;  /* 1:1 的商品圖片比例 */
    overflow: hidden;
}
.product-item:hover .product-thumbnail {
  transform: scale(1.05); /* 與 product-card 一致的放大效果 */
}

.product-item:hover .product-overlay {
  opacity: 1; /* 顯示浮層 */
}

.product-item:hover .view-details-btn {
  transform: translateY(0); /* 按鈕上移動態 */
}
.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
    opacity: 1;
}

.view-details-btn {
    padding: 0.8rem 1.5rem;
    background: white;
    border: none;
    border-radius: 2rem;
    font-weight: 600;
    transform: translateY(20px);
    transition: all 0.3s ease;
}

.product-card:hover .view-details-btn {
    transform: translateY(0);
}

.product-info {
    padding: 1.5rem;
}

.range-name {
    white-space: nowrap;
    text-align: center;
    font-size: 1.5rem;   
    margin-bottom: 0.5rem;
    font-weight: bold;    /* 新增粗體 */
}
.range-number {
    font-weight: bold;
    color: white;
    background-color: #3498db;  
    padding: 0.4rem 0.8rem;   
    border-radius: 1rem;        
    min-width: 2rem;         
    display: inline-block;    
    text-align: center;       
    margin: 0 0.3rem;         
    line-height: 1.2; 
    box-sizing: border-box;         
}
.range-number.gold {
    background-color: #f1c40f;
    background-image: linear-gradient(145deg, #f1c40f, #ffd700);
}

.range-number.silver {
    background-color: #bdc3c7;
    background-image: linear-gradient(145deg, #bdc3c7, #c0c0c0);
}

.range-number.bronze {
    background-color: #cd7f32;
    background-image: linear-gradient(145deg, #cd7f32, #d4a068);
}

.product-name {
    text-align: center;
    font-size: 1.5rem;   
    line-height: 1.5;
    margin-bottom: 0.5rem;
    font-weight: bold;    
    white-space: wrap;
    background-color: linear-gradient(145deg,rgba(66,185,131,0.1),rgba(52,152,219,0.1));
    border-radius: 0.5rem;
    transition: background-color 0.3s ease;
}
.product-card:hover .product-name,
.product-item:hover .product-name {
    background: linear-gradient(145deg, rgba(66, 185, 131, 0.15), rgba(52, 152, 219, 0.15));
}
.product-tag {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    background: linear-gradient(135deg, #42b983, #3498db);
    color: white;
    border-radius: 1rem;
    font-size: 0.9rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
    }
    
    .section-title {
        font-size: 1.5rem;
    }
    
    .product-name {
        font-size: 1rem;
        white-space: nowrap;
    }
    .range-name {
        font-size: 1.2rem;
        white-space: nowrap;

    }
    .range-number {
        font-size: 1rem;
        padding: 0.3rem 0.6rem;
    }
    .carousel-image-container {
        padding-top: 90%;
    }
    
    .carousel-image-container img {
        object-fit: cover;
    }
}
@media (max-width: 576px) {
    .carousel-section {
        padding: 0;
    }
    
    .carousel-image-container {
        padding-top: 104%;
    }
    
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
    .range-number {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
    }
}

/* 特價商品和銷售排行區塊樣式 */
.sales-ranking {
    max-width: 1000px;
    margin: 3rem auto;
    padding: 0 1rem;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 1rem;
}

.countdown-special-offers .product-item {
    width: 100%;
    margin: 0;
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

/* 如有額外需要一致的圖片與文字區塊樣式，亦可同步調整 */
.countdown-special-offers .product-thumbnail-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%;  /* 維持1:1比例 */
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 1rem;
}
.countdown-special-offers .product-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.countdown-special-offers .price,
.countdown-special-offers .countdown-timer {
    font-size: 1rem;
    color: #333;
    margin-top: 0.5rem;
}
/* 特別設定倒數時間文字顏色 */
.countdown-special-offers .countdown-timer {
    color: #e74c3c;
    font-weight: bold;
}

.product-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-thumbnail-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.product-thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.sales-count {
    text-align: center;
    font-size: 1.2rem;
    color:crimson;
}

/* 響應式調整 */
@media (max-width: 992px) {
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
    }
    
    .product-item {
        padding: 0.8rem;
    }
}

@media (max-width: 576px) {
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
    }
    
    .product-name {
        font-size: 0.9rem;
    }
    
    .sales-count {
        font-size: 0.8rem;
    }
}

/* 統一商品網格樣式基礎設定 */
.product-grid,
.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* 統一商品卡片基礎樣式 */
.product-card,
.product-item {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

/* 統一商品圖片容器樣式 */
.product-image-wrapper,
.product-thumbnail-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%; /* 1:1 比例 */
    overflow: hidden;
}

/* 統一商品圖片樣式 */
.product-image,
.product-thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 商品資訊區塊統一樣式 */
.product-info,
.product-details {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
/* 統一推薦商品卡片樣式 */
.product-grid .product-card {
    width: 100%;
    max-width: none; /* 移除原本的 max-width: 280px 限制 */
    margin: 0;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 統一推薦商品圖片容器樣式 */
.product-grid .product-image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%; /* 確 1:1 的比例 */
    overflow: hidden;
}

.product-grid .product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 統一商品資訊區塊樣式 */
.product-grid .product-info {
    padding: 1rem;
    text-align: center;
}

/* 確保網格布局一致 */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 1rem;
}
/* 文字大小最佳實踐 */
.section-title {
    font-size: 2rem;      /* 32px */
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: 1.125rem;  /* 18px */
    margin-bottom: 2rem;
}

.product-name {
    font-size: 1rem;      /* 16px */
    line-height: 1.5;
    margin-bottom: 0.5rem;
    font-weight: bold;    /* 新增粗體 */
}

.product-name {
    font-weight: bold;    /* 新增粗體 */
    white-space: wrap;
}
/* 響應式設計調整 */
@media (max-width: 1600px) {
    .homepage.container {
        max-width: 90vw;
    }
}
@media (max-width: 1200px) {
    .product-grid,
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
    }
    .homepage.container {
        max-width: 960px;
    }
    .carousel-section {
        max-width: 624px;  /* 960px * 0.65 */
    }
}
@media (max-width: 992px) {
    .homepage.container {
        max-width: 95vw;
        padding: 0 10px;
    }
    .homepage.container {
        max-width: 720px;
    }
    .carousel-section {
        max-width: 720px; 
    }
    .carousel-image-container {
        padding-top: 48%; 
    }
}

@media (max-width: 768px) {
    .section-title {
        font-size: 1.75rem;  /* 28px */
    }
    .section-subtitle {
        font-size: 1rem;     /* 16px */
    }
    .homepage.container {
        width: 100%;
        max-width: 100%;
        padding: 0 8px;
    }
    
    .carousel-image-container {
        padding-top: 57.33%; /* 81.9% * 0.7 = 57.33% */
    }
    .product-grid,
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
    }
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
    }
}

@media (max-width: 576px) {
    .homepage.container {
        width: 100%;
        padding: 0 5px;
    }
    
    .carousel-image-container {
        padding-top: 66.25%; /* 94.64% * 0.7 = 66.25% */
    }
    .product-grid,
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
    }

}

/* 新增分隔線樣式 */
.section-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, #e0e0e0, transparent);
    margin: 4rem auto;    /* 區塊之間的間距 */
    position: relative;
}

.section-divider::before {
    content: '✦';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 0 1rem;
    color: #42b983;
    font-size: 1.2rem;
}

/* 響應式設計最佳實踐 */
@media (max-width: 1400px) {
    .homepage.container {
        max-width: 1140px;
    }
    .carousel-section {
        max-width: 741px;  /* 1140px * 0.65 */
    }
}



</style>
