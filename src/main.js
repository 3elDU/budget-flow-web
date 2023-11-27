import "@fontsource-variable/inter";
import './assets/default.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import mitt from "mitt";

const app = createApp(App);

app.use(router);

const emitter = mitt();
app.provide('bus', emitter);

app.mount('#app');