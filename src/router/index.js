// src/router/index.js
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

    const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
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
        component: MembersPage
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
    
    export default router;
    