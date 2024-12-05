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
            <input 
            :type="showPassword ? 'text' : 'password'" 
            class="form-control" 
            id="password" 
            v-model="password" 
            placeholder="請設定密碼" 
        />
        <button 
            type="button" 
            class="btn btn-outline-secondary position-absolute end-0 top-0 h-100" 
            @click="showPassword = !showPassword"
            style="width: 60px;"
        >
            {{ showPassword ? '隱藏' : '顯示' }}
        </button>
        </div>
        <div class="mb-3 d-flex align-items-center">
            <label for="confirmpassword" class="form-label me-2">請再次輸入密碼</label>
            <input type="password" class="form-control" id="confirmpassword" v-model="confirmpassword"  placeholder="請再次輸入密碼" required />
        </div>
        <div v-if="formErrors.length" class="text-danger">
            <ul>
                <li v-for="error in formErrors" :key="error">{{ error }}</li>
            </ul>
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
            formErrors: [],
            showPassword: false,
            };
    },
    methods: {
        handleRegister() {
    this.formErrors = []; // 清空錯誤訊息

    if (!this.validatePhoneNumber()) {
        this.formErrors.push('請輸入正確的手機號碼格式');
    }
    if (this.password !== this.confirmpassword) {
        this.formErrors.push('兩次密碼不相符，請重新輸入。');
    }
    if (!this.validateEmail(this.email)) {
        this.formErrors.push('請輸入正確的電子郵件格式');
    }
    if (!this.username.trim()) {
        this.formErrors.push('請輸入會員姓名');
    }
    if (!this.address.trim()) {
        this.formErrors.push('請輸入地址');
    }
    if (!this.password.trim()) {
        this.formErrors.push('請設定密碼');
    }
    if (this.password.length < 6) {
        this.formErrors.push('密碼長度需至少為6個字元');
    }

    if (this.formErrors.length) {
        return; // 若有錯誤訊息則阻止提交
    }

    // 發送 POST 請求到 API
    axios.post('/api/users', {
        name: this.sanitizeInput(this.username),
        phone: this.sanitizeInput(this.phone),
        address: this.sanitizeInput(this.address),
        email: this.sanitizeInput(this.email),
        password: this.sanitizeInput(this.password),
        role: "user",
    })
    .then(() => {
        alert('註冊成功');
        this.$router.push("/UserLogin");
    })
    .catch(error => {
        if (error.response) {
            console.error('伺服器錯誤:', error.response.data);
            this.formErrors.push('伺服器錯誤，請稍候再試。');
        } else if (error.request) {
            console.error('未收到伺服器響應:', error.request);
            this.formErrors.push('無法連接到伺服器，請檢查網絡。');
        } else {
            console.error('註冊失敗:', error.message);
            this.formErrors.push('註冊失敗，請稍候再試。');
        }
    });
},

        // 驗證電話號碼格式
        validatePhoneNumber(){
        const phoneRegex = /^[0-9]{10}$/; 
        return phoneRegex.test(this.phone);
        },
        // 驗證電子郵件格式
        validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
        },
        sanitizeInput(input) {
        return input.replace(/<[^>]*>?/gm, '').trim();
}

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
    .password-wrapper {
        position: relative;
    }

    .password-wrapper .btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

</style>
