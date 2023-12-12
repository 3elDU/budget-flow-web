import axios from 'axios';
import router from '@/plugins/router.js';
import { useUserStore } from "@/stores/userStore.js";

const api = axios;

api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
api.defaults.headers.common['Content-Type'] = 'application/json';
api.defaults.headers.common.Accept = 'application/json';
api.defaults.baseURL = (import.meta.env.VITE_API_ROOT ?? 'http://localhost') + '/api/';

api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }

  config.headers['Accept-Language'] = userStore.locale ?? 'en';

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const userStore = useUserStore();

    if (error.response.status === 401) {
      userStore.$reset();
      router.push('/login');
    }
    return Promise.resolve(error.response);
  },
);

export default api;