import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import Login from '../components/Login.vue';
import SignupPage from '../components/SignupPage.vue';
const routes = [
    {
        path: '/',
        name: 'Landing',
        component: LandingPage
    },
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'Signup', component: SignupPage },
    { path: '/dashboard', name: 'Dashboard', component: () => import('../components/Dashboard.vue') },
    { path: '/tickets', name: 'Tickets', component: () => import('../components/TicketManagement.vue') }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
