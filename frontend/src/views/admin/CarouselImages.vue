<!-- src/components/AdminCarouselImages.vue -->
<template>
    <div class="carousel-management container mt-5">
        <h2 class="text-center">輪播圖片管理</h2>
        <div class="carousel-image-list d-flex flex-wrap">
            <div v-for="image in carouselImages" 
                :key="image.id" 
                class="carousel-image-item m-2"
                >
                <img :src="getImageUrl(image.url)" alt="輪播圖片" class="img-thumbnail">
                <button class="btn btn-danger btn-sm mt-2" 
                @click="deleteCarouselImage(image.id)"
                >刪除圖片</button>
                <div class="me-2">
                    <button 
                    class="btn btn-secondary btn-sm" 
                    @click="toggleImageVisibility(image)"
                    >
                    {{ image.visible ? '隱藏' : '顯示' }}
                </button>
                </div>
            </div>
        </div>
            <!-- 圖鑑上傳區 -->
        <div class="upload-section mt-4">
            <h4>
                上傳新圖片
            </h4>
            <input type="file" @change="handleFileSelect" accept="image/*" ref="fileInput"/>
            <!-- 預覽圖片與上傳 -->
            <div v-if="previewUrl" class="preview-section mt-3">
                <h5>預覽圖片</h5>
                <img :src="previewUrl" alt="上傳的圖片" class="img-thumbnail" style="max-width:300px;" />
                <div class="mt-2">
                    <button class="btn btn-primary me-2" @click="confirmUpload">確認上傳</button>
                    <button class="btn btn-secondary" @click="cancelUpload">取消上傳</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import axios from 'axios';

export default {
    name: 'AdminCarouselImages',
    data() {
        return {
            carouselImages: [],
            selectedFile:null,
            previewUrl:'',
        };
    },
    async mounted() {
        await this.loadCarouselImages();
    },
    methods: {
        async loadCarouselImages() {
            try {
                const response = await ApiService.carouselAPI.getCarouselImages();
                this.carouselImages = response;
            } catch (error) {
                handleApiError(error,'加載輪播圖片失敗');
            }
        },
        handleFileSelect(event){
            const file= event.target.files[0];
            if(file){
                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                if(!validTypes.includes(file.type)){
                    alert('僅支援JPEG, PNG, GIF 格式的圖片！');
                    return;
                }
                if(file.size > maxSize){
                    alert('圖片超出5MB的上限！');
                    return;
                }
                this.selectedFile = file;
                this.previewUrl = URL.createObjectURL(file);
            }
        },
        async confirmUpload() {
            if(!this.selectedFile){
                alert('沒有選擇任何文件！');
                return;
            }
            const formData = new FormData();
            formData.append('image',this.selectedFile);

            try {
                const response = await ApiService.carouselAPI.uploadCarouselImages(formData);
                this.carouselImages.push(response);
                alert('圖片上傳成功');
                this.resetUpload();
            } catch (error) {
                handleApiError(error,'圖片上傳失敗');
            }
        },
        cancelUpload(){
            this.resetUpload();
        },
        resetUpload(){
            this.selectedFile = null;
            this.previewUrl = '';
            this.$refs.fileInput.value = '';
        },
        async deleteCarouselImage(imageId) {
            if (confirm('確定要刪除這張圖片嗎？')) {
                try {
                    await ApiService.carouselAPI.deleteCarouselImage(imageId);
                    this.carouselImages = this.carouselImages.filter(
                        (image => image.id !== imageId));
                    alert('圖片已刪除。');
                } catch (error) {
                    handleApiError(error, '圖片刪除失敗');
                }
            }
        },
        async toggleImageVisibility(image){
            const updatedVisibility =!image.visible;
            try{
                await ApiService.carouselAPI.updateCarouselImage(image.id,{visible:updatedVisibility});
                image.visible = response.data.visible;
                alert(`圖片已${updatedVisibility ? '顯示' : '隱藏'}。`);
            }catch(error) {
                handleApiError(error,'更新圖片狀態失敗');
            }
        },
        getImageUrl(url) {
            if (url.startsWith('http')) {
                return url;
            }else {
                return `http://localhost:5002${url}`;
            }
                }
            },
};
</script>

<style scoped>
.carousel-image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.carousel-image-item {
    width: 200px;
    text-align: center;
}

.preview-section img {
    max-width: 100%;
    height: auto;
}
</style>
