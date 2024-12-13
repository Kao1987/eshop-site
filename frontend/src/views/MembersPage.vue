<!-- frontend/src/views/MembersPage.vue -->
<template>
    <div class="member-page bg-light">
        <div class="container py-4">
            <!-- 會員資訊卡片 -->
            <div class="member-profile mb-4">
                <div class="profile-header d-flex align-items-center">
                    <div class="avatar-circle me-3">
                        <span class="initials">{{ getUserInitials }}</span>
                    </div>
                    <div>
                        <h2 class="mb-1">{{ userInfo.name }}</h2>
                        <p class="text-muted mb-0">{{ userInfo.email }}</p>
                    </div>
                </div>
            </div>

            <!-- 主要內容區塊 -->
            <div class="content-tabs mb-4">
                <ul class="nav nav-pills mb-3" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#profile">
                            <i class="fas fa-user me-2"></i>個人資料
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" data-bs-toggle="pill" data-bs-target="#addresses">
                            <i class="fas fa-map-marker-alt me-2"></i>收件地址
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" data-bs-toggle="pill" data-bs-target="#orders">
                            <i class="fas fa-shopping-bag me-2"></i>訂單記錄
                        </button>
                    </li>
                </ul>

                <div class="tab-content">
                    <!-- 個人資料頁籤 -->
                    <div class="tab-pane fade show active" id="profile">
                        <div class="card">
                            <div class="card-body">
                                <div class="info-group mb-3">
                                    <label class="text-muted">會員姓名</label>
                                    <p class="mb-0">{{ userInfo.name }}</p>
                                </div>
                                <div class="info-group mb-3">
                                    <label class="text-muted">電子信箱</label>
                                    <p class="mb-0">{{ userInfo.email }}</p>
                                </div>
                                <div class="info-group mb-3">
                                    <label class="text-muted">聯絡電話</label>
                                    <p class="mb-0">{{ userInfo.phone }}</p>
                                </div>
                                <div class="info-group">
                                    <label class="text-muted">聯絡地址</label>
                                    <p class="mb-0">{{ userInfo.address }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 收件地址頁籤 -->
                    <div class="tab-pane fade" id="addresses">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-end mb-3">
                                    <button class="btn btn-primary" @click="addRecipient">
                                        <i class="fas fa-plus me-2"></i>新增地址
                                    </button>
                                </div>
                                <div class="address-list">
                                    <div v-for="(recipient, index) in recipients" 
                                         :key="recipient.id" 
                                         class="address-item"
                                    >
                                        <div class="address-content">
                                            <h6 class="mb-2">{{ recipient.name }}</h6>
                                            <p class="mb-1">
                                                <i class="fas fa-phone me-2 text-muted"></i>
                                                {{ recipient.phone }}
                                            </p>
                                            <p class="mb-0">
                                                <i class="fas fa-map-marker-alt me-2 text-muted"></i>
                                                {{ recipient.address }}
                                            </p>
                                        </div>
                                        <div class="address-actions">
                                            <button class="btn btn-link" @click="editRecipientInfo(index)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-link text-danger" @click="deleteRecipient(index)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 訂單記錄頁籤 -->
                    <div class="tab-pane fade" id="orders">
                        <div class="card">
                            <div class="card-body">
                                <div class="order-list">
                                    <div v-for="(order, index) in orders" 
                                         :key="order.id" 
                                         class="order-item"
                                    >
                                        <div class="order-header" @click="toggleOrderDetails(index)">
                                            <div>
                                                <span class="order-id">#{{ order.id }}</span>
                                                <span class="order-date">{{ formateOrderDate(order.created_at) }}</span>
                                            </div>
                                            <div>
                                                <span class="order-amount">NT$ {{ Math.round(order.total).toLocaleString() }}</span>
                                                <i :class="['fas', expandedOrder === index ? 'fa-chevron-up' : 'fa-chevron-down', 'ms-2']"></i>
                                            </div>
                                        </div>
                                        <div v-if="expandedOrder === index" class="order-details">
                                            <div v-for="item in order.items" 
                                                 :key="item.id" 
                                                 class="order-product"
                                            >
                                                <img :src="item.product_image ? `/img/products/${item.product_image}` : '/img/welcome.jpg'"
                                                     :alt="item.name"
                                                     class="product-img"
                                                >
                                                <div class="product-info">
                                                    <h6>{{ item.name }}</h6>
                                                    <p class="mb-0">
                                                        數量：{{ item.quantity }} × NT$ {{ item.price }}
                                                    </p>
                                                </div>
                                                <div class="product-total">
                                                    NT$ {{ (item.quantity * item.price).toLocaleString() }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 登出按鈕 -->
            <div class="text-center">
                <button class="btn btn-outline-danger" @click="handleLogout">
                    <i class="fas fa-sign-out-alt me-2"></i>登出
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.member-page {
    min-height: 100vh;
}

.member-profile {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.avatar-circle {
    width: 64px;
    height: 64px;
    background: #e9ecef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.initials {
    font-size: 1.5rem;
    font-weight: 600;
    color: #6c757d;
}

.nav-pills .nav-link {
    color: #495057;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
}

.nav-pills .nav-link.active {
    background-color: #0d6efd;
    color: white;
}

.card {
    border: none;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.info-group label {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

.address-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.address-item:last-child {
    margin-bottom: 0;
}

.order-item {
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    background: #f8f9fa;
    border-radius: 0.5rem;
}

.order-details {
    padding: 1rem;
    border-top: 1px solid #e9ecef;
}

.order-product {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
}

.product-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin-right: 1rem;
}

.product-info {
    flex: 1;
}

.product-total {
    font-weight: 600;
}

.btn-link {
    color: inherit;
    text-decoration: none;
    padding: 0.25rem;
}

.btn-link:hover {
    color: #0d6efd;
}

@media (max-width: 768px) {
    .member-profile {
        padding: 1rem;
    }

    .nav-pills .nav-link {
        padding: 0.5rem 1rem;
    }

    .avatar-circle {
        width: 48px;
        height: 48px;
    }

    .initials {
        font-size: 1.25rem;
    }
}
</style>

<script>
import { Modal } from 'bootstrap';
import {mapState , mapActions} from 'vuex';
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler.js';

const {userAPI,recipientAPI} = ApiService;


export default {
    name: "MemberPage",
    data() {
        return {
            showRecipient:false,
            expandedOrder:null,
            isEditing:false,    
            isLoadingRecipients:false,        
            recipients:[],
            editRecipient:{
                name: ' ',
                phone: ' ',
                address:' '  
            },
            editingIndex:-1,
            userInfo:{
                name:" ",
                email:" ",
                phone:'',
                address:'',
                },
            orders:[ ],
            };
        },
    computed:{
        ...mapState('auth',{
            isLoggedIn:(state) => state.isLoggedIn,
            user: (state) => state.user || {},
        }),
        filteredOrders() {
        return this.orders.map((order) => ({
            ...order,
            formattedDate: this.formatOrderDate(order.created_at),
        }));
        },
        getUserInitials() {
            return this.userInfo.name ? this.userInfo.name.substring(0, 2).toUpperCase() : '??';
        }
    },
    async mounted(){
        try{
            if(!this.isLoggedIn){
                alert('請先登入會員！');
                this.$router.push('/UserLogin');
                return;
            }
            await Promise.all([
            this.loadUserInfo(),
            this.loadOrders(),
            this.loadRecipients()
            ]);
        }catch(error){
            handleApiError(error,"加載用戶信息失敗，請重試。");
        }

    },
    methods: {
        async loadUserInfo(){
            try{
                const userID = this.user.id;
                console.log("用戶 ID:", userID); // 日誌用戶 ID
                if(!userID){
                    console.error("用戶ID無效");  
                    return;
                }
                const response = await ApiService.userAPI.getUserInfo(userID); //請求API
                this.userInfo = response.data;
                console.log("用戶資料",this.userInfo);
            }catch (error){
                console.error("加載用戶信息時出錯:", error);
                handleApiError(error, "加載用戶信息失敗，請重試。");
            }
        },
        async loadOrders() {
            try {
                const response = await ApiService.userAPI.getOrders();
                if (response.success) {
                    this.orders = response.data;
                }
            } catch (error) {
                console.error('載入訂單失敗:', error);
            }
        },
        
        async loadRecipients() {
            try {
                this.isLoadingRecipients = true;
                const response = await ApiService.recipientAPI.getRecipients(this.user.id);
                this.recipients = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('載入收件人資料失敗:', error);
                handleApiError(error, '載入收件人資料失敗');
            } finally {
                this.isLoadingRecipients = false;
            }
        },
        isRecipientValid(recipient) {
            const phoneRegex = /^[0-9]{10}$/;
            return recipient.name.trim() && phoneRegex.test(recipient.phone) && recipient.address.trim();
        },
        async saveRecipient() {
            if (!this.isRecipientValid(this.editRecipient)) {
                alert('請檢查收件人資料是否完整且格式正確！');
                return;
            }

            try {
                let response;
                if (this.isEditing) {
                    response = await ApiService.recipientAPI.updateRecipient(
                        this.editRecipient.id, 
                        this.editRecipient
                    );
                    if (response.success) {
                        this.recipients[this.editingIndex] = response.data;
                    }
                } else {
                    response = await ApiService.recipientAPI.addRecipient({
                        ...this.editRecipient,
                        user_id: this.user.id
                    });
                    if (response.success) {
                        this.recipients.push(response.data);
                    }
                }
                this.hideModal();
                alert(this.isEditing ? '收件人資料已更新' : '新增收件人成功');
            } catch (error) {
                handleApiError(error, this.isEditing ? '更新收件人失敗' : '新增收件人失敗');
            }
        },
        async deleteRecipient(index) {
            if (!confirm('確定要刪除此收件人資料？')) return;
            
            try {
                const recipientId = this.recipients[index].id;
                const response = await ApiService.recipientAPI.deleteRecipient(recipientId);
                if (response.success) {
                    this.recipients.splice(index, 1);
                    alert('收件人資料已刪除');
                }
            } catch (error) {
                handleApiError(error, '刪除收件人敗');
            }
        },
        toggleRecipient(){
            this.showRecipient = !this.showRecipient;
        },
        addRecipient(){
            this.isEditing = false;
            this.editRecipient = {name: '',phone: '',address: '' };
            this.showModal();
        },
        editRecipientInfo(index){
            this.isEditing = true;
            this.editingIndex = index;
            this.editRecipient = {...this.recipients[index]};
            this.showModal();
        },
        toggleOrderDetails(index){
            const order = this.orders[index];
            if (!order.items || !order.items.length) {
                alert('該訂單無法顯示細節！');
                return;
            }
            // 確保所有訂單項目數據正確
            const isOrderItemValid = (item) =>
                item.product_name && item.quantity > 0 && item.price >= 0;
            if (!order.items.every(isOrderItemValid)) {
                alert('該訂單數據不完整，無法展開！');
                return;
            }
            this.expandedOrder = this.expandedOrder === index? null : index;
        },
        showModal() {
            if(this.$refs.recipientModal){
                const modal = new Modal(this.$refs.recipientModal);
                modal.show();
            }
        },
        hideModal(){
            const modal = Modal.getInstance(this.$refs.recipientModal);
            if(modal){
                modal.hide();
            }
        },    
        ...mapActions('auth',['logout']),
            async handleLogout(){
                await this.logout();
                alert("已成功登出!");
                this.$router.push("/UserLogin"); // 登出後導向登入頁面
        },
        formateOrderDate(dateString){
            if(!dateString) return'';
            const date = new Date(dateString);
            return date.toLocaleString('zh-TW',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
        },
        getOrderStatusClass(status) {
            const classes = {
                'pending': 'badge bg-warning text-dark',
                'processing': 'badge bg-info text-white',
                'shipped': 'badge bg-primary text-white',
                'completed': 'badge bg-success text-white',
                'cancelled': 'badge bg-danger text-white'
            };
            return classes[status] || 'badge bg-secondary';
        },

        getOrderStatusText(status) {
            const statusMap = {
                'pending': '處理中',
                'processing': '處理中',
                'shipped': '已出貨',
                'completed': '已完成',
                'cancelled': '已取消'
            };
            return statusMap[status] || '未知狀態';
        }
        }
    }

</script>