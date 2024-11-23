import './assets/main.css'; // Tus estilos personalizados
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify'; // Importar Vuetify
import 'vuetify/styles'; // Importar los estilos de Vuetify
import '@mdi/font/css/materialdesignicons.css'; // Opcional: para iconos Material Design
import App from './App.vue';
import router from './router';

// Crear instancia de Vuetify
const vuetify = createVuetify();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify); // Usar Vuetify

app.mount('#app');
