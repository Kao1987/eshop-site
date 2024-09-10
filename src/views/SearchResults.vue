<template>
    <div>
    <h1>搜尋結果</h1>
    <p>搜尋關鍵字：{{ searchQuery }}</p>
    <!-- 這裡可以顯示搜尋的結果 -->
    </div>
</template>

<script>
export default {
    name: 'SearchResults',
    computed: {
    searchQuery() {
        return this.$route.query.q;  // 從 URL 的 query 參數中獲取搜尋關鍵字
    }
    }
};
</script>
