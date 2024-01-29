<script lang="ts" setup>
import { login } from "@/services/app.service";
import { createUser, getNameExists } from "@/services/users.service";
import { checkMode } from "@/stores/darkmodeStore";
import type { roles } from "@/utils/authorisationhelper";
import { asyncComputed } from "@vueuse/core";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const username = ref<string>("");
const email = ref<string>("");

const password = ref<string>("");
const confirmPassword = ref<string>("");

const firstName = ref<string>("");
const lastName = ref<string>("");

const artistRole = ref<boolean>(false);
const reviewerRole = ref<boolean>(false);

const selectedRoles = computed(() => {
    const roleArray: Array<roles> = [];
    if (artistRole.value) {
        roleArray.push("MUZIEKPRODUCER");
    }
    if (reviewerRole.value) {
        roleArray.push("FEEDBACKGEVER");
    }
    return roleArray;
});

const incorrect = ref<boolean>(false);

const signUp = ref<boolean>(false);

if (localStorage.getItem("access_token")) {
    router.push((route.query.redirect as string) || "/");
}

watch(username, () => (incorrect.value = false));
watch(email, () => (incorrect.value = false));
watch(password, () => (incorrect.value = false));
watch(signUp, () => (incorrect.value = false));

const validatedPasswords = computed(() => {
    return password.value === confirmPassword.value;
});

const usernameInUse = asyncComputed(async () => {
    return (await getNameExists(username.value)).data;
});

const auth = getAuth();

const userSignIn = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

        const response = await login({ access_token: await userCredential.user.getIdToken() });

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
};

const userSignUp = async () => {
    try {
        if (usernameInUse.value && !validatedPasswords.value && selectedRoles.value.length === 0) {
            return;
        }

        const createdUser = await createUserWithEmailAndPassword(auth, email.value, password.value);

        const postResponse = await createUser({
            firstname: firstName.value,
            lastname: lastName.value,
            username: username.value.toLowerCase(),
            sub: createdUser.user.uid,
            roles: selectedRoles.value
        });

        if (!postResponse) {
            return;
        }

        const response = await login({
            access_token: await createdUser.user.getIdToken()
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
                    <form class="space-y-4 md:space-y-6" v-on:submit.prevent="userSignIn">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email"
                                >Email</label
                            >
                            <div class="relative mb-6">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg
                                        aria-hidden="true"
                                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"
                                        />
                                        <path
                                            d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    v-model="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="email"
                                    placeholder="user@example.com"
                                    required
                                    type="text"
                                />
                            </div>
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
                            Email and/or password is incorrect
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
                    <form class="space-y-4 md:space-y-6" v-on:submit.prevent="userSignUp">
                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    for="firstName"
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
                                <label
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    for="lastName"
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
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="username"
                                >Username</label
                            >
                            <input
                                id="username"
                                v-model="username"
                                :class="{
                                    'bg-red-50 border-red-500 text-red-900 ocus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500':
                                        usernameInUse,
                                    'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500':
                                        !usernameInUse
                                }"
                                class="border text-sm rounded-lg block w-full p-2.5"
                                name="username"
                                placeholder="username"
                                required
                                type="text"
                            />
                            <p v-if="usernameInUse" class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
                                Username already in use
                            </p>
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email"
                                >Email</label
                            >
                            <div class="relative mb-6">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg
                                        aria-hidden="true"
                                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"
                                        />
                                        <path
                                            d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    v-model="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="email"
                                    placeholder="user@example.com"
                                    required
                                    type="text"
                                />
                            </div>
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
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                for="confirmPassword"
                                >Confirm password</label
                            >
                            <input
                                id="confirmPassword"
                                v-model="confirmPassword"
                                :class="{
                                    'bg-red-50 border-red-500 text-red-900 ocus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500':
                                        !validatedPasswords,
                                    'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500':
                                        validatedPasswords
                                }"
                                class="border text-sm rounded-lg block w-full p-2.5"
                                name="confirmPassword"
                                placeholder="••••••••"
                                required
                                type="password"
                            />
                            <p
                                v-if="!validatedPasswords"
                                class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium"
                            >
                                Passwords are not the same
                            </p>
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="countries"
                                >Select a role</label
                            >
                            <div class="flex items-center mb-4">
                                <input
                                    id="default-checkbox"
                                    v-model="artistRole"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    type="checkbox"
                                />
                                <label
                                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    for="default-checkbox"
                                    >Artist</label
                                >
                            </div>
                            <div class="flex items-center">
                                <input
                                    id="checked-checkbox"
                                    v-model="reviewerRole"
                                    checked
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    type="checkbox"
                                />
                                <label
                                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    for="checked-checkbox"
                                    >Reviewer</label
                                >
                            </div>
                        </div>

                        <p
                            v-if="incorrect"
                            class="bg-red-100 !mt-2 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                        >
                            Email already in use
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