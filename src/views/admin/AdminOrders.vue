<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">訂單管理</h2>
        <div class="filters f-flex justify-content-between mb-3">
            <!-- 訂單或用戶搜索 -->
            <input type="text" class="form-control" placeholder="搜尋訂單號或用戶名" v-modal="searchQuerry"/>
            <select v-modal="selectedStatus" class="form-select">
                <option value="">全部狀態</option>
                <option value="pending">待確認</option>
                <option value="">已發貨</option>
                <option value="">已完成</option>
                <option value="">已取消</option>
            </select>
            <button class="btn btn-primary" @click="filterOrders">篩選</button>
        </div>
        <!-- 訂單列表 -->
        <table class="table table-hover">
            <tread>
                <th>訂單號</th>
                <th>用戶名</th>
                <th>總金額</th>
                <th>狀態</th>
                <th>操作</th>
            </tread>
            <tbody>
                <tr v-for="(order, index) in filteredOrders" :key="index">
                    <td>{{ order.id }}</td>
                    <td>{{ order.user.name }}</td>
                    <td>{{ order.totalAmount }}</td>
                    <td>{{ order.status }}</td>
                    <td>{{ order.createdAt }}</td>
                    <td>
                        <button class="btn btn-info btn-sm" @click="viewOrderDetails(order)">查看</button>
                        <button class="btn btn-danger btn-sm" @click="cancelOrder(order)">取消訂單</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 訂單分頁 -->
        <div class="d-flex justify-content-center">
            <button class="btn btn-outline-primary me-2" @click="prevPage" :disabled="currentPage ===1">上一頁</button>
            <span>{{ currenpage }} / {{ totalpag }}頁</span>
            <button class="btn btn-outline-primary ms-2" @click="nextPage" :disable="currentPage === totalPages">下一頁</button>
        </div>
</div>
</template>
<script>
    export default{
        name:'AdminOrders',
        data(){
            return {
                orders:[], 
                searchQuery:'',
                selectedStatus:'',
                currentPage:1,
                itemsPerPage:10,
            };
        },
        computed:{
            filteredOrders(){
                return this.orders
                .filter(order=>{
                    return(
                        order.user.name.includes(this.searchQuery) ||
                        order.id.includes(this.searchQuery)
                    );
                })
                .filter(order=>{
                    return this.selectedStatus ? order.status === this.selectedStatus : true;
                })
                .slice(
                    (this.currentPage -1) * this.itemspage,
                    this.currentPage * this.itemsPerPage
                );
            },
            totalPages(){
                return Math.ceil(this.orders.length / this.itemsPerPage);
            },
        },
        methods: {
            filterOrders(){
                this.currentPage = 1;
            },
            viewOrderDetails(order){
                console.log('查看訂單',order);
            },
            cancelOrder(order){
                if(confirm('確定要取消這個訂單？')){
                    order.status = 'cancelled';
                }
            },
            prevPage(){
                if(this.currentPage > 1){
                    this.currentPage--;
                }
            },
            nextPage(){
                if(this.currentPage < this.totalPages){
                    this.currentPage++;
                }
            },
        },
        mounted(){
            // 從API取得數據
            this.orders=[
            { id: 'ORD001', user: { name: '用戶1' }, totalAmount: 1000, status: 'pending', createdAt: '2024-09-01' },
            { id: 'ORD002', user: { name: '用戶2' }, totalAmount: 2000, status: 'shipped', createdAt: '2024-09-02' },            
        ];
        },
};
</script>
<style scope>
.admin-orders{
    max-width:1000px;
    margin:0 auto;
}
.filters{
    max-width:1000px;
    margin-bottom: 20px;
}

</style>