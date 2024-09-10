<template>
    <div class="login-container container mt-5">
        <h2 class="text-center mb-4">會員登入</h2>
        <form @submit.prevent="Handlelogin">
            <div class="mb-3">
                <label for="email" class="form-label">帳號/電子郵件</label>
                <input type="email" id="email" v-model="email" name="email" class="form-control" placeholder="請輸入你的EMAIL" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" id="password" v-model="password" name="password" class="form-control" placeholder="請輸入密碼" required>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <router-link class="text-decoration-none" to="/ForgotPwd">忘記密碼？</router-link>
                <router-link class="text-decoration-none" to="/UserRegister">註冊新帳號</router-link>
            </div>
            <button type="submit" class="btn btn-primary w-100">登入</button>
        </form>
    </div>




</template>
    
    <script>
    export default {
        name: 'UserLogin',
        data(){
            return{
                email:'',
                password:''
            };
        },
        methods:{
            handleLogin(){
                //登入邏輯
                if(this.email && this.password){
                    console.log('登入成功',this.email,this.password);
                } else {
                    alert('EMAIL或密碼錯誤！');
                }
            }
        }
    };
        
    </script>
    
    <style scoped>
    .login-container{
        max-width: 400px;
        width:100%;
        margin: 0 auto;
    }
    .form-control{
        max-width:400px;
        width:100%;
        justify-content: center;
    }
    .text-decoration-none{
        color: crimson;
    }
    .text-decoration-none:hover{
        text-decoration: underline;
    }


</style>
    