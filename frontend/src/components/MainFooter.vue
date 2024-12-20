<template>
    <div class="footer d-flex flex-column">
        <div class="flex-grow-1">
        <p>台灣ECshop.com有限公司<br/>
            統編 99999999<br/>
            Copyright 2024, ECSHOP Group.</p>
    </div>
    </div>


</template>
    
    <script>
    export default {
        name: 'MainFooter', // 為元件命名
    };
    </script>
    
    <style scoped>
    /* 你的樣式 */
    .footer{
        bottom: 0;
        width: 100%;
        left: 0;
        background: fixed;
        background-image: url(/img/header_bg.jpg);
        color:aqua;
        text-align: center;
    }
    .flex-grow-1{
        flex-grow: 1;
    }
    body {
        padding-bottom: 50px;
    }
    </style>
    