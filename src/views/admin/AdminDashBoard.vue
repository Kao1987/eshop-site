<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">管理後台儀表板</h2>
            <!-- 管理功能連結 -->
            <div class="button-container">
                <div class="button-item">
                <router-link to="/admin/CarouselImages" class="btn btn-primary btn-block">輪播圖片管理</router-link>
                </div>
                <div class="button-item">
                <router-link to="/admin/products" class="btn btn-primary btn-block">商品管理</router-link>
                </div>
                <div class="button-item">
                <router-link to="/admin/orders" class="btn btn-primary btn-block">訂單管理</router-link>
                </div>
                <div class="button-item">
                <router-link to="/admin/users" class="btn btn-primary btn-block">使用者管理</router-link>
                </div>
        </div>
        <!-- 儀表板顯示數據 -->
        <div class="row text-center mt-4">
            <div class="col-md-3">
                <h4>今日訂單數量</h4>
                <P>{{ todayOrders }}</P>
            </div>
            <div class="col-md-3">
                <h4>今日銷售金額</h4>
                <P>{{ todaySales }}</P>
            </div>
            <div class="col-md-3">
                <h4>昨日銷售金額</h4>
                <P>{{ yesterdaySales }}</P>
            </div>
            <div class="col-md-3">
                <h4>過去七日銷售金額</h4>
                <P>{{ last7DaySales }}</P>
            </div>
        </div>
        <!-- 曲線圖 -->
        <div class="row mt-5">
            <div class="col-12">
                <h4>每日銷售趨勢圖</h4>
                <canvas id="salesChart"></canvas> 
            </div>
        </div>

        <!-- 低庫存提醒 -->
        <div class="row mt-5">
            <div class="col-12">
                <h4>低庫存商品提醒</h4>
                <ul>
                    <li v-for="(product, index) in lowStockProducts" :key="index">
                        {{ product.name }} - 銷售數量:{{ product.sales }} ，庫存:{{ product.stock }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-md-6">
                <h4>今日註冊會員</h4>
                <p>{{ todayNewMembers }}</p>
            </div>
            <div class="col-md-6">
                <h4>累積會員數</h4>
                <p>{{ totalMembers }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default{
        name:'AdminDashboard',
        data(){
            return{
                todayOrders: 0,
                todaySales: 0,
                yesterdaySales: 0,
                last7DaySales: 0,
                salesData: [],
                lowStockProducts: [],
                todayNewMembers: 0,
                totalMembers: 0,
                carouselImages: [],
                products:[],
                sevenDaySalesRanking:[],
                monthSalesRanking:[],
            }
        },
        async mounted(){
            await this.loadDashboardData();
            this.renderSalesChart();
        },
        methods:{
            async loadDashboardData(){
                try{
                    // 加載輪播圖片
                    const carouselResponse = await axios.get('/api/carousel_images');
                    this.carouselImages = carouselResponse.data || [];
                    // 加載各項數據
                    const [salesResponse,orderResponse,membersResponse] = await Promise.all([
                        axios.get('/api/sales'),
                        axios.get('api/orders'),
                        axios.get('/api/members')
                    ]);
                    const sales = salesResponse.data;
                    const orders = orderResponse.data;
                    const members = membersResponse.data;
                    this.todaySales = sales.today;
                    this.yesterdaySales = sales.yesterday;
                    this.last7DaySales = sales.last7Days;
                    // 今日訂單數量
                    const today = new Date().toISOString().split('T')[0];
                    this.todayOrders = orders.filter(order =>order.orderDate === today).length;
                    // 計算今日跟昨日銷售金額
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate()-1);
                    // const yesterdayStr = yesterday.toISOString().split('T')[0];
                    
                    // this.todaySales = orders
                    //     .filter(order => order.orderDate === today)
                    //     .reduce((sum,order) => sum + order.total,0);
                    
                    // this.yesterdaySales = orders
                    //     .filter(order => order.orderDate === yesterdayStr)
                    //     .reduce((sum, order) => sum + order.total,0);
                    // 計算過去七日銷售金額
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

                    // this.last7DaySales = orders
                    //     .filter(order => order.orderDate >= sevenDaysAgoStr && order.orderDate <= today)
                    //     .reduce((sum, order) => sum + order.total,0);
                    // 計算七日銷售排行
                    const recentOrders = orders.filter(order =>order.orderDate >=sevenDaysAgoStr && order.orderDate <= today);
                    const salesMap ={};
                    recentOrders.forEach(order=>{
                        order.items.forEach(item=>{
                            if(salesMap[item.productId]){
                                salesMap[item.productId].sales += item.quantity;
                            }else{
                                salesMap[item.productId] = {name:item.productName,sales:item.quantity};
                            }
                        });
                    });
                    this.sevenDaySalesRanking = Object.values(salesMap).sort((a,b)=>b.sales - a.sales).slice(0,10);
                    // 計算月銷售排行
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() -30);
                    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
                    
                    const monthOrders = orders.filter(order => order.orderDate >= thirtyDaysAgoStr && order.orderDate<= today);
                    const monthSalesMap = {};
                    monthOrders.forEach(order=>{
                        order.items.forEach(item=>{
                            if(monthSalesMap[item.productId]){
                                monthSalesMap[item.productId].sales += item.quantity;
                            }else{
                                monthSalesMap[item.productId] = {name:item.productName,sales: item.quantity};
                            }
                        });
                    });
                    this.monthSalesRanking = Object.values(monthSalesMap).sort((a,b)=>b.sales - a.sales).slice(0,10);
                    // 今日會員與累積會員
                    const todayNewMembers = members.filter(member => {
                        const memberDate = new Date (member.created_at).toISOString().split('T')[0];
                        return memberDate === today;
                    }).length;
                    this.todayNewMembers = todayNewMembers;
                    this.totalMembers = members.length;
                    // 低庫存產品提醒
                    this.lowStockProducts =orders.flatMap(order=>order.items)
                        .reduce((map,item)=>{
                            if(!map[item.productId]){
                                map[item.productId]= {name:item.productName,sales:item.quantity,stock:this.getProductStock(item.productId)};
                            }else{
                                map[item.productId].sales += item.quantity;
                            }
                            return map;
                        },{});
                        this.lowStockProducts = this.products.filter(product=>product.stock<=10)
                            .map(product =>{
                                const totalSales = orders.flatMap(order => order.items)
                                    .filter(item => item.productId === product.id)  
                                    .reduce((sum,item) => sum + item.quantity,0);
                                    return {
                                        name:product.name,
                                        sales: totalSales,
                                        stock: product.stock
                                    };
                            });
                        this.salesData = salesResponse.data.dailySales;
                }catch(error){
                    console.error(error);
                }
            },
            getProductStock(productId){
                const product = this.products.find(p => p.id === productId);
                return product ? product.stock :0;
            },
            prepareSalesData(orders){
                const salesMap = {};
                orders.forEach(order=>{
                    if(salesMap[order.orderDate]){
                        salesMap[order.orderDate] += order.total;
                    }else{
                        salesMap[order.orderDate] = order.total;
                    }
                });
                const salesArray = Object.keys(salesMap).map(date =>({
                    date:date,
                    amount:salesMap[date]
                    })).sort((a,b) => new Date(a.date) - new Date(b.date));
                return salesArray;
            },
            async uploadCarouselImage(event){
                const file = event.target.files[0];
                if(!file) return;
                const formData = new FormData();
                formData.append('image',file);

                try{
                    const response = await axios.post('/api/carousel-images',formData,{
                        headers:{
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    this.carouselImages.push(response.data);
                    alert('圖片上傳成功');

                }catch(error){
                    console.error('圖片上傳失敗',error);
                    alert('圖片上傳失敗!');
                }
            },
            renderSalesChart(){
                if(!this.salesDate || this.salesData.length === 0 ){
                    console.error("銷售數據未加載！");
                    return;
                }                
                const ctx = document.getElementById('salesChart').getContext('2d');
                new Chart(ctx,{
                    type:'line',
                        data:{
                            labels:this.salesData.map(data=>data.date),
                            datasets:[{
                                label:'銷售金額',
                                data:this.salesData.map(data=>data.amount),
                                borderColor:'rgba(75,192,192,1)',
                                borderWidth:2,
                                fill:false
                        }]
                    },
                    options:{
                        scales:{
                            x:{
                                title:{
                                    display:true,
                                    text:'日期'
                                }
                            },
                            y:{
                                title:{
                                    display:true,
                                    text:'銷售金額(元)'
                                },
                                beginAtZero:true
                            }
                        }
                    }
                });
            },
            deleteCarouselImage(imageId){
                if(confirm('確定要刪除這張圖片嗎？')){
                    axios.delete(`/api/carousel-image/${imageId}`)
                    .then(()=>{
                        this.carouselImages = this.carouselImages.filter(image=>image.id !== imageId);
                        alert('圖片已刪除。');
                    })
                    .catch(error=>{
                        console.error('圖片刪除失敗',error);
                        alert('圖片刪除失敗！請稍後再試。');
                    });
                }
            }
        }
    }

</script>

<style scoped>
.button-container{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom:20px;
}
.button-item {
    flex:1;
    margin: 0 10px;
}
.admin-dashboard {
    max-width: 1200px;
    margin: 0 auto;
}
.sales-ranking h4 {
    text-align: center;
}
.product-list {
    margin-top: 20px;
}
</style>