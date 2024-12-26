// frontend/src/router/views FrontStages
import store from '@/store';

import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutUsPage from '@/views/AboutUsPage.vue';
import ShopCart from '@/views/ShopCart.vue';
import ProductsList from '@/views/ProductsList.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import MembersPage from '@/views/MembersPage.vue';
import ContactUs from '@/views/ContactUs.vue';
import SearchResults from '@/views/SearchResults.vue';
import UserRegister from '@/views/UserRegister.vue';
import UserLogin from '@/views/UserLogin.vue';
import ForgotPwd from '@/views/ForgotPwd.vue';
import OrderConfirmation from '@/views/OrderConfirmation.vue';



// frontend/src/router/view/admin BackStages
import AdminDashBoard from '@/views/admin/AdminDashBoard.vue';
import AdminProducts from '@/views/admin/AdminProduct.vue';
import AdminUsers from '@/views/admin/AdminUsers.vue';
import AdminOrders from '@/views/admin/AdminOrders.vue';
import CreateProduct from '@/views/admin/CreateProduct.vue';
import EditProduct from '@/views/admin/EditProduct.vue';
import AdminContact from '@/views/admin/AdminContact.vue';
import OrderDetail from '@/views/admin/OrderDetail.vue';
import CarouselImages from '@/views/admin/CarouselImages.vue';
import SpecialOffers from '@/views/admin/SpecialOffers.vue';



    const routes = [
  
  // Add more routes as needed
];

const router = createRouter({
    history: createWebHashHistory(process.env.NODE_ENV === 'production' ? '/ECshop' : '/'),
    routes:[
        {
            path:'/',
            name:'HomePage',
            component: () => import('@/views/HomePage.vue')
        },
        {
            path: '/admin',
            name: 'AdminDashBoard',
            component: AdminDashBoard,
            meta:{requiresAuth: true,role:'admin'}
        },
        {
            path: '/admin/Products',
            name: 'AdminProducts',
            component: AdminProducts,
            meta:{requiresAuth: true,role:'admin'}
        },
        {
            path: '/admin/Users',
            name: 'AdminUsers',
            component: AdminUsers,
            meta:{requiresAuth: true,role:'admin'}
    
        },
        {
            path: '/admin/Orders',
            name: 'AdminOrders',
            component: AdminOrders,
            meta:{requiresAuth: true,role:'admin'}
        },    
        {
            path: '/admin/Orders/:id(\\d+)',
            name: 'OrderDetail',
            component: OrderDetail,
            props:true,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/CreateProduct',
            name: 'CreateProduct',
            component: CreateProduct,
            meta:{requiresAuth: true,role:'admin'}
        },
        {
            path: '/admin/EditProduct/:id',
            name: 'EditProduct',
            component: EditProduct,
            meta:{requiresAuth: true,role:'admin'}
        },
        {
            path: '/admin/AdminContact',
            name: 'AdminContact',
            component: AdminContact,
            meta: { requiresAuth: true, role: 'admin' }

        },
        {
            path: '/admin/CarouselImages',
            name: 'CarouselImages',
            component: CarouselImages,
            meta: { requiresAuth: true, role: 'admin' }

        },
        {
            path: '/admin/SpecialOffers',
            name: 'SpecialOffers',
            component: SpecialOffers,
            meta: { requiresAuth: true, role: 'admin' }
        },
        
        {
            path: '/ShopCart',
            name: 'ShopCart',
            component: ShopCart,
            meta:{requiresAuth: true}
    
        },
        {
            path: '/ProductsList',
            name: 'ProductsList',
            component: ProductsList
        },
        {
            path: '/MembersPage',
            name: 'MembersPage',
            component: MembersPage,
            meta:{requiresAuth: true}
        },
        {
            path: '/AboutUsPage',
            name: 'AboutUsPage',
            component: AboutUsPage
        },
        {
            path: '/ContactUs',
            name: 'ContactUs',
            component: ContactUs
        },
        {
            path: '/SearchResults',
            name: 'SearchResults',
            component: SearchResults
        },
        {
            path: '/UserRegister',
            name: 'UserRegister',
            component: UserRegister
        },
        {
            path: '/UserLogin',
            name: 'UserLogin',
            component: UserLogin
        },
        {
            path: '/ForgotPwd',
            name: 'ForgotPwd',
            component: ForgotPwd
        },
        {
            path: '/ProductDetail/:id',
            name: 'ProductDetail',
            component: ProductDetail
        },
        {
            path: '/Order-Confirmation/:orderId',
            name: 'OrderConfirmation',
            component: OrderConfirmation
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
    });
    router.beforeEach(async(to,from,next)=>{
        const isLoggedIn = !!localStorage.getItem('authToken'); //檢查是某有登入
        const user = JSON.parse(localStorage.getItem('user'));

        if(to.path === '/UserLogin'){
            if(isLoggedIn){
                return next({path:'/'});
            }
            return next();
        }

        if(isLoggedIn){
            try{
                const isValid = await store.dispatch('auth/checkAuthStatus');
                if(!isValid && to.meta.requiresAuth){
                    next({path:'/UserLogin',query:{redirect:to.fullPath}});
                }
                return next();
            }catch(error){
                console.error('認證檢查失敗:',error);
                return next({ path: '/UserLogin', query: { redirect: to.fullPath } });
            }
        }
        if(to.meta.requiresAuth && !isLoggedIn){
            return next({ path: '/UserLogin', query: { redirect: to.fullPath } });
        }
        next();
    });

export default router;
    