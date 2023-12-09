import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "../views/IndexPage.vue";
import LoginPage from "../views/LoginPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import AnalyticsPage from "../views/AnalyticsPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import {useUserStore} from "@/stores/userStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
      meta: { title: 'Home', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { title: 'Login' },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardPage,
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsPage,
      meta: { title: 'Analytics', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { title: 'Profile', requiresAuth: true },
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
