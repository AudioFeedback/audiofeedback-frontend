<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const apiUrl = 'http://localhost:3000/auth/login';

const username = ref<string>("");
const password = ref<string>("");
const remember = ref<boolean>(true);
const incorrect = ref<boolean>(false);

if(localStorage.getItem('access_token')) {
    window.location.href = "/";
}

const html = document.querySelector('html');


const checkMode = () => {
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
};


const submitData = async () => {
  try {
    const body = new FormData();
    body.set("username", username.value)
    body.set("password", password.value)
    const jsonbody = JSON.stringify(Object.fromEntries(body));

    const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json"
            }, body: jsonbody
        });

    if(!response) {
      return
    }

    const data = await response.json();
    localStorage.removeItem('access_token');
    if(response.status == 200 || response.status == 201) {
        if(remember.value == true) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = "/";
            return;
        } else {
            window.location.href = "/";
            return;
        }
    } else {
        incorrect.value = true;
        return;
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

onMounted(() => checkMode());
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="h-8 w-32 mr-2" src="./../assets/logo-temp.svg" alt="logo">
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" v-on:submit.prevent="submitData">
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input v-model='username' type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required="true">
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input v-model='password' type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                        </div>
                        <p v-if='incorrect' class="bg-red-100 !mt-2 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Username and/or password is incorrect</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input v-model='remember' id="remember" aria-describedby="remember" type="checkbox" checked class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-sm font-light text-gray-500 dark:text-gray-400">Remember me</label>
                                </div>
                            </div>
                            <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

.width-custom{
    width: calc(100% - 256px);
    
    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>