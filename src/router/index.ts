import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/14-days",
        },
        {
            path: "/14-days",
            name: "14-days",
            component: () => import("@/views/Days14.vue"),
        },
        {
            path: "/month",
            name: "month",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("@/views/Month.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "/14-days",
        },
    ],
});

export default router;
