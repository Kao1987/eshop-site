// src/utils/imageUrl.js

export function getImageUrl(imagePath, type) {
    const baseUrl = process.env.VUE_APP_API_BASE_URL 


    if (!imagePath) return '/img/wrong.png';
    if (imagePath.startsWith('http')) return imagePath;

    switch (type) {
        case 'product':
            return `${baseUrl}/img/products/${imagePath}`;
        case 'carousel':
            return `${baseUrl}/img/carouselImages/${imagePath}`;
        default:
            return `${baseUrl}/img/${imagePath}`;
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

