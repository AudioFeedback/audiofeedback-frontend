import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: import("../views/LoginView.vue")
        },
        {
            path: "/",
            name: "main",
            component: import("../views/MainView.vue")
        },
        {
            path: '/track/:id',
            name: 'track',
            props: true,
            component: import('../views/TrackView.vue'),
        },
        {
            path: "/upload",
            name: "upload",
            component: import("../views/UploadView.vue")
        },
        {
            path: "/profile",
            name: "profile",
            component: import("../views/ProfileView.vue")
        }
    ]
});

export default router;
