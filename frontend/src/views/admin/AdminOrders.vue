<!-- frontend/src/views/admin/AdminOrders.vue -->
<template> 
    <div class="admin-dashboard container mt-5">
        <!-- 標題區塊改善 -->
        <div class="dashboard-header mb-4">
            <h2 class="text-primary fw-bold">訂單管理系統</h2>
            <p class="text-muted">管理所有訂單狀態與詳情</p>
        </div>

        <!-- 搜尋和篩選區塊優化 -->
        <div class="filters-container p-3 bg-light rounded-3 mb-4">
            <div class="row g-3">
                <div class="col-md-5">
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <i class="fas fa-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            class="form-control border-start-0" 
                            placeholder="搜尋訂單號或用戶名" 
                            v-model="searchQuery"
                        />
                    </div>
                </div>
                <div class="col-md-4">
                    <select 
                        v-model="selectedStatus" 
                        class="form-select" 
                    >
                        <option value="">所有訂單狀態</option>
                        <option value="pending">待確認</option>
                        <option value="shipped">已發貨</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-primary w-100" @click="filterOrders">
                        <i class="fas fa-filter me-2"></i>套用篩選
                    </button>
                </div>
            </div>
        </div>

        <!-- 訂單列表優化 -->
        <div class="table-responsive rounded-3 shadow-sm">
            <table class="table table-hover mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="py-3">訂單號</th>
                        <th class="py-3">用戶資訊</th>
                        <th class="py-3">總金額</th>
                        <th class="py-3">狀態</th>
                        <th class="py-3">建立日期</th>
                        <th class="py-3">操作</th>   
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in paginatedOrders" :key="order.id">
                        <td class="align-middle">#{{ order.id }}</td>
                        <td class="align-middle">
                            <div class="d-flex align-items-center">
                                <span class="user-avatar">{{ getUserInitials(order.user_id) }}</span>
                                <span class="ms-2">{{ getUserName(order.user_id) }}</span>
                            </div>
                        </td>
                        <td class="align-middle fw-bold">{{ formatCurrency(order.total) }}</td>
                        <td class="align-middle">
                            <span :class="getStatusBadgeClass(order.status)">
                                {{ formatStatus(order.status) }}
                            </span>
                        </td>
                        <td class="align-middle">{{ formatDate(order.order_date) }}</td>
                        <td class="align-middle">
                            <button 
                                class="btn btn-outline-info btn-sm me-2" 
                                @click="viewOrderDetails(order)"
                            >
                                <i class="fas fa-eye me-1"></i>查看
                            </button>
                            <button 
                                class="btn btn-outline-danger btn-sm" 
                                @click="cancelOrder(order)"
                                :disabled="order.status === 'cancelled' || order.status === 'completed'"
                                v-tooltip="order.status === 'cancelled' || order.status === 'completed' ? 
                                    '無法取消已完成或已取消的訂單' : '取消此訂單'"
                            >
                                <i class="fas fa-times me-1"></i>取消
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 分頁控制優化 -->
        <div class="pagination-container mt-4 d-flex justify-content-between align-items-center">
            <div class="page-info text-muted">
                顯示第 {{ paginationInfo.start }} 到 {{ paginationInfo.end }} 筆，共 {{ filteredOrders.length }} 筆
            </div>
            <div class="pagination-controls">
                <button 
                    class="btn btn-outline-primary me-2" 
                    @click="prevPage" 
                    :disabled="currentPage === 1"
                >
                    <i class="fas fa-chevron-left me-1"></i>上一頁
                </button>
                <button 
                    class="btn btn-outline-primary" 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                >
                    下一頁<i class="fas fa-chevron-right ms-1"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api'; 
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
            debouncedFilter: null, 
            loading: false,
            showToast: false,
            toastMessage: '',
            toastType: 'success',
        };
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => {
                const matchesSearch = (order.user_id && order.user_id.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) ||
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
        },
        paginationInfo() {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
            return { start, end };
        }
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await ApiService.orderAPI.getOrders();
                console.log('API回傳的訂單資料',response.data);
                const ordersData = response.data;
                this.orders = ordersData.map(
                        order=>({
                            ...order,
                            status:order.status || 'pending'
                        }))  || [] ;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('您的登入已過期，請重新登入。');
                    this.$store.dispatch('auth/logout');
                    this.$router.push('/UserLogin'); // 導向登入頁
                } else if (error.response && error.response.status === 403) {
                    // 權限不足
                    alert('您沒有權限訪問此頁面');
                    this.$router.push('/');
                } else {
                    console.error('加載訂單時出錯', error);
                    alert('加載訂單時出錯，請稍後再試');
                }
                this.orders = [];
            }
        },
        async fetchUsers() {
            try{
                const response = await ApiService.userAPI.getAllUsers();
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
                    await ApiService.orderAPI.updateOrder(order.id,{status:'cancelled'});
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
        getStatusBadgeClass(status) {
            const classes = {
                pending: 'badge bg-warning text-dark',
                shipped: 'badge bg-info text-white',
                completed: 'badge bg-success text-white',
                cancelled: 'badge bg-danger text-white'
            };
            return classes[status] || 'badge bg-secondary';
        },
        
        getUserInitials(userId) {
            const user = this.users.find(u => u.id === userId);
            if (!user) return '??';
            return user.name.substring(0, 2).toUpperCase();
        },

        showNotification(message, type = 'success') {
            this.toastMessage = message;
            this.toastType = type;
            this.showToast = true;
            setTimeout(() => {
                this.showToast = false;
            }, 3000);
        }
    },
    async mounted() {
        try{
            // const isAuthenticated = await this.$store.dispatch('auth/checkAuthStatus');
            // const user = this.$store.state.auth.user;

            // if(!isAuthenticated || !user){
            //     this.$router.push({
            //         path:'/UserLogin',
            //         query:{
            //             redirect:this.$route.fullPath
            //         }
            //     });
            //     return;
            // }

            await this.fetchOrders();
            await this.fetchUsers();
        }catch(error){
            console.error('獲取訂單或用戶數據時出錯', error);
            alert('獲取訂單或用戶數據時出錯，請稍後再試！');
        };
    },

        // // 初始化 debouncedFilter 為 debounce(this.filterOrders, 300)
        // this.debouncedFilter = debounce(this.filterOrders, 300);
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
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard-header h2 {
    font-size: 2rem;
    color: #2c3e50;
}

.filters-container {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
}

.user-avatar {
    width: 32px;
    height: 32px;
    background-color: #e9ecef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 500;
}

.table th {
    font-weight: 600;
    color: #495057;
}

.table td {
    vertical-align: middle;
}

.badge {
    padding: 0.5em 0.75em;
    font-weight: 500;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.pagination-container {
    font-size: 0.875rem;
}

/* 添加過渡動畫 */
.table-hover tbody tr {
    transition: background-color 0.2s ease;
}

.btn {
    transition: all 0.2s ease;
}

/* 加載動畫 */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 響應式調整 */
@media (max-width: 768px) {
    .filters-container .row {
        flex-direction: column;
    }
    
    .pagination-container {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}
</style>
