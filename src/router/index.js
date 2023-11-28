import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "../views/IndexPage.vue";
import LoginPage from "../views/LoginPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import AnalyticsPage from "../views/AnalyticsPage.vue";
import ProfilePage from "../views/ProfilePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: IndexPage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { title: "Login" },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardPage,
      meta: { title: "Dashboard" },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: AnalyticsPage,
      meta: { title: "Analytics" },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
      meta: { title: "Profile" },
    },
  ],
});

// Add a title to the webpage for each route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ?? "Budget Flow";
  next();
});

export default router;
