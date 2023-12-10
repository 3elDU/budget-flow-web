import { defineStore } from 'pinia';
import api from "@/plugins/api.js";
import router from "@/plugins/router.js";

// eslint-disable-next-line import/prefer-default-export
export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => state.token !== null,
  },
  actions: {
    fetchMe() {
      return api.get('users/me').then(response => {
        this.user = response.data;
      });
    },
    logout() {
      this.token = null;
      this.user = null;

      router.push({ name: 'login' });
    },
  },
  persist: {
    storage: localStorage,
    key: 'application',
  },
});