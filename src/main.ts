import { createPinia } from "pinia";

import { createApp } from "vue";

import { AVPlugin } from "vue-audio-visual";

import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(AVPlugin);

app.mount("#app");
