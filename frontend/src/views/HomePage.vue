<template>
    <div class="homepage container mt-5">
        <!-- 圖片輪播 -->
        <div class="carousel-section">
            <div v-if="isLoading.carousel" class="loading-spinner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">加載中...</span>
                </div>
            </div>

            <div v-else-if="errors.carousel" class="alert alert-warning">
                {{ errors.carousel }} 
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
                            <img :src="getImageUrl(image.url,'carousel')" 
                                class="d-block w-100" 
                                :alt="'商品圖片'">
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
                    <img :src="getProductImage(product.product_id)" class="product-image">
                    <div class="product-overlay">
                        <button class="view-details-btn" @click="viewDetails(product)">
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
import { getImageUrl } from '@/utils/imageUrl'; 


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
            sevenDaySalesRanking: [],
            // 月銷售排行
            monthSalesRanking: [],
            // 特價商品
            specialOffers: [],
            // 輪播圖片
            carouselImages: [],
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

        }
    },
    async mounted(){
        try{
            console.log('開始載入首頁資料');
            await this.loadHomePageData();
            if(this.carouselImages.length && this.carouselImages.length > 0){
                await this.$nextTick();
                this.initializeCarousel();
            }
            console.log('輪播圖片狀態:',{
                images:this.carouselImages,
                domElement:document.getElementById('mainCarousel'),
            });
        }catch(error){
            console.error('讀取首頁資料失敗',error);
        }
    },
    methods: {
        getImageUrl,
        handleError(section, error) {
            console.error(`Error in ${section}:`, error.message || error);
            this.errors[section] = `無法加載 ${section} 數據，請稍後再試。`;
            if (section === 'carousel') {
                this.carouselImages = FALLBACK_DATA.carouselImages;
            }
        },
        async loadHomePageData(){
            try{
                await this.loadProductsData();
                this.randomProducts = this.getRandomProducts(5);
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
                this.sevenDaySalesRanking = this.processSalesRanking(sevenDaysResponse || []);
                this.monthSalesRanking = this.processSalesRanking(monthResponse || []);

                console.log('Processed Seven Day Sales Ranking:', this.sevenDaySalesRanking);
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
            if(!Array.isArray(salesData)) return [];    

            return salesData.map((item)=>{
                const productId = Number(item.product_id);
                const product = this.products.find((p) => p.id === productId);
                return{
                    product_id: productId,
                    name: product? product.name : `Product ID: ${productId}`,
                    quantity_sold: item.sale_count || 0,
                    image: product && product.image ? product.image : '/img/wrong.png'
                };
            })
            .filter(item => item.quantity_sold > 0)  // 過濾掉銷售量為 0 的商品
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
                    console.log('讀取到的特價商品:', this.specialOffers);
                } 
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
                const response = await ApiService.carouselAPI.getAllCarouselImages();
                console.log('原始後端回傳:', response);

                if(Array.isArray(response)){
                    this.carouselImages = response.filter(image => image.visible);
                    console.log('載入的輪播圖片:', this.carouselImages);
                    await this.$nextTick();
                    if(this.carouselImages.length > 0){
                        this.initializeCarousel();
                        console.log(this.carouselImages);
                    }
                }else{
                    console.error('輪播圖的格式不正確',response);
                    this.carouselImages = FALLBACK_DATA.carouselImages;
                    await this.$nextTick();
                    this.initializeCarousel();
                    console.log(this.carouselImages);
                }
            } catch(error){
                console.error('加載輪播圖片失敗',error);
                this.errors.carousel = '無法加載輪播圖片';
                this.carouselImages = FALLBACK_DATA.carouselImages;
                await this.$nextTick();
                this.initializeCarousel();
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
        getImageUrl(url, type) {
            return getImageUrl(url, type);
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
            this.$router.push(`/product/${product.product_id}`);
        }
    },
    computed:{
        processedSpecialOffers() {
            if (!this.specialOffers || !this.products) return [];

            return [...this.specialOffers]
            .filter(offer => offer.countdown > 0)
            .map(offer => {
                const product = this.products.find(p => p.id === offer.product_id);
                return {
                    ...offer,
                    name: product ? product.name : '未知商品',
                    image: product ? product.image : '/img/wrong.png'
                };
            });
        },
    }
};

</script>

<style scoped>
/* 基礎設置 */
.homepage {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* 輪播區塊樣式 */
.carousel-section {
    max-width: 1200px;
    margin: 0 auto 3rem;
    padding: 0 0.5rem;
}

.carousel-inner {
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* 修改輪播圖片容器樣式 */
.carousel-image-container {
    position: relative;
    width: 100%;
    padding-top: 38%;
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

/* 自定義指示器 */
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
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
    padding-top: 100%;
    overflow: hidden;
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

.product-name {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
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
    }
    .carousel-image-container {
        padding-top: 45%;
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
        padding-top: 52%;
    }
    
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
}

/* 特價商品和銷售排行區塊樣式 */
.sales-ranking {
    max-width: 1000px; /* 與其他區塊保持一致 */
    margin: 3rem auto;
    padding: 0 1rem;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* 縮小商品卡片寬度 */
    gap: 1.5rem;
    padding: 1rem;
}

.product-item {
    max-width: 250px; /* 限制最大寬度 */
    margin: 0 auto;
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
}

.product-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-thumbnail {
    width: 100%;
    height: 180px; /* 縮小圖片高度 */
    object-fit: cover;
    border-radius: 0.8rem;
    margin-bottom: 1rem;
}

/* 響應式調整 */
@media (max-width: 768px) {
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    .product-thumbnail {
        height: 150px;
    }
}

@media (max-width: 576px) {
    .product-list {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    }

    .product-thumbnail {
        height: 130px;
    }

    .product-item {
        padding: 0.8rem;
    }
}
</style>
