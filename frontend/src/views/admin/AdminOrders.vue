<template> 
    <div class="admin-dashboard container mt-5">
        <h2 class="text-center">訂單管理</h2>
        <div class="filters d-flex justify-content-between mb-3">
            <!-- 訂單或用戶搜索 -->
            <input 
                type="text" 
                class="form-control me-2" 
                placeholder="搜尋訂單號或用戶名" 
                v-model="searchQuery"
            />
            <select 
                v-model="selectedStatus" 
                class="form-select me-2" 
                aria-label="訂單狀態篩選"
            >
                <option value="">全部狀態</option>
                <option value="pending">待確認</option>
                <option value="shipped">已發貨</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
            </select>
            <button class="btn btn-primary" @click="filterOrders">篩選</button>
        </div>
        <!-- 訂單列表 -->
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>訂單號</th>
                    <th>用戶編號</th>
                    <th>總金額</th>
                    <th>訂單狀態</th>
                    <th>建立日期</th>
                    <th>操作</th>   
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in paginatedOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.user_id }} - {{ getUserName(order.user_id) }}</td>
                    <td>{{ formatCurrency(order.total) }}</td>
                    <td>{{ formatStatus(order.status) }}</td>
                    <td>{{ formatDate(order.order_date) }}</td>
                    <td>
                        <button class="btn btn-info btn-sm me-2" @click="viewOrderDetails(order)">查看</button>
                        <button 
                            class="btn btn-danger btn-sm" 
                            @click="cancelOrder(order)"
                            :disabled="order.status === 'cancelled' || order.status === 'completed'"
                            :title="order.status === 'cancelled' || order.status === 'completed' ? '無法取消或已取消的訂單' : '取消訂單'"
                        >
                            取消訂單
                        </button>
                    </td>
                </tr>
                <tr v-if="paginatedOrders.length === 0">
                    <td colspan="6" class="text-center">沒有符合條件的訂單。</td>
                </tr>
            </tbody>
        </table>
        <!-- 訂單分頁 -->
        <div class="d-flex justify-content-center align-items-center">
            <button class="btn btn-outline-primary me-2" @click="prevPage" :disabled="currentPage === 1">上一頁</button>
            <span>{{ currentPage }} / {{ totalPages }}頁</span>
            <button class="btn btn-outline-primary ms-2" @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash.debounce';

export default {
    name: 'AdminOrders',
    data() {
        return {
            orders: [], 
            users:[],
            searchQuery: '',
            selectedStatus: '',
            currentPage: 1,
            itemsPerPage: 10,
            debouncedFilter: null, // 初始化 debouncedFilter
        };
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => {
                const matchesSearch = (order.userId && order.userId.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                                    (order.id && order.id.toString().toLowerCase().includes(this.searchQuery.toLowerCase()));
                const matchesStatus = this.selectedStatus ? order.status === this.selectedStatus : true;
                return matchesSearch && matchesStatus;
            });
        },
        totalPages() {
            return Math.ceil(this.filteredOrders.length / this.itemsPerPage) || 1;
        },
        paginatedOrders() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            return this.filteredOrders.slice(start, end);
        }
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await axios.get('/api/orders');
                console.log('API回傳的訂單資料',response.data);
                const ordersData = response.data;
                this.orders = ordersData.map(
                        order=>({
                            ...order,
                            status:order.status || 'pending'
                        }))  || [] ;
            } catch (error) {
                console.error('加載訂單時出錯', error);
                alert('加載訂單時出錯');
                this.orders = [];
            }
        },
        async fetchUsers() {
            try{
                const response = await axios.get('/api/users');
                this.users = response.data || [];
            }catch(error){
                console.error('加載用戶時出錯',error);
                alert('加載用戶時出錯，請稍候再試！');
                this.users = [];
            }
        },
        viewOrderDetails(order) {
            console.log('查看訂單', order);
            this.$router.push({ name: 'OrderDetail', params: { id: order.id } });
        },
        async cancelOrder(order) {
            if (confirm('確定要取消這個訂單？')) {
                try {
                    await axios.put(`/api/orders/${order.id}/status`,{status:'cancelled'});
                    order.status = 'cancelled';
                    alert('訂單已成功取消。');
                } catch (error) {
                    console.error('取消訂單時出錯', error);
                    alert('取消訂單時出錯');
                }
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('zh-TW', { 
                style: 'currency',
                currency: 'TWD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
        },
        formatStatus(status) {
            const statusMap = {
                pending: '待確認',
                shipped: '已發貨',
                completed: '已完成',
                cancelled: '已取消'
            };
            return statusMap[status] || '未知狀態';
        },
        formatDate(dateStr) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateStr).toLocaleDateString('zh-TW', options);
        },
        filterOrders() {
            this.currentPage = 1;
        },
        getUserName(userId){
            const user = this.users.find(u=>u.id == userId);
            return user? user.name : '未知用戶';
        },
    },
    mounted() {
        // 從API取得數據
        this.fetchOrders();
        this.fetchUsers();
        // 初始化 debouncedFilter 為 debounce(this.filterOrders, 300)
        this.debouncedFilter = debounce(this.filterOrders, 300);
        
    },
    watch: {
        searchQuery() {
            this.debouncedFilter();
        },
        selectedStatus() {
            this.debouncedFilter();
        }
    }
};
</script>

<style scoped>
.admin-dashboard {
    max-width: 1000px;
    margin: 0 auto;
}
.filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}
.table-hover tbody tr:hover {
    background-color: #f1f1f1;
}
.btn-sm {
    padding: 0.25rem 0.5rem;
}
</style>
