<script lang="ts" setup>
import { getProfile } from "@/services/app.service";
import { acceptInvite, getLabelInvites, declineInvite } from "@/services/label.service";
import type { Components } from "@/types/openapi";
import { initFlowbite } from "flowbite";
import { onMounted, ref } from "vue";

const userinfo = ref<Components.Schemas.GetUserDto>({ id: 0, username: "", firstname: "", lastname: "", roles: [] });
const confirmDeletion = ref<boolean>();
const username = ref<string>();
const firstname = ref<string>();
const lastname = ref<string>();
const password = ref<string>();
const confirm_password = ref<string>();
const password_match = ref<boolean>(true);
const invites = ref<any>();
const labelmemberid = ref<number>(0);

const getUserInfo = async () => {
    const response = await getProfile();

    userinfo.value = response.data;
    username.value = response.data.username;
    firstname.value = response.data.firstname;
    lastname.value = response.data.lastname;
    initFlowbite();
};

const deleteAccount = async () => {
    //     const response = await deleteUser(userinfo.value.id as number);
    //
    //     if (response.status === 200) {
    //         confirmDeletion.value = false;
    //         localStorage.removeItem("token");
    //         window.location.href = "/";
    //     } else {
    //         alert("Something went wrong, please try again");
    //         confirmDeletion.value = false;
    //     }
};

const validatePassword = async () => {
    if (password.value !== confirm_password.value) {
        password_match.value = false;
        return;
    } else {
        password_match.value = true;
    }
};

const checkFormValid = async () => {
    try {
        if (password_match.value) {
            // editUser();
            return;
        }
    } catch (error) {
        console.log(error);
        alert("Something went wrong, please try again");
        return;
    }
};

const getInvited = async () => {
    const reponse = await getLabelInvites();
    if (!reponse) {
        return;
    } else {
        if(!reponse.data[0]){
            return;
        }
        labelmemberid.value = reponse.data[0]?.id;
        invites.value = reponse.data[0].label;
    }
}

const acceptlabelInvite = async () => {
  const response = await acceptInvite(invites.value.id, {
    labelMemberId: Number(labelmemberid.value),
  });
  if (!response) {
    return;
  }
  console.log('acceptinvite:',response.data);
};


const declinelabelInvite = async () => {
  const response = await declineInvite(invites.value.id, {
    labelMemberId: Number(labelmemberid.value),
  });
  if (!response) {
    return;
  }
  console.log('acceptinvite:',response.data);
};

const editUser = async () => {
    //     try {
    //         const response = await updateUser(
    //             {
    //                 username: username.value ?? userinfo.value.username,
    //                 firstname: firstname.value ?? userinfo.value.firstname,
    //                 lastname: lastname.value ?? userinfo.value.lastname,
    //                 password: password.value
    //             },
    //             userinfo.value.id as number
    //         );
    //
    //         if (!response) {
    //             return;
    //         } else {
    //             alert("Account updated");
    //             return;
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         alert("Something went wrong, please try again");
    //         return;
    //     }
};

onMounted(async () => {
    await getUserInfo();
    await getInvited();
});
</script>

<template>
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <section>
            <div class="max-w-2xl">
                <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update account</h2>
                <form v-on:submit.prevent="checkFormValid()">
                    <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="first_name"
                                >First name</label
                            >
                            <input
                                id="first_name"
                                v-model="firstname"
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
                                v-model="lastname"
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
                                    Your username is public.
                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <span class="text-base text-gray-500 dark:text-gray-400">@</span>
                                </div>
                                <input
                                    id="username"
                                    v-model="username"
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
                                v-model="password"
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
                                v-model="confirm_password"
                                :class="{
                                    'bg-red-50 border-red-500 text-red-900 ocus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500':
                                        !password_match,
                                    'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500':
                                        password_match
                                }"
                                class="border text-sm rounded-lg block w-full p-2.5"
                                placeholder="•••••••••"
                                type="password"
                                @blur="validatePassword()"
                            />
                            <p v-if="!password_match" class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
                                Password are not the same
                            </p>
                        </div>
                    </div>

                    <!--LABEL INVITES-->
                    <div v-if='invites' id="alert-additional-content-1" class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                        <div class="flex items-center">
                            <svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span class="sr-only">New invite</span>
                            <h3 class="text-lg font-medium">You have an new invite from the label "{{ invites.name }}"</h3>
                        </div>
                        <div class="mt-2 ml-6 mb-6 text-sm">
                            <span class="font-medium">Label information:</span>
                                <ul class="mt-1.5 list-disc list-inside">
                                    <li>label description: {{ invites.description }}</li>
                                    <li>label website: 
                                        <a :href="invites.websiteUrl" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">{{invites.websiteUrl}}</a>
                                    </li>
                                    <li>label genre: {{ invites.genre }}</li>
                                </ul>
                        </div>
                        <div class="flex">
                            <button @click='acceptlabelInvite()' type="button" class="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Accept invite
                            </button>
                            <button @click='declinelabelInvite()' type="button" class="text-blue-800 bg-transparent border border-blue-800 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-blue-600 dark:text-blue-400 dark:hover:text-white dark:focus:ring-blue-800" data-dismiss-target="#alert-additional-content-1" aria-label="Close">
                            Decline invite
                            </button>
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
                            @click="confirmDeletion = !confirmDeletion"
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

                    <div
                        v-if="confirmDeletion"
                        class="overflow-y-auto overflow-x-hidden flex flex-row items-center bg-gray-200/[.7] justify-center fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                    >
                        <div class="relative p-4 w-full max-w-md max-h-full">
                            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button
                                    class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    type="button"
                                    @click="confirmDeletion = !confirmDeletion"
                                >
                                    <svg
                                        aria-hidden="true"
                                        class="w-3 h-3"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                        />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                                <div class="p-4 md:p-5 text-center">
                                    <svg
                                        aria-hidden="true"
                                        class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                        />
                                    </svg>
                                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Are you sure you want to delete your account? This action is permanent
                                    </h3>
                                    <button
                                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                        @click="deleteAccount()"
                                    >
                                        Yes, I'm sure
                                    </button>
                                    <button
                                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                        @click="confirmDeletion = !confirmDeletion"
                                    >
                                        No, cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </main>
</template>

<style scoped>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>