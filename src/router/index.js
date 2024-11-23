import { createRouter, createWebHistory } from 'vue-router';
import LoginRegisterView from '@/views/LoginRegisterView.vue';
import WelcomeView from '@/views/WelcomeView.vue';
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
  ],
});

export default router;
