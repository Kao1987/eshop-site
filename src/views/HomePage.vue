<template>
    <div class="homepage container mt-5">
        <!-- 圖片輪播 -->
        <div id="carouselEaxmpleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselEaxmpleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselEaxmpleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselEaxmpleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="/path/to/image1.jpg" class="d-block w-100" alt="商品1">
                </div>
                <div class="carousel-item active">
                    <img src="/path/to/image2.jpg" class="d-block w-100" alt="商品2">
                </div>
                <div class="carousel-item active">
                    <img src="/path/to/image3.jpg" class="d-block w-100" alt="商品3">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button>
                <span class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" ></span>
                <span class="viusally-hidden">Next</span>
            </button>
        </div>
    </div>
    <!-- 過去七日銷售排行 -->
    <div class="sales-ranking mt-5">
        <h3>過去7日銷售排行</h3>
        <div class="product-list">
            <div v-for="(product,index) in sevenDaySalesRanking" :key="index">
                {{ index + 1 }}.{{ product.name }} - 賣出 {{ product.sales }}件
            </div>
        </div>
    </div>

    <!-- 過去30天銷售排行 -->
    <div class="sales-ranking mt-5">
        <h3>過去30日銷售排行</h3>
        <div class="product-list">
            <div v-for="(product,index) in monthSalesRanking" :key="index">
                {{ index + 1 }}.{{ product.name }} - 賣出 {{ product.sales }}件
            </div>
        </div>
    </div>

    <!-- 特價商品倒數計時 -->
    <div class="countdown-special-offers mt-4">
        <h3>特價倒數計時商品</h3>
        <div class="product-list">
            <div v-for="(item, index) in speciaOffers" :key="index">
                {{ item.name }} - 價格 {{ item.price }}元
                <span class="countdown-timer">倒數{{ item.countdown }}秒</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
    return {
        // 七日銷售排行
        sevenDaySalesRanking: [
            { name: '商品1', sales: 100 },
            { name: '商品2', sales: 200 },
            { name: '商品3', sales: 300 },

        ],
        // 月銷售排行
        monthSalesRanking: [
            { name: '商品1', sales: 500 },
            { name: '商品2', sales: 600 },
            { name: '商品3', sales: 700 },
            
        ],
        // 特價商品
        speciaOffers: [
            { name: '特價商品1', price: 1000, countdown: 120 },
            { name: '特價商品2', price: 2000, countdown: 180 },
            { name: '特價商品3', price: 5000, countdown:1000},
    ],
    };
    },
    methods: {
        startCountdown(){
            this.speciaOffers.forEach((item, index)=>{
                const timer = setInterval(()=> {
                    if(item.countdown > 0){
                        this.speciaOffers[index].countdown--;
                    }else{
                        clearInterval(timer);
                        }
                    },1000);
            });
        }
    },
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
    padding:10 px;
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
