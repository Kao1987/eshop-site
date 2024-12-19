// src/utils/imageUrl.js

export const getImageUrl = (imagePath, type) => {
    const baseUrl = process.env.VUE_APP_API_BASE_URL 


    if (!imagePath) return '/img/wrong.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/img/')) return imagePath;

    const typeMap = {
        product: 'products',
        carousel: 'carouselImages'
    };

    const folder = typeMap[type] || '';
    return `${baseUrl}/img/${folder}/${imagePath}`;
};

