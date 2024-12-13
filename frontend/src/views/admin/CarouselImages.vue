<!-- src/components/CarouselImages.vue -->
<template>
    <div class="carousel-management container mt-5">
        <div class="dashboard-header mb-4">
            <h2 class="text-primary fw-bold">輪播圖片管理</h2>
            <p class="text-muted">管理網站首頁輪播圖片的顯示與排序</p>
        </div>

        <div class="image-grid mb-4">
            <div v-for="image in carouselImages" 
                :key="image.id" 
                class="image-card"
            >
                <div class="image-wrapper">
                    <img :src="getImageUrl(image.url,'carousel')" 
                         :alt="'輪播圖片 #' + image.id" 
                         class="carousel-image"
                    >
                    <div class="image-overlay">
                        <div class="action-buttons">
                            <button 
                                class="btn btn-light btn-sm me-2" 
                                @click="toggleImageVisibility(image)"
                                :class="{ 'active': image.visible }"
                            >
                                <i :class="image.visible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                                {{ image.visible ? '隱藏' : '顯示' }}
                            </button>
                            <button 
                                class="btn btn-danger btn-sm"
                                @click="deleteCarouselImage(image.id)"
                            >
                                <i class="fas fa-trash-alt me-1"></i>
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
                <div class="image-status mt-2">
                    <span :class="['status-badge', image.visible ? 'status-active' : 'status-inactive']">
                        {{ image.visible ? '顯示中' : '已隱藏' }}
                    </span>
                </div>
            </div>
        </div>

        <div class="upload-section p-4 bg-light rounded-3">
            <h4 class="mb-3">
                <i class="fas fa-cloud-upload-alt me-2"></i>
                上傳新圖片
            </h4>
            <div class="upload-area" 
                 @dragover.prevent 
                 @drop.prevent="handleFileDrop"
                 :class="{ 'dragging': isDragging }"
            >
                <input 
                    type="file" 
                    @change="handleFileSelect" 
                    accept="image/*" 
                    ref="fileInput"
                    class="d-none"
                />
                <div class="upload-placeholder" @click="$refs.fileInput.click()">
                    <i class="fas fa-plus-circle fs-2 mb-2"></i>
                    <p class="mb-1">點擊或拖曳圖片至此處上傳</p>
                    <small class="text-muted">支援 JPG、PNG、GIF 格式，檔案大小不超過 5MB</small>
                </div>
            </div>

            <div v-if="previewUrl" class="preview-section mt-4">
                <h5 class="mb-3">預覽圖片</h5>
                <div class="preview-container">
                    <img :src="previewUrl" alt="預覽圖片" class="preview-image">
                    <div class="preview-actions mt-3">
                        <button class="btn btn-primary me-2" @click="confirmUpload">
                            <i class="fas fa-check me-1"></i>確認上傳
                        </button>
                        <button class="btn btn-outline-secondary" @click="cancelUpload">
                            <i class="fas fa-times me-1"></i>取消
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showToast" 
             :class="['toast-notification', `toast-${toastType}`]"
        >
            {{ toastMessage }}
        </div>
    </div>
</template>

<script>
import ApiService from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';
import getImageUrl from '@/utils/imageUrl'; 

export default {
    name: 'AdminCarouselImages',
    data() {
        return {
            carouselImages: [],
            selectedFile:null,
            previewUrl:'',
            isDragging: false,
            showToast: false,
            toastMessage: '',
            toastType: 'success'
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
                const response = await ApiService.carouselAPI.updateCarouselImage(image.id,{visible:updatedVisibility});
                image.visible = response.visible;
                alert(`圖片已${updatedVisibility ? '顯示' : '隱藏'}。`);
            }catch(error) {
                handleApiError(error,'更新圖片狀態失敗');
            }
        },
        getImageUrl(url, type) {
            return getImageUrl(url,'type');
        },
        handleFileDrop(event) {
            this.isDragging = false;
            const file = event.dataTransfer.files[0];
            if (file) {
                this.handleFile(file);
            }
        },
        showNotification(message, type = 'success') {
            this.toastMessage = message;
            this.toastType = type;
            this.showToast = true;
            setTimeout(() => {
                this.showToast = false;
            }, 3000);
        }
    },
};
</script>

<style scoped>
.carousel-management {
    max-width: 1200px;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.image-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s;
}

.image-card:hover {
    transform: translateY(-2px);
}

.image-wrapper {
    position: relative;
    padding-top: 66.67%; /* 3:2 比例 */
}

.carousel-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
}

.image-card:hover .image-overlay {
    opacity: 1;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
}

.status-active {
    background-color: #d4edda;
    color: #155724;
}

.status-inactive {
    background-color: #f8d7da;
    color: #721c24;
}

.upload-area {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
}

.upload-area.dragging {
    border-color: #007bff;
    background-color: rgba(0,123,255,0.1);
}

.upload-placeholder {
    color: #6c757d;
}

.preview-container {
    max-width: 400px;
    margin: 0 auto;
}

.preview-image {
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem;
    border-radius: 4px;
    color: #fff;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
}

.toast-success {
    background-color: #28a745;
}

.toast-error {
    background-color: #dc3545;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .image-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}
</style>
