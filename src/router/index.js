import { createRouter, createWebHistory } from 'vue-router';
import LoginRegisterView from '@/views/LoginRegisterView.vue';
import WelcomeView from '@/views/WelcomeView.vue';
import ContactView from '@/views/ContactView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login-register',
      component: LoginRegisterView,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated()) {
          console.log('Usuario no autenticado. Redirigiendo al login...');
          next({ name: 'login-register' });
        } else {
          console.log('Usuario autenticado. Accediendo a /welcome');
          next();
        }
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: () => import('@/views/AboutUsView.vue'),
    },
    {
      path: '/user-data',
      name: 'user-data',
      component: () => import('@/views/UserDataView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated()) {
          next({ name: 'login-register' });
        } else {
          next();
        }
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/create-product',
      name: 'create-product',
      component: () => import('@/views/CreateProductView.vue'), // Nueva vista para la creación de productos
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated()) {
          next({ name: 'login-register' });
        } else if (!authStore.user?.isAdmin) {
          console.log('Acceso denegado. Solo los administradores pueden crear productos.');
          next({ name: 'welcome' });
        } else {
          next();
        }
      },
    },
  ],
});

export default router;
