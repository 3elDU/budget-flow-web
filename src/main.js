import '@fontsource-variable/inter';
import './assets/default.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router.js';
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/lara-dark-purple/theme.css'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);
const emitter = mitt();
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, { ripple: true })
  .use(ToastService)
  .directive('tooltip', Tooltip)
  .provide('bus', emitter)
  .mount('#app');
