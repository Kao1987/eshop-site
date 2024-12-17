// src/utils/imageUrl.js

const getImageUrl = (imagePath, type = 'carousel') => {
    console.log('[imageUrl.js] input imagePath:', imagePath, 'type:', type);

    if (!imagePath) return '/img/wrong.png';
    if (imagePath.startsWith('http')) return imagePath;

    let baseUrl='';
    if (type === 'carousel') {
        baseUrl = process.env.VUE_APP_CAROUSEL_IMAGE_BASE_URL || process.env.VUE_APP_API_BASE_URL;
        console.log('[imageUrl.js] (carousel) baseUrl:', baseUrl);

    } else if (type === 'product') {
        baseUrl = process.env.VUE_APP_PRODUCT_IMAGE_BASE_URL;
        console.log('[imageUrl.js] (product) baseUrl:', baseUrl);

    } else {
        baseUrl = process.env.VUE_APP_API_BASE_URL; // 預設使用 API 基礎 URL
    }


    // 確認 baseUrl & path 前後斜線
    let cleanPath = imagePath;
    if (cleanPath.startsWith('/api')) {
        cleanPath = cleanPath.replace(/^\/api/, ''); // 避免重複 /api
        console.log('[imageUrl.js] removing leading /api from imagePath, new cleanPath:', cleanPath);
    }

    // 組合
    let finalUrl = baseUrl;
    if (!finalUrl.endsWith('/') && !cleanPath.startsWith('/')) {
        finalUrl += '/';
    }
    finalUrl += cleanPath;
    console.log('[imageUrl.js] finalUrl =', finalUrl);

    return finalUrl;
};

export default getImageUrl;
