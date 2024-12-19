// src/utils/imageUrl.js

export const getImageUrl = (path, type) => {
    if (!path) return '/img/wrong.png';

    const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '';

    switch(type) {
        case 'carousel':
          return `${API_BASE_URL}/img/carouselImages/${path.split('/').pop()}`;
        case 'product':
          return `${API_BASE_URL}/img/products/${path.split('/').pop()}`;
        default:
          return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
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

export default getImageUrl;