// src/utils/imageUrl.js

const getImageUrl = (imagePath, type = 'carousel') => {
    if (!imagePath) return '/img/wrong.png';
    if (imagePath.startsWith('http')) return imagePath;

    const cleanPath = imagePath.startsWith('api') ? imagePath.slice(3) : imagePath;

    let baseUrl = '';

    if (type === 'carousel') {
        baseUrl = process.env.VUE_APP_CAROUSEL_IMAGE_BASE_URL;
    } else if (type === 'product') {
        baseUrl = process.env.VUE_APP_PRODUCT_IMAGE_BASE_URL;
    } else {
        baseUrl = process.env.VUE_APP_API_BASE_URL; // 預設使用 API 基礎 URL
    }

    return `${baseUrl}${imagePath}`;
};

export default getImageUrl;
