<template>
    <div class="cart-container container mt-5">
        <h2 class="text-center mb-4">我的購物車</h2>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">商品圖片</th>
                    <th scope="col">商品名稱</th>
                    <th scope="col">單價</th>
                    <th scope="col">數量</th>
                    <th scope="col">小計</th>
                    <th scope="col">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in cartItems" :key="index">
                    <!-- 商品圖片，若無法家則顯示預設圖片 -->
                    <td>
                        <img :src="item.image" alt="商品圖片" class="product-image"/>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}元</td>
                    <!-- 使用＠input即時更新數量 -->
                    <td>
                        <input type="number" class="form-control quantity-input" 
                        v-model.number="item.quantity" 
                        @input="updateQuantity(index,item.quantity)" min="1" />
                    </td>
                    <td>{{ item.quantity * item.price }}元</td>
                    <td>
                        <button class="btn btn-danger" @click="removeItem(index)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-between align-items-center">
            <h4>總計：{{ totalAmount }}元</h4>
            <button class="btn btn-success" @click="checkout">結帳</button>
        </div>
    </div>
</template>

<script>
import axios from'axios';

    export default {
    name: 'ShopCart',
    data(){
        return {
            cartItems:[],
        };
    },
    computed:{
        totalAmount(){
            return this.cartItems.reduce((total, item)=>
        {
            return total + item.price * item.quantity;
        },0);
        },
    },
    methods:{
        //更新商品數量
        updateQuantity(index,quantity){
            if(quantity < 1){
                this.cartItems[index].quantity = 1;
            }
            // 更新數量後重新計算金額
            this.$forceUpdate();
        },
        //刪除商品 
        removeItem(index){
            this.cartItems.splice(index,1);
        },
        // 結帳並成訂單
        async checkouot(){
            if(this.cartItems.length > 0){
                const orderData = {
                    userID:1,
                    orderDate:new Date().toISOString().split('T')[0],
                    total:this.totalAmount,
                    items:this.cartItems.map(item=>({
                        productID:item.productId,
                        productName:item.name,
                        quantity:item.quantity,
                        price:item.price,
                    })),
                };
                try{
                    const response = await axios.post('/api/orders',orderData);
                    console.log('訂單已成功提交',response.data);
                    alert(`總計 ${this.totalAmount}元,準備結帳！`);
                }catch(error){
                    console.error('提交訂單時出錯',error);
                    alert('提交訂單失敗，請稍候再試！');
                }
            }else{
                alert('購物車沒有商品，無法結帳！');
            }
        },
    } ,
};   
</script>

<style scoped>
.cart-container{
    max-width:800px;
    margin:0 auto;
}

.quantity-input{
width:80px;
text-align: center;
}
.table-hover today tr:hover{
    background: #f1f1f1;
}

.product-image{
    width:60px;
    height:60px;
    object-fit:cover;
}

.btn-danger{
    background-color: #dc3545;
}

.btn-success{
    background-color: #28a745;
}
.h4{
    font-weight:bold;
}

input[type="number"]{
    width:80px;
}


</style>
