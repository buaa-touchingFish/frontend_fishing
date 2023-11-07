import { createApp } from 'vue'
import router from './router';
import App from './App.vue'
import { createPinia } from 'pinia';
import naive from 'naive-ui'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia)
    .use(naive)
    .use(router)
    .mount('#app')