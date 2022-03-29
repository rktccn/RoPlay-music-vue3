import { createApp } from "vue";
import App from "./App.vue";
import router from "./route";
import { createPinia } from "pinia";
import VueGtag from "vue-gtag";

const GId = import.meta.env.VITE_GOOGLE_ANALYTICS;

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(VueGtag, {
  config: { id: GId },
});

app.mount("#app");
