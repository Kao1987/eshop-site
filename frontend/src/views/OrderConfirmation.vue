<!-- OrderConfirmation.vue -->
<template>
    <div class="order-confirmation container mt-5">
    <h2 class="text-center mb-4">訂單確認</h2>
    <p>感謝您的購買，您的訂單編號是：{{ orderId }}</p>
    <!-- 可以在这里添加更多订单详情 -->
    <router-link to="/" class="btn btn-primary mt-3">繼續購物！</router-link>
    </div>
</template>


<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
name: 'OrderConfirmation',
setup() {
    const route = useRoute();
    const orderId = route.params.orderId;
    const orderDetails = ref(null);

    const fetchOrderDetails = async () => {
    try {
        const response = await axios.get(`/api/orders/${orderId}`);
        orderDetails.value = response.data;
    } catch (error) {
        console.error('获取订单详情时出错', error);
    }
    };

    onMounted(() => {
    fetchOrderDetails();
    });

    return {
    orderId,
    orderDetails,
    };
},
};
</script>

<style scoped>
/* 添加样式 */
</style>
