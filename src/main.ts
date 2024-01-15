import "1llest-waveform-vue/lib/style.css";
import { createPinia } from "pinia";

import { createApp } from "vue";

import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import IllestWaveform from "./utils/1llest-waveform";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(IllestWaveform);

app.mount("#app");
