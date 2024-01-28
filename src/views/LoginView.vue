<script lang="ts" setup>
import { login } from "@/services/app.service";
import { createUser } from "@/services/users.service";
import { checkMode } from "@/stores/darkmodeStore";
import type { roles } from "@/utils/authorisationhelper";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const username = ref<string>("");

const password = ref<string>("");

const firstName = ref<string>("");
const lastName = ref<string>("");

type roleObjectEntry = { visualName: string; value: roles };

const roleObject: Array<roleObjectEntry> = [
    { visualName: "Artist", value: "MUZIEKPRODUCER" },
    { visualName: "Reviewer", value: "FEEDBACKGEVER" },
    { visualName: "Admin", value: "ADMIN" }
];

const role = ref<roleObjectEntry>(roleObject[0]);

const incorrect = ref<boolean>(false);

const signUp = ref<boolean>(false);

if (localStorage.getItem("access_token")) {
    router.push((route.query.redirect as string) || "/");
}

watch(username, () => (incorrect.value = false));
watch(password, () => (incorrect.value = false));
watch(signUp, () => (incorrect.value = false));

const submitData = async () => {
    incorrect.value = false;
    if (!signUp.value) {
        try {
            const response = await login({ username: username.value, password: password.value });

            if (!response) {
                return;
            }

            const data = response.data;

            localStorage.removeItem("access_token");
            if (response.status == 200 || response.status == 201) {
                localStorage.setItem("access_token", data.access_token);
                await router.push((route.query.redirect as string) || "/");
                router.go(0);
                return router.go(0);
            } else {
                incorrect.value = true;
                return;
            }
        } catch (error) {
            console.error("API Error:", error);
            incorrect.value = true;
        }
    } else {
        try {
            const postResponse = await createUser({
                firstname: firstName.value,
                lastname: lastName.value,
                username: username.value,
                password: password.value,
                roles: [role.value.value]
            });

            if (!postResponse) {
                return;
            }

            const response = await login({
                username: username.value,
                password: password.value
            });

            if (!response) {
                return;
            }

            const data = response.data;

            localStorage.removeItem("access_token");
            if (response.status == 200 || response.status == 201) {
                localStorage.setItem("access_token", data.access_token);
                await router.push((route.query.redirect as string) || "/");
                router.go(0);
                return router.go(0);
            } else {
                incorrect.value = true;
                return;
            }
        } catch (e) {
            console.error(e);
            incorrect.value = true;
        }
    }
};

onMounted(() => checkMode());
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-900 w-full">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white" href="#">
                <img alt="logo" class="h-auto w-80 mr-2 pb-4" src="./../assets/logo-temp.svg" />
            </a>
            <div
                v-if="!signUp"
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
                                required
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
                                required
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
                            <a
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                @click="signUp = true"
                            >
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            <div
                v-else
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
            >
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                    >
                        Create a new account
                    </h1>
                    <form class="space-y-4 md:space-y-6" v-on:submit.prevent="submitData">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="firstName"
                                >First name</label
                            >
                            <input
                                id="firstName"
                                v-model="firstName"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="firstName"
                                placeholder="John"
                                required
                                type="text"
                            />
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="lastName"
                                >Last name</label
                            >
                            <input
                                id="lastName"
                                v-model="lastName"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="lastName"
                                placeholder="Doe"
                                required
                                type="text"
                            />
                        </div>
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
                                required
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
                                required
                                type="password"
                            />
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="countries"
                                >Select a role</label
                            >
                            <select
                                id="role"
                                v-model="role"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option v-for="(role, i) in roleObject" :key="i" :value="role">
                                    {{ role.visualName }}
                                </option>
                            </select>
                        </div>

                        <p
                            v-if="incorrect"
                            class="bg-red-100 !mt-2 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                        >
                            Username already exists
                        </p>
                        <button
                            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            type="submit"
                        >
                            Sign up
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account?
                            <a
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                @click="signUp = false"
                            >
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>