// frontend/src/services/api.js
import request from '@/utils/request';
import axios from 'axios';

const ApiService = {
    setHeader(header, value) {
        request.defaults.headers.common[header] = value;
    },
    userAPI: {
        getAllUsers: () => request.get('/users'),
        login: (data) => request.post('/users/login', data),
        register: (data) => request.post('/users/register', data),
        getUserInfo: (id) => request.get(`/users/${id}`),
        updateUser: (id, data) => request.put(`/users/${id}`, data),
    },
    productAPI: {
        getProducts: (params) => request.get('/products', { params }),
        getProductById: (id) => request.get(`/products/${id}`),
        createProduct: (data) => request.post('/products', data),
        updateProduct: (id, data) => request.put(`/products/${id}`, data),
        deleteProduct: (id) => request.delete(`/products/${id}`),
        getAllProducts: () => request.get('/products'),
        searchProducts: (params) => request.get('/products/search', { params }),
    },
    tagAPI: {
        getAllTags: () => request.get('/tags'),
        createTag: (data) => request.post('/tags', data),
        updateTag: (id, data) => request.put(`/tags/${id}`, data),
        deleteTag: (id) => request.delete(`/tags/${id}`),
    },
    brandAPI: {
        getAllBrands: () => request.get('/brands'),
        createBrand: (name) => request.post('/brands', { name }),
        updateBrand: (id, data) => request.put(`/brands/${id}`,data),
        deleteBrand: (id) => request.delete(`/brands/${id}`),
    },
    orderAPI: {
        createOrder: (data) => request.post('/orders', data),
        getOrders: () => request.get('/orders'),
        getOrderById: (id) => request.get(`/orders/${id}`),
        updateOrder: (id, data) => request.put(`/orders/${id}`, data),
    },
    recipientAPI: {
        getRecipients: (userId) => request.get('/recipients', { params: { user_id: userId } }),
        updateRecipient: (id, data) => request.put(`/recipients/${id}`, data),
        addRecipient: (data) => request.post('/recipients', data),
        deleteRecipient: (id) => request.delete(`/recipients/${id}`)

    },
    carouselAPI: {
        getAllCarouselImages: () => request.get('/carousel_images'),
        getCarouselImages: () => request.get('/carousel_images'),
        uploadCarouselImages: (formData) => request.post('/carousel_images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        updateCarouselImage: (id, data) => request.put(`/carousel_images/${id}`, data),
        deleteCarouselImage: (id) => request.delete(`/carousel_images/${id}`),
    },
    specialOffersAPI: {
        getAllSpecialOffers: () => request.get('/special_offers'),
        getSpecialOfferById: (id) => request.get(`/special_offers/${id}`),
        createSpecialOffer: (data) => request.post('/special_offers', data),
        updateSpecialOffer: (id, data) => request.put(`/special_offers/${id}`, data),
        deleteSpecialOffer: (id) => request.delete(`/special_offers/${id}`),
    },
    rankingAPI: {
        getRanking: (days) => request.get('/sales/ranking',{params: { days },}),
    },
    messageAPI: {
        createMessage: (data) => request.post('/message', data),
    },
    createCancelToken: () => {
        const source = axios.CancelToken.source();
        return source;
    },
};
export default ApiService;
