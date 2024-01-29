import "1llest-waveform-vue/lib/style.css";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

const firebaseConfig = {
    apiKey: "AIzaSyAvupQzj8gxWP6e5HPDS9ThAtw6lqO_-no",
    authDomain: "audiofeedback-auth.firebaseapp.com",
    projectId: "audiofeedback-auth",
    storageBucket: "audiofeedback-auth.appspot.com",
    messagingSenderId: "424609443945",
    appId: "1:424609443945:web:12a889037ef98b5e7832f8"
};

initializeApp(firebaseConfig);
