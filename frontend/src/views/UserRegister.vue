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
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';

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
        async handleRegister() {
            try{
                this.formErrors = [];

                const validationErrors = this.validateForm();
                if (validationErrors.length > 0) {
                    this.formErrors = validationErrors;
                    return;
                    }

                const response = await ApiService.userAPI.register({
                    name: this.sanitizeInput(this.username),
                    phone: this.sanitizeInput(this.phone),
                    address: this.sanitizeInput(this.address),
                    email: this.sanitizeInput(this.email),
                    password: this.sanitizeInput(this.password),
                    role: "user",
                });
                if (response.success) {
                    alert("註冊成功");
                    this.$router.push("/UserLogin");
                }
            }catch (error) {
                handleApiError(error, '註冊失敗，請稍後再試');
            }
    },
        // 表單驗證方法
        validateForm() {
            const errors = [];
            
            // 用戶名驗證
            if (!this.username.trim()) {
                errors.push('請輸入會員姓名');
            } else if (this.username.length < 2) {
                errors.push('會員姓名至少需要2個字元');
            }
            // 電話驗證
            if (!this.validatePhoneNumber(this.phone)) {
                errors.push('請輸入正確的手機號碼格式（10位數字）');
            }
            // 地址驗證
            if (!this.address.trim()) {
                errors.push('請輸入地址');
            } else if (this.address.length < 8) {
                errors.push('地址需要更詳細');
            }
            // 電子郵件驗證
            if (!this.validateEmail(this.email)) {
                errors.push('請輸入正確的電子郵件格式');
            }
            // 密碼驗證
            if (!this.password) {
                errors.push('請設定密碼');
            } else if (this.password.length < 6) {
                errors.push('密碼長度需至少為6個字元');
            } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(this.password)) {
                errors.push('密碼需包含至少一個字母和一個數字');
            }
            // 確認密碼
            if (this.password !== this.confirmpassword) {
                errors.push('兩次密碼不相符');
            }
            return errors;
        },
        // 改進的電話驗證
        validatePhoneNumber(phone) {
            const phoneRegex = /^09\d{8}$/;  // 台灣手機號碼格式
            return phoneRegex.test(phone);
        },
        // 改進的電子郵件驗證
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        // 改進的輸入淨化方法
        sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            return input.trim()
                    .replace(/<[^>]*>/g, '')  // 移除 HTML 標籤
                    .replace(/[<>]/g, '');    // 移除特殊字符
        }
    }
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
