<script lang="ts" setup>
import { getProfile } from "@/services/app.service";
import { darkmode } from "@/stores/darkmodeStore";
import type { Components } from "@/types/openapi";
import { onMounted, ref } from "vue";

let userinfo = ref<Components.Schemas.GetUserDto>();

const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
};

const toggleSidebar = () => {
    const sidebar = document.getElementById("separator-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("-translate-x-full");
    }
};

const toggleMode = () => {
    const currentMode = localStorage.getItem("mode");
    if (currentMode === "dark") {
        localStorage.setItem("mode", "light");
        darkmode.value = false;
    } else {
        localStorage.setItem("mode", "dark");
        darkmode.value = true;
    }
};

const checkMode = () => {
    const mode = localStorage.getItem("mode");
    darkmode.value = mode === "dark";
};

const getUserInfo = async () => {
    const response = await getProfile();

    userinfo.value = response.data;
};

onMounted(() => {
    getUserInfo();
    checkMode();
});
</script>

<template>
    <button
        aria-controls="separator-sidebar"
        class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        type="button"
        @click="toggleSidebar()"
    >
        <span class="sr-only">Open sidebar</span>
        <svg
            aria-hidden="true"
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                clip-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                fill-rule="evenodd"
            ></path>
        </svg>
    </button>

    <aside
        id="separator-sidebar"
        aria-label="Sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-gray-200 dark:border-gray-700"
    >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div class="flex flex-col h-full justify-between">
                <ul class="space-y-2 font-medium">
                    <a class="flex items-center pl-2.5 mb-5" href="/">
                        <img alt="logo" class="h-8 w-32 mr-2" src="./../assets/logo-temp.svg" />
                    </a>
                    <li>
                        <router-link
                            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            to="/"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 22 21"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"
                                />
                                <path
                                    d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"
                                />
                            </svg>
                            <span class="ml-3">Dashboard</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            to="/upload"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z"
                                />
                                <path
                                    d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                                />
                            </svg>
                            <span class="flex-1 ml-3 whitespace-nowrap">Upload Track</span>
                        </router-link>
                    </li>
                </ul>
                <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                    <li @click="toggleMode()">
                        <a
                            v-if="darkmode"
                            class="cursor-pointer flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-800 dark:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"
                                />
                            </svg>
                            <span class="ml-3">Switch to lightmode</span>
                        </a>
                        <a
                            v-if="!darkmode"
                            class="cursor-pointer flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-800 dark:text-white"
                                fill="currentColor"
                                viewBox="0 0 18 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"
                                />
                            </svg>
                            <span class="ml-3">Switch to darkmode</span>
                        </a>
                    </li>
                    <li v-if="userinfo">
                        <router-link class="flex items-center space-x-4" to="/profile">
                            <div
                                class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-medium text-gray-300 dark:text-gray-300"
                                    >{{ userinfo.firstname.slice(0, 1) }}{{ userinfo.lastname.slice(0, 1) }}</span
                                >
                            </div>
                            <div class="font-medium dark:text-white">
                                <div>{{ userinfo.firstname }} {{ userinfo.lastname }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">@{{ userinfo.username }}</div>
                            </div>
                        </router-link>
                    </li>
                    <li @click="logout()">
                        <a
                            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <svg
                                aria-hidden="true"
                                class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                fill="none"
                                viewBox="0 0 18 16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </svg>
                            <span class="flex-1 ml-3 whitespace-nowrap">Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>

<style scoped></style>