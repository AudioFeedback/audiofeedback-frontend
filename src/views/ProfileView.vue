<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import type { Components } from "@/types/openapi";
import { onMounted, ref } from "vue";

let userinfo = ref<Components.Schemas.GetUserDto>({ id: 0, username: "", firstname: "", lastname: "", roles: [] });

let password = ref<string>("");

const getuserinfo = async () => {
    const apiUrl = "http://localhost:3000/profile";

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            accept: "*/*",
            authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    });

    userinfo.value = await response.json();
};
onMounted(() => getuserinfo());
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <!-- <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage account</h2> -->
        <section>
            <div class="max-w-2xl">
                <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update product</h2>
                <form action="#">
                    <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="first_name"
                                >First name</label
                            >
                            <input
                                id="first_name"
                                :value="userinfo.firstname"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Firstname"
                                type="text"
                            />
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="last_name"
                                >Last name</label
                            >
                            <input
                                id="last_name"
                                :value="userinfo.lastname"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Lastname"
                                type="text"
                            />
                        </div>
                        <div>
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white inline-flex items-center"
                                for="username"
                            >
                                Username
                                <button class="bg-transparent ml-2" data-tooltip-target="tooltip-default" type="button">
                                    <svg
                                        aria-hidden="true"
                                        class="w-4 h-4 text-gray-500 dark:text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"
                                        />
                                    </svg>
                                </button>
                                <div
                                    id="tooltip-default"
                                    class="absolute z-100 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                                    role="tooltip"
                                >
                                    Tooltip content
                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <span class="text-base text-gray-500 dark:text-gray-400">@</span>
                                </div>
                                <input
                                    id="username"
                                    :value="userinfo.username"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="username"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div></div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="password"
                                >Update password</label
                            >
                            <input
                                id="password"
                                :value="password"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="•••••••••"
                                type="password"
                            />
                        </div>
                        <div>
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                for="confirm_password"
                                >Confirm password</label
                            >
                            <input
                                id="confirm_password"
                                :value="password"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="•••••••••"
                                type="password"
                            />
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button
                            class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            type="submit"
                        >
                            Update account
                        </button>
                        <button
                            class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            type="button"
                        >
                            <svg
                                class="w-5 h-5 mr-1 -ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clip-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    fill-rule="evenodd"
                                ></path>
                            </svg>
                            Delete account
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </main>
</template>

<style>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>