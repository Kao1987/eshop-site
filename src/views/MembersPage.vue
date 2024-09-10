<template>
<div class="container mt-5">
<h2 class="mb-4">會員資料</h2>
<!--會員基本資料 -->
<div class="card mb-3">
    <div class="card-body">
    <h5 class="card-title">會員基本資料</h5>
    <p class="card-text">使用者名稱：{{ userInfo.username }} </p>
    <p class="card-text">電子郵件：{{ userInfo.useremail }} </p>

    <button class="btn btn-danger" @click="logout">登出</button>
    </div>
</div>
<!--收件人資料 -->
<div class="card mb-3">
    <div class="card-body">
        <h5>收件人資料</h5>
        <button class="btn btn-link" @click="toggleRecipient">展開/收起</button>
        <div v-if="showRecipient">
            <table class="table">
                <thead>
                    <tr>
                    <th>收件人名稱</th>
                    <th>聯絡電話</th>
                    <th>地址</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(recipient, index) in useTransitionFallthrough.recipients" :key="index">
                        <td>{{ recipient.name }}</td>
                        <td>{{ recipient.phone }}</td>
                        <td>{{ recipient.address }}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" @click="editRecipient(index)">編輯</button>
                            <button class="btn btn-danger btn-sm" @click="deleteRecipient(index)">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button class="btn btn-primary" @click="addRecipient">新增收件人</button>
        </div>
    </div>
<!-- 訂單查詢 -->
    <div class="mb-3">
        <div class="card-body">
            <h5 class="card-title">訂單查詢</h5>
        <table class="table">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>訂單金額</th>
                    <th>訂購時間</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in userInfo.orders" :key="index">
                    <td>{{ order.orderID }}</td>
                    <td>{{ order.total }}</td>
                    <td>{{ order.date }}</td>
                    <td>
                        <button class="btn btn-link" @click="toggleOrderDetails(index)">展開/收起</button>
                    </td>
                </tr>
                <tr v-if="expanderOrder === index" v-for="(orderItem, i) in order.item" :key="i">
                    <td colspan="4">
                        <strong>商品名稱:</strong>{{ orderItem.name }}
                        <strong>數量:</strong> {{ orderItem.quantity }}
                        <strong>價格:</strong> {{ orderItem.price }}
                    </td>
                </tr>
            </tbody>
        </table>

        </div>

    </div>

</div>
</div>
</template>

<script>
export default {
name: "MemberPage",
methods: {
logout() {
    // 模擬登出流程
    console.log("已登出");
    this.$router.push("/login"); // 登出後導向登入頁面
}
}
};
</script>
