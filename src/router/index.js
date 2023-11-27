import { createRouter, createWebHistory } from "vue-router";
import Index from '../views/Index.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Analytics from '../views/Analytics.vue';
import Profile from '../views/Profile.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: "Login" }
    },
    { 
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { title: "Dashboard" }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics,
      meta: { title: "Analytics" }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { title: "Profile" }
    }
  ], 
})

// Add a title to the webpage for each route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ?? 'Budget Flow';
  next();
})

export default router;