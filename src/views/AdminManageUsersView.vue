<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { onMounted, ref } from "vue";

const ShowOverlay = ref<any>();

const reviewers = [
    {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        username: "johndoe",
        roles: ["Reviewer"]
    },
    {
        id: 2,
        firstname: "Jane",
        lastname: "Doe",
        username: "janedoe",
        roles: ["Reviewer"]
    },
    {
        id: 3,
        firstname: "Remco",
        lastname: "Verhoef",
        username: "remcoverhoef",
        roles: ["Reviewer"]
    },
    {
        id: 4,
        firstname: "Jeroen",
        lastname: "van der Heijden",
        username: "jeroenvanderheijden",
        roles: ["Reviewer"]
    }
];

const Showoverlay = (reviewer: any) => {
    if (ShowOverlay.value == reviewer.id) {
        ShowOverlay.value = null;
        return;
    }
    ShowOverlay.value = reviewer.id;
};

const getAllReviewers = () => {
    
    console.log("getAllReviewers");
};

onMounted(() => {
    getAllReviewers();
});
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage Reviewers</h2>
        <div class="relative shadow-sm sm:rounded-lg">
            <table aria-label="Manage reviewer table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3" scope="col">Name</th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Role</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Status</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <span class="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(reviewer, i) in reviewers"
                        :key="i"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                        <th
                            class="px-6 py-4 flex flex-row align-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            scope="row"
                        >
                            <div
                                class="relative mr-2 inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-medium text-gray-300 dark:text-gray-300"
                                    >{{ reviewer.firstname.slice(0, 1) }}{{ reviewer.lastname.slice(0, 1) }}</span
                                >
                            </div>
                            <div class="flex flex-col align-left justify-center">
                                <p class="font-semibold">{{ reviewer.firstname }} {{ reviewer.lastname }}</p>
                                <p class="text-gray-600 dark:text-gray-400">@{{ reviewer.username }}</p>
                            </div>
                        </th>
                        <td class="px-6 py-4">
                            {{ reviewer.roles[0] }}
                        </td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                                Accepted
                        </span>
                        <span class="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                            <span class="w-2 h-2 me-1 bg-yellow-500 rounded-full"></span>
                            Invite Send
                        </span>
                        <span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                            <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                            Declined
                        </span>
                        </td>
                        <td class="px-6 py-4 text-right relative">
                            <button
                                class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                @click="Showoverlay(reviewer)"
                            >
                                <svg
                                    aria-hidden="true"
                                    class="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 16 3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                                    />
                                </svg>
                            </button>
                            <div
                                v-if="ShowOverlay == reviewer.id"
                                class="z-10 absolute right-6 top-50 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-1 w-44 dark:bg-gray-700 dark:divide-gray-600"
                            >
                                <ul
                                    aria-labelledby="dropdownMenuIconHorizontalButton"
                                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                >
                                    <li>
                                        <a
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            href="#"
                                            >Change Role</a
                                        >
                                    </li>
                                </ul>
                                <div class="py-2">
                                    <a
                                        class="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:hover:bg-red-600 dark:text-red-200 dark:hover:text-white"
                                        href="#"
                                        >Delete {{ reviewer.firstname }} {{ reviewer.lastname }}</a
                                    >
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                class="text-white w-full mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-auto font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                Add reviewers
            </button>
        </div>
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