import { createApp } from "vue";
import App from "./App.vue";

import router from "./route";

import { createPinia } from "pinia";

console.log(import.meta.env.VITE_BASE_URL);

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
