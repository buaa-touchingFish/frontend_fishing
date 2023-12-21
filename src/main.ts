import { createApp } from 'vue'
import router from './router';
import App from './App.vue'
import { createPinia } from 'pinia';
import naive from 'naive-ui'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import Dock from 'primevue/dock'
import Dropdown from 'primevue/dropdown';
import 'primevue/resources/themes/lara-light-green/theme.css'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia)
    .use(naive)
    .use(router)
    .use(PrimeVue, { ripple: true })
app.component("PButton", Button)
    .component("Chart", Chart)
    .component("Dock", Dock)
    .component("Dropdown",Dropdown)
    .mount('#app')