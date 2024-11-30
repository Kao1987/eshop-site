<template>
    <div class="container register-container mt-5 whitespace:nowrap">
        <h2 class="mb-4">會員註冊</h2>
        <form @submit.prevent="handleRegister">
        <div class="mb-3 d-flex align-items-center">
            <label for="username" class="form-label me-2">會員姓名</label>
            <input type="text" class="form-control" id="username" v-model="username" placeholder="請輸入姓名" required />
        </div>
        <div class="mb-3 d-flex align-items-center">
            <label for="email" class="form-label me-2">電子郵件</label>
            <input type="email" class="form-control" id="email" v-model="email" placeholder="請輸入電子信箱" required />
        </div>
        <div class="mb-3 d-flex align-items-center">
            <label for="phone" class="form-label me-2">會員電話號碼</label>
            <input type="tel" class="form-control" id="phone" v-model="phone" placeholder="請輸入手機號碼" required />
        </div>
        <div class="mb-3 d-flex align-items-center">
            <label for="address" class="form-label me-2">收件人地址</label>
            <input type="text" class="form-control" id="address" v-model="address"  placeholder="請輸入收件人地址" required />
        </div>
        <div class="mb-3 d-flex align-items-center">
            <label for="password" class="form-label me-2">會員密碼</label>
            <input type="password" class="form-control" id="password" v-model="password" placeholder="請設定密碼" />
        </div>
        <div class="mb-3 d-flex align-items-center">
            <label for="confirmpassword" class="form-label me-2">請再次輸入密碼</label>
            <input type="password" class="form-control" id="confirmpassword" v-model="confirmpassword"  placeholder="請再次輸入密碼" required />
            <div v-if="password!== confirmpassword" class="text-danger">兩次密碼不相符，請重新輸入。</div>
        </div>
        <button type="submit" class="btn btn-primary">註冊</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

    export default {
        name: "UserRegister",
        data() {
            return {
            username: "",
            phone: "",
            address:"",
            email: "",
            password: "",
            confirmpassword: "" ,
            };
    },
    methods: {
        handleRegister() {
            // 檢查電話號碼格式
        if (!this.validatePhoneNumber()){
            alert('請輸入正確的手機號碼格式');
            return;
            }
        // 檢查兩次密碼是否一致
        if (this.password !== this.confirmpassword){
            alert('兩次密碼不相符，請重新輸入。');
            return;
            }
        //發送post請求到API
            axios
            .post('/api/users',{
                name:this.username,
                phone:this.phone,
                address:this.address,
                email:this.email,
                password:this.password,
                role:"user",
            })
            .then(()=>{
                alert('註冊成功');
                this.$router.push("/UserLogin"); // 註冊後導向登入頁面

            })
            .catch(error=>{
                if (error.response) {
                    // 伺服器有響應，但發生錯誤
                    console.error('伺服器錯誤:', error.response.data);
                    alert('伺服器錯誤，請稍候再試。');
                } else if (error.request) {
                    // 沒有收到伺服器響應
                    console.error('未收到伺服器響應:', error.request);
                    alert('無法連接到伺服器，請檢查網絡。');
                } else {
                    // 其他錯誤
                    console.error('註冊失敗:', error.message);
                    alert('註冊失敗，請稍候再試。');
                }
            });
        },
            validatePhoneNumber(){
            const phoneRegex = /^[0-9]{10}$/; //電話號碼為10個數字
            return phoneRegex.test(this.phone);
        },
    },
}
</script>

<style scoped>
        .register-container{
        max-width: 500px;
        width:100%;
        margin: 0 auto;
    }
    .form-label{
        width: 200px;
        color: #3e3f4c;
        margin-bottom: 0;
}
</style>
