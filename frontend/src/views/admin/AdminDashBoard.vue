<template> 
    <div class="admin-dashboard container py-4">
        <!-- 頁面標題 -->
        <div class="dashboard-header mb-4">
            <h2 class="fw-bold text-primary">管理後台儀表板</h2>
            <p class="text-muted">查看網站營運概況與重要數據</p>
        </div>

        <!-- 快速功能區 -->
        <div class="quick-actions mb-4">
            <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                    <router-link to="/admin/CarouselImages" class="quick-action-card">
                        <i class="fas fa-images"></i>
                        <span>輪播圖片管理</span>
                    </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                    <router-link to="/admin/products" class="quick-action-card">
                        <i class="fas fa-box"></i>
                        <span>商品管理</span>
                    </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                    <router-link to="/admin/orders" class="quick-action-card">
                        <i class="fas fa-shopping-cart"></i>
                        <span>訂單管理</span>
                    </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                    <router-link to="/admin/users" class="quick-action-card">
                        <i class="fas fa-users"></i>
                        <span>使用者管理</span>
                    </router-link>
                </div>
            </div>
        </div>

        <!-- 數據概覽區 -->
        <div class="stats-overview mb-4">
            <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-primary">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="stat-info">
                            <h3>{{ todayOrders }}</h3>
                            <p>今日訂單數</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-success">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-info">
                            <h3>{{ formatNumber(todaySales) }}</h3>
                            <p>今日銷售額</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-info">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="stat-info">
                            <h3>{{ todayNewMembers }}</h3>
                            <p>今日新會員</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-warning">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>{{ totalMembers }}</h3>
                            <p>總會員數</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 銷售趨勢圖 -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h5 class="card-title mb-4">
                    <i class="fas fa-chart-line me-2"></i>銷售趨勢
                </h5>
                <div class="chart-container">
                    <canvas id="salesChart"></canvas>
                </div>
            </div>
        </div>

        <!-- 銷售數據比較 -->
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title mb-3">
                            <i class="fas fa-calendar-day me-2"></i>銷售比較
                        </h5>
                        <div class="comparison-item">
                            <div class="d-flex justify-content-between mb-2">
                                <span>今日銷售額</span>
                                <span class="fw-bold">{{ formatNumber(todaySales) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>昨日銷售額</span>
                                <span class="fw-bold">{{ formatNumber(yesterdaySales) }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>近7日銷售額</span>
                                <span class="fw-bold">{{ formatNumber(last7DaySales) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title mb-3">
                            <i class="fas fa-user-friends me-2"></i>會員統計
                        </h5>
                        <div class="comparison-item">
                            <div class="d-flex justify-content-between mb-2">
                                <span>今日新增會員</span>
                                <span class="fw-bold">{{ todayNewMembers }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>累計會員總數</span>
                                <span class="fw-bold">{{ totalMembers }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import ApiService from '@/services/api';

export default {
    name: 'AdminDashboard',
    data() {
        return {
            todayOrders: 0,
            todaySales: 0,
            yesterdaySales: 0,
            last7DaySales: 0,
            salesData: [],
            lowStockProducts: [],
            todayNewMembers: 0,
            totalMembers: 0,
            carouselImages: [],
            products: [],
            sevenDaySalesRanking: [],
            monthSalesRanking: [],
            socket: null,
        };
    },
    async mounted() {
        await this.loadDashboardData();
        this.renderSalesChart();
    },
    methods: {
        async loadDashboardData() {
            try {
                const [orderResponse, membersResponse, productsResponse] = await Promise.all([
                    ApiService.orderAPI.getOrders(),
                    ApiService.userAPI.getAllUsers(),
                    ApiService.productAPI.getAllProducts(),
                ]);

                const orders = orderResponse.data;
                const members = membersResponse.data;
                const products = productsResponse.data;
                this.products = products;

                // 計算今日數據
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                this.todayOrders = orders.filter(order => order.order_date.split('T')[0] === todayStr).length;

                // 計算銷售金額
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

                this.todaySales = orders
                    .filter(order => order.order_date.split('T')[0] === todayStr)
                    .reduce((sum, order) => sum + Number(order.total), 0);

                this.yesterdaySales = orders
                    .filter(order => order.order_date.split('T')[0] === yesterdayStr)
                    .reduce((sum, order) => sum + Number(order.total), 0);

                this.last7DaySales = orders
                    .filter(order => order.order_date.split('T')[0] >= sevenDaysAgoStr && order.order_date.split('T')[0] <= todayStr)
                    .reduce((sum, order) => sum + Number(order.total), 0);

                // 準備圖表數據
                const salesDataMap = {};
                orders.forEach(order => {
                    const orderDate = order.order_date.split('T')[0];
                    const orderTotal = Number(order.total);
                    if (salesDataMap[orderDate]) {
                        salesDataMap[orderDate] += orderTotal;
                    } else {
                        salesDataMap[orderDate] = orderTotal;
                    }
                });

                this.salesData = Object.keys(salesDataMap)
                    .map(date => ({ date, amount: salesDataMap[date] }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                // 計算會員數據
                this.todayNewMembers = members.filter(member => {
                    if (member.created_at) {
                        const memberDate = new Date(member.created_at).toISOString().split('T')[0];
                        return memberDate === todayStr;
                    }
                    return false;
                }).length;

                this.totalMembers = members.length;

            } catch (error) {
                console.error('加載儀表板數據時出錯：', error);
                alert('加載儀表板數據時出錯，請稍後再試！');
            }
        },
        renderSalesChart() {
            if (!this.salesData || this.salesData.length === 0) {
                console.error("銷售數據未加載！");
                return;
            }

            const ctx = document.getElementById('salesChart').getContext('2d');
            
            // 如果已存在圖表，先銷毀它
            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.salesData.map(data => data.date),
                    datasets: [{
                        label: '銷售金額',
                        data: this.salesData.map(data => data.amount),
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('zh-TW', {
                                            style: 'currency',
                                            currency: 'TWD',
                                            minimumFractionDigits: 0
                                        }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return new Intl.NumberFormat('zh-TW', {
                                        style: 'currency',
                                        currency: 'TWD',
                                        minimumFractionDigits: 0
                                    }).format(value);
                                }
                            }
                        }
                    }
                }
            });
        },
        formatNumber(amount) {
            return Number(amount).toLocaleString('zh-TW', {
                style: 'currency',
                currency: 'TWD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).replace(/^NT\$\s?/, '');
        },
        initWebSocket() {
            this.socket = new WebSocket('ws://localhost:5002/ws/admin');
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if(data.type === 'newOrder'){
                    this.updateDashboardData();
                }
            }
        },
        updateDashboardData(newOrder){
            const today = new Date();
            const todayStr = today.Date(newOrder.created_at);
            if(newOrder.order_date.split('T')[0] === todayStr){
                this.todayOrders++;
                this.todaySales += Number(newOrder.total);
            }
        }
    }
};
</script>

<style scoped>
.admin-dashboard {
    max-width: 1400px;
}

.dashboard-header h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

/* 快速功能區樣式 */
.quick-action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    text-decoration: none;
    color: #495057;
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
}

.quick-action-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    color: #0d6efd;
}

.quick-action-card i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

/* 數據卡片樣式 */
.stat-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.stat-icon i {
    font-size: 1.5rem;
}

.stat-info {
    flex: 1;
}

.stat-info h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.stat-info p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
}

/* 卡片樣式 */
.card {
    border: none;
    border-radius: 1rem;
}

.card-title {
    color: #495057;
    font-weight: 600;
}

.comparison-item {
    font-size: 0.95rem;
}

/* 響應式調整 */
@media (max-width: 768px) {
    .quick-action-card {
        padding: 1rem;
    }

    .stat-card {
        padding: 1rem;
    }

    .stat-icon {
        width: 40px;
        height: 40px;
    }

    .stat-info h3 {
        font-size: 1.25rem;
    }
}

/* 圖表容器樣式 */
.chart-container {
    position: relative;
    height: 300px;
    width: 100%;
}
</style>