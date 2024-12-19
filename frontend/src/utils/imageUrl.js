// src/utils/imageUrl.js

export const getImageUrl = (path, type) => {
    if (!path) return '/img/wrong.png';

    const baseUrl = process.env.VUE_APP_API_BASE_URL;

    switch(type) {
        case 'carousel':
            return `${baseURL}/api/img/carousel/${path.split('/').pop()}`;
        case 'product':
            return `${baseURL}/api/img/products/${path.split('/').pop()}`;
        default:
            return `${baseURL}${path}`;
        }

    // if (!imagePath) return '/img/wrong.png';
    // if (imagePath.startsWith('http')) return imagePath;
    // if (imagePath.startsWith('/img/')) return imagePath;

    // const typeMap = {
    //     product: 'products',
    //     carousel: 'carouselImages'
    // };

    // const folder = typeMap[type] || '';
    // return `${baseUrl}/img/${folder}/${imagePath}`;

};

