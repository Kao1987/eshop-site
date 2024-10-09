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
            <div v-else-if="carouselImages && carouselImages.length" id="carouselExampleIndicators" class="carousel slide position-relative" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button v-for="(image,index) in carouselImages"
                            :key="'indicator-'+index"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            :data-bs-slide-to="index"
                            :class="{active:index===0}"
                            :aria-current="index===0"
                            :aria-labe="'Slide' + (index +1)"
                            >
                    </button>
                </div>
                <div class="carousel-inner">
                    <div v-for="(image, index) in carouselImages" 
                    :key="index" 
                    :class="['carousel-item',{active:index === 0}]">
                        <img :src="image.url" class="d-block w-100" :alt="'圖片' + (index +1)">
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
    <!-- 過去七日銷售排行 -->
    <div class="sales-ranking mt-5">
        <h3>過去7日銷售排行</h3>
        <div class="product-list">
            <div v-if="isLoading.sales" class="loading-spinner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">加載中...</span>
                </div>
            </div>
            <div v-else-if="errors.sales" class="alert alert-warning">
                {{ errors.sales }}
            </div>
            <div v-else class="product-list">
                <div v-for="(product, index) in processedSevenDaySalesRanking" 
                    :key="index" 
                    class="product-item">
                    <div>{{ index + 1 }}.{{ product.name }}</div>
                    <div>賣出 {{ product.quantity_sold }}件</div>
                </div>
            </div>

        </div>
    </div>

    <!-- 月銷售排行 -->
    <div class="sales-ranking mt-5">
        <h3>過去30日銷售排行</h3>
        <div class="product-list">
            <div v-if="isLoading.sales" class="loading-spinner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">加載中...</span>
                </div>
            </div> 
            <div v-else-if="errors.sales" class="alert alert-warning">
                {{ errors.sales }}
            </div>
            <div v-else class="product-list">
                <div v-for="(product,index) in processedMonthSalesRanking" 
                    :key="index"
                    class="product-item">
                    <div>{{ index + 1 }}.{{ product.name }}</div> 
                    <div>賣出{{ product.quantity_sold }}件</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 特價商品倒數計時 -->
    <div class="countdown-special-offers mt-4">
        <h3>特價倒數計時商品</h3>
        <div class="product-list">
            <div v-if="isLoading.offers" class="loading-spinner">
                <span class="visually-hidden">加載中...</span>
            </div>
            <div v-else-if="errors.offers" class="alert alert-warning">
                {{ errors.offers }}
            </div>
            <div v-else class="product-list">
                <div v-for="(offer, index) in processedSpecialOffers" 
                :key="index" class="product-item">
                <div>{{ offer.name }} </div>
                <div>特價 {{ offer.price }}元</div>
                <div class="countdown-timer">
                    倒數{{ formatTime(offer.countdown) }}秒
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const FALLBACK_DATA = {
        carouselImages:[
            {url:'/img/customer.webp'},
            {url:'/img/customer.webp'}
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

        }
    },
    async mounted(){
        try{
            await this.loadHomePageData();
            this.$nextTick(()=>{
                this.startCountdown();
            });
        }catch(error){
            console.error('Failed to load home page data',error);
        }
    },
    methods: {
        handleError(section,error){
            console.error(`Error in ${section}:`,error);
            this.errors[section] = `無法加載${section}數據`
        },
        async loadHomePageData(){
            // 重置錯誤狀態
            Object.keys(this.errors).forEach(key=>{
                this.errors[key] = null;
            });
            // 並行加載所有數據
            await Promise.all([
                this.loadSalesData(),
                this.loadOffersData(),
                this.loadCarouselData(),
                this.loadProductsData()
            ])
        },
        async loadSalesData(){
            this.isLoading.sales = true;
            try{
                const response = await axios.get('/api/sales');
                const sales = response.data || [];
                this.processAndSetSalesRanking(sales);
            } catch(error){
                console.error('加載銷售數據失敗',error);
                this.errors.sales = '無法加載銷售排行數據';
                this.sevenDaySalesRanking = [];
                this.monthSalesRanking = [];
            } finally{
                this.isLoading.sales = false;
            }
        },
        async loadOffersData(){
            this.isLoading.offers = true;
            try{
                const response = await axios.get('/api/special_offers');
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
                const response = await axios.get('/api/carousel_images');
                this.carouselImages = response.data || [];
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
                const response = await axios.get('/api/products');
                this.products = response.data || [];
            } catch(error){
                console.error('加載商品數據失敗',error);
                this.errors.products = '無法加載商品列表';
                this.products = [];
            } finally{
                this.isLoading.products = false;
            }
        },
        processAndSetSalesRanking(sales){
            const now = new Date();
            const sevenDayAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
            const sevenDaysSales = {};
            const monthSales = {};
            sales.forEach(sale=>{
                const saleDate = new Date(sale.sale_date);
                if(saleDate >= sevenDayAgo){
                    sevenDaysSales[sale.product_id] = (sevenDaysSales[sale.product_id] || 0) + sale.quantity_sold;
                }
                if(saleDate >= thirtyDaysAgo){
                    monthSales[sale.product_id] = (monthSales[sale.product_id] || 0) + sale.quantity_sold;
                }
            });
            this.sevenDaySalesRanking = this.convertToSortedArray(sevenDaysSales);
            this.monthSalesRanking = this.convertToSortedArray(monthSales);
        },
        convertToSortedArray(salesObject){
            return Object.entries(salesObject)
                    .map(([product_id,quantity_sold])=>({
                        product_id,
                        quantity_sold
                    }))
                    .sort((a, b)=>b.quantity_sold - a.quantity_sold)
                    .slice(0,5);
        },
        startCountdown(){
            this.clearCountdownIntervals();
            if(!this.specialOffers || this.specialOffers.length === 0) return;
    
            this.specialOffers.forEach((offer, index)=>{
                if(!offer.countdown)return;

                const interval = setInterval(()=> {
                    if(this.specialOffers[index].countdown && this.specialOffers[index].countdown > 0){
                        this.specialOffers[index].countdown--;
                    }else{
                        clearInterval(interval);
                        }
                    },1000);
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
    },
    computed:{
        processedSevenDaySalesRanking() {
            if(!this.sevenDaySalesRanking || !this.products) return [];
            return this.sevenDaySalesRanking.map(sale => {
                const product = this.products.find(p => p.id === sale.product_id);
                return {
                    ...sale,
                    name: product ? product.name : '未知商品'
                };
        });
        },
        processedMonthSalesRanking() {
            if (!this.monthSalesRanking || !this.products) return [];
            return this.monthSalesRanking.map(sale => {
                const product = this.products.find(p => p.id === sale.product_id);
                return {
                    ...sale,
                    name: product ? product.name : '未知商品'
                };
            });
        },
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
    margin-top:20px;
    position:relative;
    z-index:1;
}

.carousel-control-prev,
.carousel-control-next{
    position: absolute;
    top:50%;
    transform:translateY(-50%);
    width:40px;
    height:40px;
    background-color: rbga(0,0,0,0.5);/* 半透明背景 */
    border-radius: 50%;
    display:flex;
    align-items: center;
    justify-content: center;
    z-index:2 ;
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
.carousel-inner img{
    height:400px;
    object-fit:cover;
}
.countdown-timer{
    font-weight:bold;
    color:red;
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

</style>
