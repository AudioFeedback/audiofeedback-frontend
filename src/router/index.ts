import type { roles } from "@/utils/authorisationhelper";
import { getRoles } from "@/utils/authorisationhelper";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue")
        },
        {
            path: "/",
            name: "main",
            component: () => import("../views/MainView.vue")
        },
        {
            path: "/track/:id",
            name: "track",
            props: true,
            component: () => import("../views/TrackView.vue"),
            meta: { role: ["MUZIEKPRODUCER"] }
        },
        {
            path: "/upload",
            name: "upload",
            component: () => import("../views/UploadView.vue"),
            meta: { role: ["MUZIEKPRODUCER"] }
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("../views/ProfileView.vue")
        },
        {
            path: "/feedback/:id",
            name: "feedback",
            component: () => import("../views/AddFeedbackView.vue"),
            meta: { role: ["FEEDBACKGEVER"] }
        },
        {
            path: "/manage-track/:id",
            name: "manage track",
            component: () => import("../views/AdminTrackView.vue"),
            meta: { role: ["ADMIN"] }
        }
    ]
});

router.beforeEach((to, _, next) => {
    const roles = getRoles();

    if (to.name !== "login" && !roles) {
        {
            return next({ name: "login" });
        }
    }

    let hasAccess = false;

    const requiredRoles = <Array<roles>>to.meta.role;

    if (!requiredRoles) {
        return next();
    }

    roles!.forEach((role) => {
        if (requiredRoles.includes(role)) {
            hasAccess = true;
        }
    });

    if (hasAccess) {
        return next();
    }
});

export default router;
