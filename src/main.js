import '@fontsource-variable/inter';
import './assets/default.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router.js';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/lara-dark-purple/theme.css'
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import Panel from "primevue/panel";
import InputSwitch from "primevue/inputswitch";
import OverlayPanel from "primevue/overlaypanel";
import MultiSelect from "primevue/multiselect";
import InputNumber from "primevue/inputnumber";
import Tag from "primevue/tag";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import ProgressSpinner from "primevue/progressspinner";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

/* eslint-disable vue/multi-word-component-names, vue/no-reserved-component-names */
app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('Textarea', Textarea);
app.component('Calendar', Calendar);
app.component('Panel', Panel);
app.component('Dropdown', Dropdown);
app.component('OverlayPanel', OverlayPanel);
app.component('InputSwitch', InputSwitch);
app.component('MultiSelect', MultiSelect);
app.component('Tag', Tag);
app.component('ProgressSpinner', ProgressSpinner);

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, { ripple: true })
  .use(ToastService)
  .component('ConfirmationModal', ConfirmationModal)
  .directive('tooltip', Tooltip)
  .mount('#app');
