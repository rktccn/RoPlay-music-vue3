import { createApp } from "vue";
import App from "./App.vue";
import router from "./route";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist"; // pinia 数据持久化储存
import VueGtag from "vue-gtag"; //  谷歌统计

const GId = import.meta.env.VITE_GOOGLE_ANALYTICS;

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(router);
app.use(pinia);
app.use(VueGtag, {
  config: { id: GId },
});

app.mount("#app");
