<!-- OrderConfirmation.vue -->
<template>
    <div class="order-confirmation container mt-5">
    <h2 class="text-center mb-4">訂單確認</h2>
        <div v-if="isLoading" class="text-center">
            <p>正在加載訂單詳情...</p>
        </div>
        <div v-else-if="!orderDetails" class="text-center">
            <p>無法加載訂單詳情，請稍後再試。</p>
        </div>
        <div v-else>
            <p>感謝您的購買，您的訂單編號是：{{ orderId }}</p>
            <router-link to="/" class="btn btn-primary mt-3">繼續購物！</router-link>
        </div>
    </div>
</template>


<script>
import { onMounted, ref } from 'vue';
import { useRoute , useRouter } from 'vue-router';
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import { useStore } from 'vuex'; // 添加 useStore


export default {
name: 'OrderConfirmation',
setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const orderId = route.params.orderId;
    const orderDetails = ref(null);
    const isLoading = ref(true);
    

    const fetchOrderDetails = async () => {
    isLoading.value = true;
    const isValidOrderId =  /^[1-9]\d*$/.test(orderId);
    if (!isValidOrderId) {
        console.error('訂單編號格式不正確:', orderId);
        store.dispatch('notifications/showNotification', {
            type: 'error',
            message: '訂單編號格式不正確，無法加載訂單詳情。',
        });
        router.push('/').catch(err => {
            if (err.name !== 'NavigationDuplicated') {
                console.error(err);
            }
        }); // 跳轉回主頁
        isLoading.value = false; // 停止加載
        return;
    }
    try {
        const response = await ApiService.orderAPI.getOrderById(orderId);
        if (!response || !response.id) {
            console.error('訂單詳情數據不完整');
            store.dispatch('notifications/showNotification', {
                type: 'error',
                message: '訂單資料不完整，請聯繫客服。',
            });            
            isLoading.value = false;
            return;
        }
        orderDetails.value = response;
    } catch (error) {
        if (error.response && error.response.status === 404) {
        console.error('訂單不存在', error);
        store.dispatch('notifications/showNotification', {
            type: 'error',
            message: '訂單不存在，請確認您的訂單編號。',
        });
    } else {
        console.error('加載訂單詳情時出錯', error);
        store.dispatch('notifications/showNotification', {
            type: 'error',
            message: '加載訂單詳情時出錯，請稍後再試！',
        });
    }
    orderDetails.value = null; // 清空訂單數據
    }finally{
        isLoading.value = false; // 停止加載
    }
};

    onMounted(() => {
        if (!orderId) {
        console.error('訂單編號缺失');
        router.push('/').catch(err => {
            if (err.name !== 'NavigationDuplicated') {
                console.error(err);
            }
        }); // 跳轉回主頁
        return;
        }

        fetchOrderDetails();
    });

    return {
    orderId,
    orderDetails,
    isLoading,
    };
},
};
</script>

<style scoped>
.order-confirmation {
    background-color: #f9f9f9;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
}

h2 {
    color: #333;
    margin-bottom: 20px;
}

p {
    font-size: 1.1rem;
    color: #555;
}

</style>
