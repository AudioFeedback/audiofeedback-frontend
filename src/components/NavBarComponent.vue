<script lang="ts" setup>
import router from "@/router";
import { getProfile } from "@/services/app.service";
import { getLabelAssigned } from "@/services/label.service";
import { checkMode, darkmode, toggleMode } from "@/stores/darkmodeStore";
import type { Components } from "@/types/openapi";
import { getRoles } from "@/utils/authorisationhelper";
import { onMounted, ref } from "vue";

const userInfo = ref<Components.Schemas.GetUserWithNotificationsDto>();
const labelInfo = ref<Array<Components.Schemas.GetLabelDto>>();
const currentLabel = ref<Components.Schemas.GetLabelDto>();
const dropdownUser = ref<boolean>(false);

const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
};

const toggleSidebar = () => {
    const sidebar = document.getElementById("separator-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("-translate-x-full");
    }
};

const getUserInfo = async () => {
    const response = await getProfile();
    userInfo.value = response.data;
};

const getLabel = async () => {
    const response = await getLabelAssigned();
    labelInfo.value = response.data;
};

const loadLabel = async () => {
    localStorage.getItem("currentLabel");
    currentLabel.value = JSON.parse(localStorage.getItem("currentLabel") || "{}");
};

const setSelectedLabel = (label: Components.Schemas.GetLabelDto) => {
    currentLabel.value = label;
    localStorage.setItem("currentLabel", JSON.stringify(currentLabel.value));
    dropdownUser.value = false;
};

onMounted(() => {
    getUserInfo();
    checkMode();
    getLabel();
    loadLabel();
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
                        <img alt="logo" class="h-auto w-48 mr-2 pt-4" src="./../assets/logo-temp.svg" />
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
                    <li v-if="getRoles()?.includes('MUZIEKPRODUCER')">
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
                    <li v-if="getRoles()?.includes('ADMIN')">
                        <router-link
                            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            to="/manage-users"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 18"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
                                />
                            </svg>
                            <span class="flex-1 ml-3 whitespace-nowrap">Manage Users</span>
                        </router-link>
                    </li>
                </ul>
                <ul
                    class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                    <li v-if="getRoles()?.includes('ADMIN') || getRoles()?.includes('FEEDBACKGEVER')" class="relative">
                        <button
                            class="text-white w-full bg-blue-700 justify-between hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                            @click="dropdownUser = !dropdownUser"
                        >
                            <div v-if="currentLabel" class="flex flex-row items-center">
                                <img
                                    :alt="currentLabel.name"
                                    :src="currentLabel.profilePicture"
                                    class="w-8 h-8 me-2 rounded-full"
                                />
                                {{ currentLabel.name }}
                            </div>
                            <svg
                                aria-hidden="true"
                                class="w-2.5 h-2.5 ms-3"
                                fill="none"
                                viewBox="0 0 10 6"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m1 1 4 4 4-4"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </svg>
                        </button>

                        <div
                            v-if="dropdownUser"
                            class="z-10 bottom-0 mb-14 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700"
                        >
                            <ul
                                aria-labelledby="dropdownUsersButton"
                                class="py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
                            >
                                <li
                                    v-for="(label, i) in labelInfo"
                                    :key="i"
                                    :value="label.name"
                                    @click="setSelectedLabel(label)"
                                >
                                    <div
                                        v-if="currentLabel"
                                        class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        <img
                                            :alt="label.name"
                                            :src="currentLabel.profilePicture"
                                            class="w-6 h-6 me-2 rounded-full"
                                        />
                                        {{ label.name }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
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
                    <li v-if="userInfo">
                        <router-link class="flex items-center space-x-4" to="/profile">
                            <div
                                class="relative inline-flex items-center justify-center w-10 h-10 bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-medium text-gray-300 dark:text-gray-300"
                                    >{{ userInfo.firstname.slice(0, 1) }}{{ userInfo.lastname.slice(0, 1) }}</span
                                >
                                <!--todo set on notification-->
                                <span
                                    v-if="userInfo.notifications"
                                    class="absolute z-50 top-1 left-7 transform -translate-y-1/2 w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"
                                ></span>
                            </div>
                            <div class="font-medium dark:text-white">
                                <div>{{ userInfo.firstname }} {{ userInfo.lastname }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">@{{ userInfo.username }}</div>
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