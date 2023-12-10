import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/IndexPage.vue'),
      meta: { title: 'Home', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue'),
      meta: { title: 'Login' },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import('../views/DashboardPage.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsPage.vue'),
      meta: { title: 'Analytics', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfilePage.vue'),
      meta: { title: 'Profile', requiresAuth: true },
    },
    {
      path: '/operations',
      name: 'operations',
      component: () => import('../views/OperationsPage.vue'),
      meta: { title: 'Operations', requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesPage.vue'),
      meta: { title: 'Categories', requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import('../views/NotFoundPage.vue'),
      meta: { title: 'Page not found' },
    },
  ],
});

// Add a title to the webpage for each route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? 'Budget Flow' + ' | ' + to.meta.title : 'Budget Flow';

  if (to.matched.some(record => record.meta.requiresAuth) && !useUserStore().isAuthenticated) {
    next({ name: 'login' });
  }

  next();
});

export default router;
