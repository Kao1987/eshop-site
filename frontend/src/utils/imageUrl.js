// src/utils/imageUrl.js

const getImageUrl = (imagePath, type) => {
    const baseUrl = process.env.VUE_APP_API_BASE_URL 
    // ? 'https://ecshop-backend.onrender.com' 
    // : 'http://localhost:5002';
    // console.log('[imageUrl.js] input imagePath:', imagePath, 'type:', type);

    if (!imagePath) return '/img/wrong.png';
    if (imagePath.startsWith('http')) return imagePath;

    switch (type) {
        case 'product':
            return `${baseUrl}/img/products/${imagePath}`;
        case 'carousel':
            return `${baseUrl}/img/carousel/${imagePath}`;
        default:
            return `${baseUrl}/img/${imagePath}`;
    }


    // // 確認 baseUrl & path 前後斜線
    // let cleanPath = imagePath;
    // if (cleanPath.startsWith('/api')) {
    //     cleanPath = cleanPath.replace(/^\/api/, ''); // 避免重複 /api
    //     console.log('[imageUrl.js] removing leading /api from imagePath, new cleanPath:', cleanPath);
    // }

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
