import { createApp } from "vue";
import App from "./App.vue";

import router from "./route/index.js";

console.log(import.meta.env.VITE_BASE_URL);

const app = createApp(App);
app.use(router);

app.mount("#app");
