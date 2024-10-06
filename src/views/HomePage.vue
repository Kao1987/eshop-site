<template>
    <div class="homepage container mt-5">
        <!-- 圖片輪播 -->
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button v-for="(image, index) in carouselImages" 
                :key="index" :data-bs-slide-to="index" 
                :class="{active: index === 0}">
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
    <!-- 過去七日銷售排行 -->
    <div class="sales-ranking mt-5">
        <h3>過去7日銷售排行</h3>
        <div class="product-list">
            <div v-for="(product,index) in processedSevenDaySalesRanking" 
                :key="index" class="product-item"
                >
                <div>{{ index + 1 }}.{{ product.name }} </div>
                <div>賣出 {{ product.quantity_sold }}件</div> 
            </div>
        </div>
    </div>

    <!-- 過去30天銷售排行 -->
    <div class="sales-ranking mt-5">
        <h3>過去30日銷售排行</h3>
        <div class="product-list">
            <div v-for="(product,index) in processedMonthSalesRanking" 
                :key="index"
                class="product-item">
                <div>{{ index + 1 }}.{{ product.name }}</div> 
                <div>賣出{{ product.quantity_sold }}件</div>
            </div>
        </div>
    </div>

    <!-- 特價商品倒數計時 -->
    <div class="countdown-special-offers mt-4">
        <h3>特價倒數計時商品</h3>
        <div class="product-list">
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
</template>

<script>
import axios from 'axios';

export default {
    name: 'HomePage',
    data() {
        return {
            // 七日銷售排行
            sevenDaySalesRanking: [ ],
            // 月銷售排行
            monthSalesRanking: [ ],
            // 特價商品
            specialOffers: [ ],
            // 輪播圖片
            carouselImages: [], 
            // 產品列表
            products:[],
            // 儲存倒數計時
            countdownIntervals: [],
        };
    },
    async mounted(){
        await this.loadHomePageData();
        this.startCountdown();
    },
    methods: {
        async loadHomePageData(){
            try{
                const [salesResponse, offersResponse,carouselResponse,productsResponse] = await Promise.all([
                    axios.get('/api/sales'),
                    axios.get('/api/special-offers'),
                    axios.get('/api/carousel-images'),
                    axios.get('/api/products'),
                ]);

                this.carouselImages = carouselResponse.data || [];
                this.products = productsResponse.data || [];
                this.specialOffers = offersResponse.data || [];

                const sales = salesResponse.data || [];
                this.processAndSetSalesRanking(sales);
            }catch(error){
                console.error('加載主頁時error', error);
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
            this.specialOffers.forEach((offer, index)=>{
                const interval = setInterval(()=> {
                    if(this.specialOffers[index].countdown > 0){
                        this.specialOffers[index].countdown--;
                    }else{
                        clearInterval(interval);
                        }
                    },1000);
                    this.clearCountdownIntervals.push(interval);
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
        beforeDestroy() {
            this.clearCountdownIntervals();
        },

    },
    computed:{
        processedSevenDaySalesRanking() {
        return this.sevenDaySalesRanking.map(sale => {
            const product = this.products.find(p => p.id === sale.product_id);
            return {
                ...sale,
                name: product ? product.name : '未知商品'
            };
        });
        },
        processedMonthSalesRanking() {
            return this.monthSalesRanking.map(sale => {
                const product = this.products.find(p => p.id === sale.product_id);
                return {
                    ...sale,
                    name: product ? product.name : '未知商品'
                };
            });
        },
        processedSpecialOffers() {
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
</style>
