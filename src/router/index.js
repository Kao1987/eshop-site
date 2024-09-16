// src/router/views FrontStages
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AboutUsPage from '../views/AboutUsPage.vue';
import ShopCart from '../views/ShopCart.vue';
import ProductsList from '../views/ProductsList.vue';
import MembersPage from '../views/MembersPage.vue';
import ContactUs from '../views/ContactUs.vue';
import SearchResults from '../views/SearchResults.vue';
import UserRegister from '../views/UserRegister.vue';
import UserLogin from '../views/UserLogin.vue';
// src/router/view/admin BackStages
import AdminDashboard from '../views/admin/AdminDashBoard.vue';
import AdminProducts from '../views/admin/AdminProduct.vue';
import AdminUsers from '../views/admin/AdminUsers.vue';
import AdminOrders from '../views/admin/AdminOrders.vue';


    const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
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
        path: '/ShopCart',
        name: 'ShopCart',
        component: ShopCart
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
    }

  // Add more routes as needed
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    });
    router.beforeEach((to,from,next)=>{
        const isLoggedIn = !!localStorage.getItem('auth'); //檢查是某有登入
        const userRole = localStorage.getItem('role');

        if(to.matched.some(record => record.meta.requiresAuth)&&!isLoggedIn){
            if(!isLoggedIn){
                next({path:'/UserLogin',});
            }else if(to.meta.role && to.meta.role !== userRole){
                alert('你沒有權限進入此頁面');
                next({path:'/'});
            }else{
                next();
            }
        }
        else{
            next();
        }
    });
    export default router;
    