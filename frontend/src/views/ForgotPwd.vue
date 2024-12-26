<template>
    <div class="container">
        <h5>忘記密碼</h5>
        <form @submit.prevent="handleForgotPassword">
            <div class="mb-3">
                <label for="email" class="form-label">電子郵件</label>
                <input type="email" v-model="email" class="form-control" id="email" required/> 
            </div>
            <button type="submit" class="btn btn-primary">發送重設密碼連結信</button>
        </form>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    name: 'ForgotPwd',
    data(){
        return{
            email:'',
            newPassword:'',
        };
    },
    methods:{
        async handleForgotPassword(){
            try{
                const token = this.$route.params.token;
                await axios.post(`/api/reset-password/${token}`,{newPassword:this.newPassword});
                alert('密碼已成功重新設置！');
                this.$router.push('/login');
            }catch(error){
                console.error('重設密碼錯誤,error');
                alert('重設密碼失敗');
            }
        }
    }
}

</script>

<style scoped>


</style>
