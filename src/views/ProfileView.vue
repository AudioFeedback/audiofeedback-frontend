<script lang="ts" setup>
import Toasts from "@/components/Toasts-Popup.vue";
import { getProfile } from "@/services/app.service";
import { acceptInvite, declineInvite, getLabelInvites } from "@/services/label.service";
import { updateUser, updateUserRoles } from "@/services/users.service";
import type { Components } from "@/types/openapi";
import type { roles } from "@/utils/authorisationhelper";
import type { ToastType } from "@/utils/types";
import { initFlowbite } from "flowbite";
import { computed, onMounted, ref } from "vue";

const userinfo = ref<Components.Schemas.GetUserDto>({ id: 0, username: "", firstname: "", lastname: "", roles: [] });
const confirmDeletion = ref<boolean>();
const firstname = ref<string>();
const lastname = ref<string>();
const password = ref<string>();
const confirm_password = ref<string>();
const invites = ref<Components.Schemas.GetLabelMemberWithLabelDto[] | null>();
const labelmemberid = ref<number>(0);
const toasttype = ref<ToastType>();
const toastmessage = ref<string | null>();

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

const updateRoles = async () => {
    await updateUserRoles({ roles: selectedRoles.value });
};

const getUserInfo = async () => {
    const response = await getProfile();

    userinfo.value = response.data;

    artistRole.value = response.data.roles.includes("MUZIEKPRODUCER");
    reviewerRole.value = response.data.roles.includes("FEEDBACKGEVER");

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

const validatedPasswords = computed(() => {
    return password.value === confirm_password.value;
});

const checkFormValid = async () => {
    try {
        if (validatedPasswords.value) {
            editUser();
            return;
        }
    } catch (error) {
        toasttype.value = "error";
        toastmessage.value = "Something went wrong, please try again";
        setTimeout(() => {
            toasttype.value = null;
            toastmessage.value = null;
        }, 5000);
        return;
    }
};

const getInvited = async () => {
    const response = await getLabelInvites();
    if (!response) {
        return;
    } else {
        if (!response.data[0]) {
            return;
        }
        labelmemberid.value = response.data[0]?.id;
        invites.value = response.data;
    }
};

const acceptLabelInvite = async (id: number) => {
    const response = await acceptInvite(id, {
        labelMemberId: Number(labelmemberid.value)
    });
    if (!response) {
        return;
    }
    invites.value = null;
    labelmemberid.value = 0;
    await getInvited();
};

const declineLabelInvite = async (id: number) => {
    const response = await declineInvite(id, {
        labelMemberId: Number(labelmemberid.value)
    });
    if (!response) {
        return;
    }
    invites.value = null;
    labelmemberid.value = 0;
    await getInvited();
};

const editUser = async () => {
    try {
        const response = await updateUser({
            firstname: firstname.value ?? userinfo.value.firstname,
            lastname: lastname.value ?? userinfo.value.lastname
        });

        await updateRoles();

        if (!response) {
            return;
        } else {
            toasttype.value = "succes";
            toastmessage.value = "Account updated";
            setTimeout(() => {
                toasttype.value = null;
                toastmessage.value = null;
            }, 5000);

            window.location.href = "/profile";
            return;
        }
    } catch (error) {
        toasttype.value = "error";
        toastmessage.value = "Something went wrong, please try again";
        setTimeout(() => {
            toasttype.value = null;
            toastmessage.value = null;
        }, 5000);
        return;
    }
};

onMounted(async () => {
    await getUserInfo();
    await getInvited();
});
</script>

<template>
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900">
        <section>
            <div class="max-w-2xl">
                <div class="flex flex-col items-center w-full">
                    <div v-for="(invite, i) in invites" :key="i" class="w-full">
                        <div
                            v-if="(invite as any).status === 'INVITED'"
                            id="alert-additional-content-1"
                            class="p-4 w-full mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
                            role="alert"
                        >
                            <div class="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    class="flex-shrink-0 w-4 h-4 me-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
                                    />
                                </svg>
                                <span class="sr-only">New invite</span>
                                <h3 class="text-lg font-medium">
                                    You have a new invite from the label "{{ invite.label.name }}"
                                </h3>
                            </div>
                            <div class="mt-2 ml-6 mb-6 text-sm">
                                <span class="font-medium">Label information:</span>
                                <ul class="mt-1.5 list-disc list-inside">
                                    <li>label description: {{ invite.label.description }}</li>
                                    <li>
                                        label website:
                                        <a
                                            :href="invite.label.websiteUrl"
                                            class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
                                            >{{ invite.label.websiteUrl }}</a
                                        >
                                    </li>
                                    <li>label genre: {{ invite.label.genre }}</li>
                                </ul>
                            </div>
                            <div class="flex">
                                <button
                                    class="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    type="button"
                                    @click="acceptLabelInvite(invite.label.id)"
                                >
                                    Accept invite
                                </button>
                                <button
                                    class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                    type="button"
                                    @click="declineLabelInvite(invite.label.id)"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        !validatedPasswords,
                                    'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500':
                                        validatedPasswords
                                }"
                                class="border text-sm rounded-lg block w-full p-2.5"
                                placeholder="•••••••••"
                                type="password"
                            />
                            <p
                                v-if="!validatedPasswords"
                                class="absolute mt-1 text-sm text-red-600 dark:text-red-500 font-medium"
                            >
                                Password are not the same
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
        <Toasts v-if="toasttype && toastmessage" :message="toastmessage" :type="toasttype" />
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