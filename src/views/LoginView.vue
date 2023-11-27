<script lang="ts" setup>
import { login } from "@/services/app.service";
import { checkMode } from "@/stores/darkmodeStore";
import router from '@/router';
import { VueElement, onMounted, ref } from "vue";

const username = ref<string>("");
const password = ref<string>("");
const remember = ref<boolean>(true);
const incorrect = ref<boolean>(false);

if (localStorage.getItem("access_token")) {
    router.push('/');
}

const submitData = async () => {
    try {
        const response = await login({ username: username.value, password: password.value });

        if (!response) {
            return;
        }

        const data = response.data;

        localStorage.removeItem("access_token");
        if (response.status == 200 || response.status == 201) {
            if (remember.value == true) {
                localStorage.setItem("access_token", data.access_token);
                router.push('/');
                router.go(0);
                return;
            } else {
                router.push('/');
                router.go(0);
                return;
            }
        } else {
            incorrect.value = true;
            return;
        }
    } catch (error) {
        console.error("API Error:", error);
    }
};

onMounted(() => checkMode());
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white" href="#">
                <img alt="logo" class="h-8 w-32 mr-2" src="./../assets/logo-temp.svg" />
            </a>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
            >
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                    >
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" v-on:submit.prevent="submitData">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="username"
                                >Username</label
                            >
                            <input
                                id="username"
                                v-model="username"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="username"
                                placeholder="username"
                                required="true"
                                type="text"
                            />
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="password"
                                >Password</label
                            >
                            <input
                                id="password"
                                v-model="password"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="password"
                                placeholder="••••••••"
                                required="true"
                                type="password"
                            />
                        </div>
                        <p
                            v-if="incorrect"
                            class="bg-red-100 !mt-2 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                        >
                            Username and/or password is incorrect
                        </p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input
                                        id="remember"
                                        v-model="remember"
                                        aria-describedby="remember"
                                        checked
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        type="checkbox"
                                    />
                                </div>
                                <div class="ml-3 text-sm">
                                    <label class="text-sm font-light text-gray-500 dark:text-gray-400" for="remember"
                                        >Remember me</label
                                    >
                                </div>
                            </div>
                            <a
                                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                href="#"
                                >Forgot password?</a
                            >
                        </div>
                        <button
                            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            type="submit"
                        >
                            Sign in
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet?
                            <a class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>