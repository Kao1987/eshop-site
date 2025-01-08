<template>
    <!-- 問題搜尋＆折疊問題 -->
<div class="faq-search">
<input type="text" class="form-control" id="faqSearch" placeholder="搜尋問題...">
</div>

<div class="accordion" id="faqAccordion">
<div class="accordion-item faq-item">
<h2 class="accordion-header" id="headingOne">
    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
    問題一：如何註冊？
    </button>
</h2>
<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
    <div class="accordion-body">
    您可以點擊右上角的「註冊」按鈕，並按照提示填寫相關資訊來完成註冊。
    </div>
</div>
</div>

<div class="accordion-item faq-item">
<h2 class="accordion-header" id="headingTwo">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
    問題二：忘記密碼怎麼辦？
    </button>
</h2>
<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
    <div class="accordion-body">
    您可以點擊「忘記密碼」連結，輸入您的電子郵件，系統將發送密碼重置的指引給您。
    </div>
</div>
</div>

<!-- 添加更多問題 -->
</div>

<!-- 回傳表格 -->
    <div class="contact-container contact">
        <div class="contact-info">
            <h4>或者透過以下表格聯絡</h4>
        </div>
    <div class="contact-form">
    <form @submit.prevent="submitMessage">
        <div class="mb-3">
            <label for="name" class="form-label">姓名</label>
            <input type="text" v-model="formData.name" class="form-control" id="name" placeholder="請輸入您的姓名">
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">聯絡電話</label>
            <input type="phone" v-model="formData.phone" class="form-control" id="phone" placeholder="請輸入您的聯絡電話">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">電子郵件</label>
            <input type="email" v-model="formData.email" class="form-control" id="email" placeholder="請輸入您的電子郵件">
        </div>
        <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea v-model="formData.message" class="form-control" id="message" rows="4" placeholder="請輸入您的訊息"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">送出留言</button>
    </form>
    </div>
    </div>
</template>
    
<script>
import ApiService from '../services/api';
    export default {
        name: 'ContactUs',
        data(){
            return{
                formData:{
                    name:'',
                    phone:'',
                    email:'',
                    message:''
                }
            }
        },
        mounted(){
            const faqSearch = document.getElementById('faqSearch');
            if(faqSearch){
                faqSearch.addEventListener('input',function(){
                    const searchValue = faqSearch.value.toLowerCase();
                    document.querySelectorAll('.faq-item').forEach(function(item){
                        const question = item.querySelector('according-button').innerText.toLowerCase();
                        const answer = item.querySelector('.according-body').innerText.toLowerCase();
                        if(question.includes(searchValue)||answer.includes(searchValue)){
                            item.style.display = 'block';
                        }else{
                            item.style.display = 'none';
                        }
                        });
                    });
                }
            },
            methods:{
                async submitMessage(){
                    try{
                        await ApiService.messageAPI.createMessage(this.formData)
                        this.$notify.success('訊息已成功送出，我們會盡快回覆您');
                        setTimeout(()=>{
                            this.$router.push('/');
                        },2000);
                    }catch(error){
                        this.$notify.error('訊息送出失敗，請稍後再試');
                    }
                }
            }
        }
    

</script>

<style scoped>
.contact{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    padding: 5px;
    margin: 5px 5px 5px 5px;
    font-size:1em;
    color: cornflowerblue;
}
/* 同樣的樣式，保留在這裡 */
</style>
