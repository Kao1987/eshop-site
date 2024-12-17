<template>
        <div class="order-detail container mt-5">
            <h2 class="text-center">訂單詳情</h2>
                <div v-if="order">
                <!-- 訂單基本資訊 -->
                    <div class="order-info mb-4">
                    <p><strong>訂單號：</strong>{{ order.id }}</p>
                    <p><strong>會員編號：</strong>{{ order.user_id }}</p>
                    <p><strong>用戶名：</strong>{{ userName }}</p>
                    <p><strong>建立日期：</strong>{{ formatDate(order.orderDate) }}</p>
                    <p><strong>總金額：</strong>{{ formatCurrency(order.total) }}</p>
                    <!-- 訂單狀態編輯 -->
                    <div class="mb-3">
                        <label for="orderStatus" class="form-label"><strong>訂單狀態：</strong></label>
                        <select id="orderStatus" v-model="order.status" class="form-select" @change="updateOrderStatus">
                        <option value="pending">待確認</option>
                        <option value="shipped">已發貨</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                        </select>
                    </div>
                    </div>
                <!-- 訂單商品列表 -->
                <h4>商品列表</h4>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                        <th>商品名稱</th>
                        <th>數量</th>
                        <th>單價</th>
                        <th>小計</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in order.items" :key="item.productId">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ formatCurrency(item.price) }}</td>
                        <td>{{ formatCurrency(item.price * item.quantity) }}</td>
                        </tr>
                    </tbody>
                </table>
                <!-- 返回按鈕 -->
                <button class="btn btn-secondary mt-3" @click="goBack">返回</button>
            </div>
            <div v-else>
                <p>正在加載訂單詳情...</p>
            </div>
        </div>
</template>
    
<script>
import ApiService from '@/services/api';
import { useStore } from 'vuex';
    export default {
        name: 'OrderDetail',
        props: ['id'],
        data() {
        return {
            order: null,
            userName: '',
            store: useStore(),
        };
        },
        methods: {
            async fetchOrderDetails(orderId) {
                try {
                    const response = await ApiService.orderAPI.getOrderById(orderId);
                    this.order = response || response.data;
                    // 獲取用戶名稱
                    this.fetchUserName(this.order.user_id);
                } catch (error) {
                    console.error('加載訂單詳情時出錯', error);
                    alert('加載訂單詳情時出錯，請稍候再試！');
                    this.order = null;
                }
            },
            async fetchUserName(userId) {
                try {
                    const response = await ApiService.userAPI.getUserInfo(userId);
                    const user = response.data || response;
                    this.userName = user.name || '未知用戶';
                } catch (error) {
                    console.error('加載用戶資訊時出錯', error);
                    this.userName = '未知用戶';
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
            formatDate(dateStr) {
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return new Date(dateStr).toLocaleDateString('zh-TW', options);
            },
            async updateOrderStatus() {
                if (!this.order) return;
                    try {
                        await ApiService.orderAPI.updateOrderStatus(this.order.id,this.order.status);  
                        store.dispatch('notification/showNotification', {
                            message: '訂單狀態已更新',
                            type: 'success',
                            timeout:3000
                        });
                        alert('訂單狀態已更新');
                    } catch (error) {
                        console.error('更新訂單狀態時出錯', error);
                        store.dispatch('notifications/showNotification', {
                        type: 'error',
                        message: '更新訂單狀態時出錯，請稍後再試！',
                        timeout: 2000
                    });
                    }
                },
            goBack() {
                this.$router.go(-1);
            },
        },
        mounted() {
            const orderId = this.id || this.$route.params.id;
            this.fetchOrderDetails(orderId);
        },
    };
</script>
    
<style scoped>
    .order-detail {
        max-width: 800px;
        margin: 0 auto;
    }
    .order-info p {
        margin-bottom: 0.5rem;
    }
    .table-bordered {
        margin-top: 1rem;
    }
</style>
    