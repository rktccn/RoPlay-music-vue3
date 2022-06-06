import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from "pinia";
import piniaPersist from "pinia-plugin-persist"; // pinia 数据持久化储存
import VueGtag from "vue-gtag"; //  谷歌统计
import router from "./route";

const GId = import.meta.env.VITE_GOOGLE_ANALYTICS;

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

import 'virtual:svg-icons-register'

import svgIcon from "./components/svgIcon.vue";
app.component("svg-icon", svgIcon);


app.use(pinia);
app.use(router);
app.use(VueGtag, {
    config: {id: GId},
});

app.mount("#app");
